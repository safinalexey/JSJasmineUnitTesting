//describe("ChangeAllStrategy", function () {
//    beforeEach(function () {
//        var pm = new PieChartModel([
//            {name: "a", value: 100}
//        ]);
//        var strategy = pm.changeStrategy(jasmine.createSpyObj('strategy', ['setValue']));
//    });
//    it("spec name", function () {
//        expect(strategy.setValue).toHaveBeenCalledWith()
//    });
//});

describe("A spec testing PieChartModel getItems() function", function () {

    it("with correct input", function () {
        var pmCorrectInput = new PieChartModel([
            {name: "a", value: 100}
        ]);
        expect(pmCorrectInput.items[0]).toEqual(jasmine.objectContaining({
            value: 100
        }));
    });

    it("with input value lower 100", function () {
        var pmValLower100 = new PieChartModel([
            {name: "a", value: 50}
        ]);
        expect(pmValLower100.items[0]).toEqual(jasmine.objectContaining({
            value: 100
        }));
    });

    it("with input value over 100", function () {
        var pmValOver100 = new PieChartModel([
            {name: "a", value: 101}
        ]);
        expect(pmValOver100.items[0]).toEqual(jasmine.objectContaining({
            value: 100
        }));
    });

    it("with inputs value sum eq 100", function () {
        var pmTwoValsCorrectInput = new PieChartModel([
            {name: "a", value: 50},
            {name: "b", value: 50}
        ]);
        expect(pmTwoValsCorrectInput.items[0].angEnd).toBeCloseTo(Math.PI, 10);
        expect(pmTwoValsCorrectInput.items[1].angEnd).toBeCloseTo(Math.PI * 2, 10);
    });

    it("with inputs value sum over 100", function () {
        var pmTwoValsIncorrectInput = new PieChartModel([
            {name: "a", value: 50},
            {name: "b", value: 52}
        ]);

        expect(pmTwoValsIncorrectInput.items[0]).toEqual(jasmine.objectContaining({
            value: 49.01960784313726
        }));
        expect(pmTwoValsIncorrectInput.items[1]).toEqual(jasmine.objectContaining({
            value: 50.98039215686274
        }));
    });

    it("with input value below zero", function () {
        var pmValBelowZero = new PieChartModel([
            {name: "a", value: -56}
        ]);

        expect(pmValBelowZero.items[0]).toEqual(jasmine.objectContaining({
            value: 100
        }));
    });

    it("with inputs value below zero", function () {
        var pmTwoValsBelowZero = new PieChartModel([
            {name: "a", value: -56},
            {name: "b", value: -36}
        ]);

        expect(pmTwoValsBelowZero.items[0]).toEqual(jasmine.objectContaining({
            value: 60.869565217391305
        }));
        expect(pmTwoValsBelowZero.items[1]).toEqual(jasmine.objectContaining({
            value: 39.130434782608695
        }));
    });

    it("with inputs value sum lt 100", function () {
        var pmTwoValsLower100 = new PieChartModel([
            {name: "a", value: 43},
            {name: "b", value: 38}
        ]);
        expect(pmTwoValsLower100.items[0]).toEqual(jasmine.objectContaining({
            value: 53.08641975308642
        }));
        expect(pmTwoValsLower100.items[1]).toEqual(jasmine.objectContaining({
            value: 46.91358024691358
        }));
    });

    it("with empty input", function () {
        var pmEmptyInput = new PieChartModel([]);
        expect(pmEmptyInput.getItems()).toEqual([])
    });
});


    describe("A spec testing PieChartModel setAngleEnd() function", function () {

        var pm = new PieChartModel([
            {name: "a", value: 43},
            {name: "b", value: 38},
            {name: "c", value: 15}
        ]);

        var items = pm.getItems();
        pm.setAngleEnd(items[1], 3);
        var fired = false;
        $(pm).on('pieChanged', function () {
            fired = true;
        });

        it("with correct input more than angStart", function () {
            var pm = new PieChartModel([
                {name: "a", value: 43},
                {name: "b", value: 38},
                {name: "c", value: 15}
            ]);

            var items = pm.getItems();
            pm.setAngleEnd(items[1], 3);
            expect(items[0].angEnd).toEqual(3)
        });

        it("with incorrect index, must fall", function () {
            var pm = new PieChartModel([
                {name: "a", value: 43},
                {name: "b", value: 38},
                {name: "c", value: 15}
            ]);

            var items = pm.getItems();
            pm.setAngleEnd(items[1], 3);
            expect(items[0].angEnd).toEqual(3)
        });


        it("with correct input less than angStart", function () {
            var pm = new PieChartModel([
                {name: "a", value: 43},
                {name: "b", value: 38},
                {name: "c", value: 15}
            ]);

            var items = pm.getItems();
            pm.setAngleEnd(items[0], 2);

            expect(items[0].angEnd).toEqual(2)
        });

        pm.setAngleEnd(items[1], 0);

        it("with zero angle input", function () {
            var pm = new PieChartModel([
                {name: "a", value: 43},
                {name: "b", value: 38},
                {name: "c", value: 15}
            ]);

            var items = pm.getItems();
            pm.setAngleEnd(items[0], 0);

            expect(items[0].angEnd).toEqual(0)
        });

        it("that fires pieChanged event", function () {
            expect(fired).toBeTruthy()
        })
    });

    describe("A spec testing PieChartModel changeStrategy() function", function () {
        pmToChgStr = new PieChartModel([
            {name: "a", value: 43},
            {name: "b", value: 38},
            {name: "c", value: 15}
        ]);

        it("with null input", function () {
            expect(function () {pmToChgStr.changeStrategy(null)}).toThrow()
        });

        var MyStrategy;

        it("with strategy !setValue input", function () {
            expect(function () {pmToChgStr.changeStrategy(MyStrategy)}).toThrow();
        })


        newPm = new PieChartModel([
            {name: "a", value: 43},
            {name: "b", value: 38},
            {name: "c", value: 15}
        ]);
        newPm.changeStrategy(ChangeNeighborsStrategy)
        it("change to ChangeNeighborsStrategy", function () {
            expect(newPm._changeStrategy).toBe(ChangeNeighborsStrategy);
        })

        newPmToChgStr = new PieChartModel([
            {name: "a", value: 43},
            {name: "b", value: 38},
            {name: "c", value: 15}
        ]);
        newPmToChgStr.changeStrategy(ChangeNeighborsStrategy)
        newPmToChgStr.changeStrategy(ChangeAllStrategy)
        it("change to ChangeAllStrategy", function () {
            expect(newPmToChgStr._changeStrategy).toBe(ChangeAllStrategy);
        })
    });

    describe("A spec testing PieChartModel remove() function", function () {

        var pmRm = new PieChartModel([
            {name: "a", value: 43},
            {name: "b", value: 38},
            {name: "c", value: 15}
        ]);
        var pmRmItems = pmRm.getItems();
        pmRm.remove(pmRmItems[0]);

        it("remove() deletes properly", function () {
            expect(pmRmItems[0].deleted).toBeTruthy()
        });

        pmRm.remove(pmRmItems[0]);
        it("remove() doesn't change anything if element was already deleted", function () {
            expect(pmRmItems[0].deleted).toBeTruthy()
        });
    });

    describe("A spec testing PieChartModel reset() function", function () {

        var pmRs = new PieChartModel([
            {name: "a", value: 43},
            {name: "b", value: 38},
            {name: "c", value: 15}
        ]);
        var pmRsItems = pmRs.getItems();
        var ResetFired;
        pmRs.remove(pmRsItems[0]);
        $(pmRs).on('pieChanged', function () {
            ResetFired = true;
        });
        pmRs.reset();

        var sum = pmRsItems[1].value + pmRsItems[2].value

        it("reset() sets all items' values to equal values", function () {
            expect(pmRsItems[1].value).toEqual(pmRsItems[2].value)
        });

        it("reset() sets all items' values to equal values with sum 100", function () {
            expect(sum).toEqual(100)
        });

        var pmSE = new PieChartModel([
            {name: "a", value: 43}
        ]);
        var pmSEitems = pmSE.getItems();
        pmSE.remove(pmSEitems[0]);
        pmSE.reset()
        it("reset() does nothing to single element that was deleted", function () {
            expect(pmSEitems[0].value).toEqual(0)
        });

        it("that fires pieChanged event", function () {
            expect(ResetFired).toBeTruthy()
        })
    });

    describe("A spec testing PieChartHistory", function () {
        var pm = new PieChartModel([
            {name: "a", value: 20},
            {name: "b", value: 20},
            {name: "c", value: 20},
            {name: "d", value: 20},
            {name: "e", value: 20}
        ]);
        var history = new PieChartHistory(pm);
        var Fired;
        $(history).on('historyUpdated', function () {
            Fired = true;
        });
        var canUndo1 = history.canUndo();
        pm.setAngleEnd(pm.items[0], Math.PI / 2);
        var canUndo2 = history.canUndo();

        it("canUndo() on empty history", function () {
            expect(canUndo1).toBeFalsy()
        });
        it("canUndo() on non-empty history", function () {
            expect(canUndo2).toBeTruthy()
        });

        lengthBeforeUndo = history.getHistoryLength()
        it("getHistoryLength() on non-empty history", function () {
            expect(lengthBeforeUndo).toBeGreaterThan(0)
        });

        var firedOnUndo;
        $(history).on('historyUpdated', function () {
            firedOnUndo = true;
        });
        history.undo();

        lengthAfterUndo = history.getHistoryLength()
        it("getHistoryLength() on empty history", function () {
            expect(lengthAfterUndo).toEqual(0)
        });

        it("undo() revert state test", function () {
            expect(pm.items[0].angEnd).toEqual(20 * (2 * Math.PI / 100))
        });

        it("undo() fires historyUpdated event", function () {
            expect(firedOnUndo).toBeTruthy()
        });

        it("disable()", function () {
            var pm = new PieChartModel([
                {name: "a", value: 20},
                {name: "b", value: 20},
                {name: "c", value: 20},
                {name: "d", value: 20},
                {name: "e", value: 20}
            ]);
            var history = new PieChartHistory(pm);
            history.disable();
            expect(history.historyEnabled).toBeFalsy()
        });

        it("enableAndUpdate() enables history", function () {
            var pm = new PieChartModel([
                {name: "a", value: 20},
                {name: "b", value: 20},
                {name: "c", value: 20},
                {name: "d", value: 20},
                {name: "e", value: 20}
            ]);
            var history = new PieChartHistory(pm);
            history.disable();
            history.enableAndUpdate();
            expect(history.historyEnabled).toBeTruthy()
        });

        it("enableAndUpdate() fires historyUpdated event", function () {
            var pm = new PieChartModel([
                {name: "a", value: 20},
                {name: "b", value: 20},
                {name: "c", value: 20},
                {name: "d", value: 20},
                {name: "e", value: 20}
            ]);
            var history = new PieChartHistory(pm);
            var Fired = false;
            $(history).on('historyUpdated', function () {
                Fired = true;
            });
            history.disable();
            pm.setAngleEnd(pm.items[0], Math.PI / 2);
            history.enableAndUpdate();
            expect(Fired).toBeTruthy()
        });

        it("that fires historyUpdated event", function () {
            expect(Fired).toBeTruthy()
        });
    });