"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var message_1 = require("../src/messages/message");
var store_1 = require("../src/store");
describe('When storing actions', function () {
    it('Can retrieve stored actions', function () {
        var store = new store_1.MemoryStore();
        var testAction = new message_1.Action("testId", "testType", { test: "testData" }, new Date());
        store.addAction(testAction);
        chai_1.expect(store.actions[0]).to.equal(testAction);
    });
    it('Can clear stored actions', function () {
        var store = new store_1.MemoryStore();
        var testAction = new message_1.Action("testId", "testType", { test: "testData" }, new Date());
        store.addAction(testAction);
        store.clearActions();
        chai_1.expect(store.actions.length).to.equal(0);
    });
});
describe('When storing events', function () {
    it('Can retrieve stored events', function () {
        var store = new store_1.MemoryStore();
        var testEvent = new message_1.Event("testId", "testType", { test: "testData" }, new Date());
        store.addEvent(testEvent);
        chai_1.expect(store.events[0]).to.equal(testEvent);
    });
    it('Can clear stored events', function () {
        var store = new store_1.MemoryStore();
        var testEvent = new message_1.Event("testId", "testType", { test: "testData" }, new Date());
        store.addEvent(testEvent);
        store.clearEvents();
        chai_1.expect(store.events.length).to.equal(0);
    });
});
//# sourceMappingURL=store-spec.js.map