(function (window, $) {
    var reduceSum = function (a, b) {return a + b};
    var doSum = function (col) {return col.reduce(reduceSum, 0)};
    var getProperty = function (name) {return function (item) {return item[name];}};
    var percentInRad = 2 * Math.PI / 100;
    var pieSlice = function (percentage) {return percentage * percentInRad};
    var angToPercent = function (ang) {return ang / percentInRad};
    var copy = function (source, target) {
        var copy = target || {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                copy[key] = source[key];
            }
        }
        return copy;
    };


    var id = 0;

    /**
     * Эта стратегия предполагает, что при изменении одного значения меняются так же и все остальные.
     * Если пользователь увеличит значение на 20%, значит все прочие уменьшатся так, что
     *  - их пропорции между собой сохранятся
     *  - суммарно они уменьшатся на те же 20%
     * Аналогично и для уменьшения.
     * @type {{setValue: Function}}
     */
    var ChangeAllStrategy = {
        /**
         * Выставляет новое значение для изменяемого элемента и одновременно меняет все остальные элементы.
         * При изменении элемента обязательно должен сохраниться его angStart - стартовый угол. Иначе изображение будет "прыгать"
         * перед пользователем.
         *
         * @param item изменяемый элемент
         * @param newValue новое значение. Если меньше 0 то будет считаться 0. Если больше 100 то будет считаться 100.
         * @param allItems список всех элементов, включая изменяемый
         */
        setValue: function (item, newValue, allItems) {
            newValue = Math.min(Math.max(newValue, 0), 100);
            var remaining = 100 - newValue;
            var oldRemaining = 100 - item.value;
            var changeFactor = remaining / oldRemaining;
            //re-sort to make this item first
            while (allItems[0].id !== item.id) {
                allItems.unshift(allItems.pop());
            }
            item.value = newValue;
            allItems.slice(1).forEach(function (i) {
                i.value = i.value * changeFactor;
            });
        }
    };

    var ChangeNeighborsStrategy = {
        /**
         * Выставляет новое значение для изменяемого элемента и одновременно меняет соседний справа элемент.
         * Для последнего элемент соседним справа будет первый элемент.
         * При изменении элемента обязательно должен сохраниться его angStart - стартовый угол. Иначе изображение будет "прыгать"
         * перед пользователем.
         *
         * @param item изменяемый элемент
         * @param newValue новое значение. Если меньше 0 то будет считаться 0. Если больше 100 то будет считаться 100.
         * @param allItems список всех элементов, включая изменяемый
         */

        setValue: function (item, newValue, allItems) {
            var index = allItems.indexOf(item);

            function next(idx) {
                return idx == allItems.length - 1 ? 0 : idx + 1;
            }

            var neighborIdx = next(index);
            var neighbor = allItems[neighborIdx];
            var maxValue = item.value + neighbor.value;
            newValue = Math.min(Math.max(newValue, 0), maxValue);

            //re-sort to make this item first
            while (allItems[0].id !== item.id) {
                allItems.unshift(allItems.pop());
            }

            item.value = newValue;
            neighbor.value = maxValue - newValue;
        }


    };

    /**
     * Представляет собой модель для отрисовки Pie Chart.
     * @param model - массив структур {name: "имя элемента", value: доля}
     * Доля может быть любым числом и их сумма необязательно должна быть равна 100. В этом случае модель будет нормализована.
     *
     * Внимание: все изменения будут проводиться прямо внутри объекта model, т.е. после всех изменений именно объект model передаваемый в конструкторе
     * будет содержать итоговые значения.
     *
     * PieChartModel может менять следующее:
     * - value - значения элементов. Сумма всех значений всегда будет 100
     * - deleted - этот флаг выставляется при удалении элемента. Его value может быть не равно 0 и должно игнорироваться.
     *
     * PieChartModel не должна менять имена и порядок элементов.
     *
     * PieChartModel генерирует следующие jQuery события
     * - pieChanged - при любом изменении pieChart - изменение значение, удаление элемента
     *
     */
    function PieChartModel(model) {
        var sum = doSum(model.map(getProperty("value")));
        var self = this;
        var cursor = 0;
        this.items = [];
        model.forEach(function (item, index) {
            var val = item.value * 100 / sum;
            self.items.push({
                id       : self._genId(),
                modelItem: item,
                name     : item.name,
                className: item.className || "item-" + index,
                value    : val,
                angStart : cursor,
                deleted  : false,
                angEnd   : cursor + pieSlice(val)
            });
            if (item.value !== val) {
                item.value = val;
            }
            cursor += pieSlice(val)
        });
        this._changeStrategy = ChangeAllStrategy;
    }

    PieChartModel.prototype = {


        /**
         * Возвращает список элементов, которые должны быть отображены на pie chart.
         * Предупреждение: не нужно менять возвращаемые здесь значения, это может нарушить работу компонента.
         * Копирование не выполняется для лучшего быстродействия.
         * @returns {Array} структур со следующими данными:
         *  - id - внутренний идентификатор
         *  - modelItem - элемент из модели, переданной в конструктор
         *  - name - имя элемента. Должно совпадать с modelItem.name, вынесено для удобства
         *  - className - специфическое имя класса для отображения
         *  - value - текущее значение элемента. Должно совпадать со значением в modelItem.value, вынесено для удобства
         *  - angStart - угол в радианах откуда нужно рисовать pie slice для этого элемента
         *  - angEnd - угол в радианах до которого нужно рисовать pie slice. Всегда больше angStart
         *  - deleted - признак удаления элемента. Удаленные элементы не нужно рендерить
         */
        getItems: function () {
            return this.items;
        },

        _genId: function () {
            return id++;
        },

        /**
         * Выставляет новый "конечный" угол для элемента.
         * Предполагается что этот метод будет вызываться при таскании мышкой.
         * @param item элемент из getItems()
         * @param newValue новое значение. Может быть больше либо меньше angStart соотв. элемента.
         *
         * Порождает pieChanged event.
         */
        setAngleEnd: function (item, newValue) {
            this._setValue(item, angToPercent(this._calculateAngleEnd(item, newValue)));
        },

        _calculateAngleEnd: function (item, newValue) {
            var newAng = newValue - item.angStart;
            while (newAng < -Math.PI) {
                newAng += Math.PI * 2;
            }
            return newAng;
        },

        /**
         * Меняет текущую стратегию изменения. По-умолчанию использется @link{ChangeAllStrategy}.
         * Для интерфейса, который должна реализовывать стратегия, см @link{ChangeAllStrategy}
         * @throws если strategy null
         * @throws если strategy не содержит метода setValue
         */
        changeStrategy: function (strategy) {
            this._changeStrategy = strategy;
            if (strategy === null) throw "Strategy cannot be null";
            if (!strategy.setValue) throw "Strategy object shall have #setValue method";
        },

        /**
         * Удаляет указанный элемент. Порождает pieChanged event.
         * Если был уже удален, то ничего не происходит.
         * @param item элемент из #getItems()
         */
        remove: function (item) {
            item.deleted = true;
            item.modelItem["deleted"] = true;
            this._setValue(item, 0);
        },

        _setValue: function (item, newValue) {
            this._changeStrategy.setValue(item, newValue, this.items);
            var cursor = item.angStart;
            var self = this;
            this.items.forEach(function (i) {
                cursor = self._updateItemReturnCursor(i, i.value, cursor)
            });
            $(this).trigger("pieChanged");
        },

        _updateItemReturnCursor: function (item, newVal, cursor) {
            item.value = newVal;
            item.angStart = cursor;
            item.angEnd = cursor + pieSlice(newVal);
            item.modelItem.value = newVal;
            return item.angEnd;
        },

        /**
         * Выставляет всем неудаленным элементам одинаковые значения, в сумме равные 100.
         * Порождает pieChanged event.
         */
        reset: function () {
            var countUndeletedItems = 0;
            this.items.forEach(function (i) {
                if (i.deleted) return;
                countUndeletedItems++;
            });
            var evValue = 100 / countUndeletedItems;
            var cursor = this.items[0].angStart;
            var self = this;
            this.items.forEach(function (i) {
                var setValue = evValue;
                if (i.deleted) setValue = 0;
                cursor = self._updateItemReturnCursor(i, setValue, cursor);
            });
            $(this).trigger("pieChanged");
        },

        /**
         * Возвращает состояние модели. Используется PieChartHistory, не предполагается для использования клиентом.
         * @returns {{}}
         */
        getState: function () {
            var stateById = {};
            this.items.forEach(function (item) {
                stateById[item.id] = copy(item);
            });
            return stateById;
        },

        /**
         * Восстанавливает состояние модели. Используется PieChartHistory, не предполагается для использования клиентом.
         */
        loadFromState: function (state) {
            this.items.forEach(function (item) {
                var itemState = state[item.id];
                if (!itemState) return;
                copy(itemState, item);
                item.modelItem.value = item.value;
                item.modelItem["deleted"] = item.deleted;
            });
            $(this).trigger("pieChanged");
        }
    };

    /**
     * Добавляет к PieChartModel историю изменений и возможность отката.
     * @param model PieChartModel
     * @constructor
     *
     * Генерирует historyUpdated event когда меняется история.
     *
     * История может быть "выключена" и затем включена снова. Тогда все изменения, произошедшие за этот период,
     * считаются одним изменением.
     */
    function PieChartHistory(model) {
        this.model = model;
        this.history = [];
        this.currentState = model.getState();
        this.historyEnabled = true;
        this.hasPendingUpdated = false;
        $(model).on("pieChanged", this._afterModelUpdate.bind(this));
    }

    PieChartHistory.prototype = {

        /**
         * Выключает историю так что она не сохраняет изменение состояния и не посылает событий при изменении модели.
         * Предполагается использование вместе с методом @link{#enableAndUpdate} следующим образом:
         * <code>
         *     history.getHistoryLength();  // => 0
         *     history.disable();
         *     ... много маленьких изменений в модели...
         *     history.enableAndUpdate();
         *     history.getHistoryLength();  // => 1
         *     history.back()               //возвращает модель к состоянию перед вызовом disable()
         * </code>
         */
        disable: function () {
            this.historyEnabled = false;
        },

        /**
         * Включает историю и запоминает текущее состояние модели как последнее изменение.
         * См также @link{#disable}
         */
        enableAndUpdate: function () {
            this.historyEnabled = true;
            if (this.hasPendingUpdated) {
                this._afterModelUpdate();
            }
        },

        _afterModelUpdate: function () {
            this.hasPendingUpdated = true;
            if (this.undoInProgress || !this.historyEnabled) return;
            this.history.push(this.currentState);
            this.currentState = this.model.getState();
            $(this).trigger("historyUpdated");
            this.hasPendingUpdated = false;
        },

        /**
         * @returns {boolean} true если история не пуста
         */
        canUndo: function () {
            return this.history.length > 0;
        },

        /**
         *
         * @returns {Number} длина истории
         */
        getHistoryLength: function () {
            return this.history.length;
        },

        /**
         * Выполняет откат модели к предыдущему состоянию.
         * Если история пуста то не делает ничего.
         */
        undo: function () {
            this.undoInProgress = true;
            try {
                this.currentState = this.history.pop();
                this.model.loadFromState(this.currentState);
                $(this).trigger("historyUpdated");
            }
            finally {
                this.undoInProgress = false;
            }
        }
    };

    window.PieChartModel = PieChartModel;
    window.PieChartHistory = PieChartHistory;
    window.ChangeAllStrategy = ChangeAllStrategy;
    window.ChangeNeighborsStrategy = ChangeNeighborsStrategy;
})(window, jQuery);