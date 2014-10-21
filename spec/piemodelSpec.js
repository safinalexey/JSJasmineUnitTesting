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

xdescribe("A spy", function() {
    var pm;
    var spy;

    beforeEach(function() {
        pm = new PieChartModel([
            {name: "a", value: 100}
        ]);

//        spyOn(pm, 'setValue');
        spy = jasmine.createSpyObj('ChangeAllStrategy', ['setValue']);

        spy.setValue(pm.items[0], 24.9, pm.items[0])
    });

    xit("tracks all the arguments of its calls", function() {
        expect(spy.setValue).toBeDefined();
    });

});

describe("ChangeAllStrategy setValue() function", function(){
    var casinputArray;
    var cas;

    beforeEach(function(){
        casinputArray = [{id:1, value: 2}, 3, [{id:1, value: 2},{id:2, value: 4}]];

        cas = ChangeAllStrategy.setValue(casinputArray[0],casinputArray[1],casinputArray[2]);
    });

    it('must change first param', function(){
        expect(casinputArray[0]).not.toEqual({id:1, value: 2})
    });

    it('must change third param', function(){
        expect(casinputArray[2]).not.toEqual([{id:1, value: 2},{id:2, value: 4}])
    });
});

describe("ChangeNeighborsStrategy setValue() function", function(){
    var cnsinputArray;
    var cns;

    beforeEach(function(){
        cnsinputArray = [{id:1, value: 2}, 3, [{id:1, value: 2},{id:2, value: 4}]];

        cns = ChangeNeighborsStrategy.setValue(cnsinputArray[0],cnsinputArray[1],cnsinputArray[2]);
    });

    it('must change first param', function(){
        expect(cnsinputArray[0].value).toEqual(3)
    });

//    it('that must change some inputs', function(){
//        expect(cnsinputArray[2][1].value).toEqual(4)
//    });
});

xdescribe("A spec testing PieChartModel getItems() function", function () {

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

xdescribe("A spec testing PieChartModel setAngleEnd() function", function () {

    var pm, items, fired;

    beforeEach(function(){
        pm = new PieChartModel([
            {name: "a", value: 43},
            {name: "b", value: 38},
            {name: "c", value: 15}
        ]);
        items = pm.getItems();
        fired = false;
        $(pm).on('pieChanged', function () {
            fired = true;
        });
    });

    it("setValue() toHaveBeenCalledWith test", function(){
        spyOn(pm._changeStrategy, 'setValue');
        pm.setAngleEnd(items[1], 3);
        expect(pm._changeStrategy.setValue).toHaveBeenCalledWith(items[1],2.954816260901937,items)
    });

    it("with correct input more than angStart", function () {
        pm.setAngleEnd(items[1], 3);
        expect(items[0].angEnd).toEqual(3)
    });

    it("with correct input less than angStart", function () {
        pm.setAngleEnd(items[0], 2);
        expect(items[0].angEnd).toEqual(2)
    });


    it("with zero angle input", function () {
        pm.setAngleEnd(items[0], 0);
        expect(items[0].angEnd).toEqual(0)
    });

    it("that fires pieChanged event", function () {
        pm.setAngleEnd(items[0], 0);
        expect(fired).toBeTruthy()
    })
});

xdescribe("A spec testing PieChartModel changeStrategy() function", function () {
    var pmToChgStr = new PieChartModel([
        {name: "a", value: 43},
        {name: "b", value: 38},
        {name: "c", value: 15}
    ]);

    it("with null input", function () {
        expect(function () {pmToChgStr.changeStrategy(null)}).toThrow()
        expect(pmToChgStr._changeStrategy).not.toBeNull();
    });

    var MyStrategy;

    it("with strategy !setValue input", function () {
        expect(function () {
            pmToChgStr.changeStrategy(MyStrategy)
        }).toThrow();
    });

    var newPm = new PieChartModel([
        {name: "a", value: 43},
        {name: "b", value: 38},
        {name: "c", value: 15}
    ]);
    newPm.changeStrategy(ChangeNeighborsStrategy)
    it("change to ChangeNeighborsStrategy", function () {
        expect(newPm._changeStrategy).toBe(ChangeNeighborsStrategy);
    })

    var newPmToChgStr = new PieChartModel([
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

//xdescribe("A spec testing PieChartModel remove() function", function () {
//
//    var pmRm = new PieChartModel([
//        {name: "a", value: 43},
//        {name: "b", value: 38},
//        {name: "c", value: 15}
//    ]);
//    var pieChanged;
//    $(pmRm).on('pieChanged', function () {
//        pieChanged = true;
//    });
//    var pmRmItems = pmRm.getItems();
//    pmRm.remove(pmRmItems[0]);
//
//    it("remove() sets deleted flag properly", function () {
//        expect(pmRmItems[0].deleted).toBeTruthy()
//    });
//
//    it("remove() sets modelItem deleted flag properly", function () {
//        expect(pmRmItems[0].modelItem.deleted).toBeTruthy()
//    });
//
//    pmRm.remove(pmRmItems[0]);
//    it("remove() doesn't change anything if element was already deleted", function () {
//        expect(pmRmItems[0].deleted).toBeTruthy()
//    });
//
//    it("remove() doesn't delete element literally", function () {
//        expect(pmRmItems[0]).toBeDefined();
//    });
//
//    it("that fires pieChanged event", function () {
//        expect(pieChanged).toBeTruthy()
//    })
//});

//xdescribe("A spec testing PieChartModel reset() function", function () {
//
//    var pmRs = new PieChartModel([
//        {name: "a", value: 43},
//        {name: "b", value: 38},
//        {name: "c", value: 15}
//    ]);
//    var pmRsItems = pmRs.getItems();
//    var ResetFired;
//    pmRs.remove(pmRsItems[0]);
//    $(pmRs).on('pieChanged', function () {
//        ResetFired = true;
//    });
//    pmRs.reset();
//
//    var sum = pmRsItems[1].value + pmRsItems[2].value
//
//    it("reset() sets all items' values to equal values", function () {
//        expect(pmRsItems[1].value).toEqual(pmRsItems[2].value)
//    });
//
//    it("reset() sets all items' values to equal values with sum 100", function () {
//        expect(sum).toEqual(100)
//    });
//
//    var pmSE = new PieChartModel([
//        {name: "a", value: 43}
//    ]);
//    var pmSEitems = pmSE.getItems();
//    pmSE.remove(pmSEitems[0]);
//    pmSE.reset()
//    it("reset() does nothing to single element that was deleted", function () {
//        expect(pmSEitems[0].value).toEqual(0)
//    });
//
//    it("that fires pieChanged event", function () {
//        expect(ResetFired).toBeTruthy()
//    })
//});

xdescribe("A spec testing PieChartHistory", function () {
    var pm, history;
    var Fired;
    var firedOnUndo, lengthBeforeUndo;
    var canUndo1, canUndo2;

    beforeEach(function () {
        pm = new PieChartModel([
            {name: "a", value: 20},
            {name: "b", value: 20},
            {name: "c", value: 20},
            {name: "d", value: 20},
            {name: "e", value: 20}
        ]);
        history = new PieChartHistory(pm);
        $(history).on('historyUpdated', function () {
            Fired = true;
        });
    });

    afterEach(function () {
        pm = 0;
        history = 0;
    });

    it("canUndo() on empty history", function () {
        canUndo1 = history.canUndo();
        pm.setAngleEnd(pm.items[0], Math.PI / 2);
        expect(canUndo1).toBeFalsy()
    });
    it("canUndo() on non-empty history", function () {
        canUndo1 = history.canUndo();
        pm.setAngleEnd(pm.items[0], Math.PI / 2);
        canUndo2 = history.canUndo();
        expect(canUndo2).toBeTruthy()
    });

    it("getHistoryLength() on non-empty history", function () {
        pm.setAngleEnd(pm.items[0], Math.PI / 2);
        lengthBeforeUndo = history.getHistoryLength();
        expect(lengthBeforeUndo).toBeGreaterThan(0)
    });

    it("getHistoryLength() on empty history", function () {
        pm.setAngleEnd(pm.items[0], Math.PI / 2);
        history.undo();
        var lengthAfterUndo = history.getHistoryLength();

        expect(lengthAfterUndo).toEqual(0)
    });

    it("undo() revert state test", function () {
        pm.setAngleEnd(pm.items[0], Math.PI / 2);
        history.undo();

        expect(pm.items[0].angEnd).toEqual(20 * (2 * Math.PI / 100))
    });

    it("undo() fires historyUpdated event", function () {
        $(history).on('historyUpdated', function () {
            firedOnUndo = true;
        });
        pm.setAngleEnd(pm.items[0], Math.PI / 2);
        history.undo();
        expect(firedOnUndo).toBeTruthy()
    });

    it("disable()", function () {
        history.disable();
        expect(history.historyEnabled).toBeFalsy()
    });

    it("enableAndUpdate() enables history", function () {
        history.disable();
        history.enableAndUpdate();
        expect(history.historyEnabled).toBeTruthy()
    });

    it("enableAndUpdate() fires historyUpdated event", function () {
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