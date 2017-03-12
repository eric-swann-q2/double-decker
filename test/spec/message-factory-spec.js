"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message_contract_1 = require("../src/messages/message-contract");
var chaiDateTime = require("chai-datetime/chai-datetime");
var chai = require("chai");
var chai_1 = require("chai");
var category_1 = require("../src/messages/category");
var message_factory_1 = require("../src/message-factory");
chai.use(chaiDateTime);
describe('When creating an action', function () {
    var factory = new message_factory_1.MessageFactory();
    var action = factory.CreateAction(new message_contract_1.MessageContract("TestAction", { test: "testAction", thingy: "thingy" }));
    it('Should have Action category', function () {
        chai_1.expect(action.category).to.equal(category_1.Category.Action);
    });
    it('Should have an ID', function () {
        chai_1.expect(action.id).to.not.be.empty;
    });
    it('Should have a valid timestamp', function () {
        chai_1.expect(action.timestamp).to.not.be.null;
        chai_1.expect(action.timestamp).to.be.afterDate(new Date(2017, 1, 1));
        chai_1.expect(action.timestamp).to.equalDate(new Date());
        chai_1.expect(action.timestamp).to.be.beforeTime(new Date());
    });
    it('Should have valid data', function () {
        chai_1.expect(action.data.test).to.equal("testAction");
        chai_1.expect(action.data.thingy).to.equal("thingy");
    });
});
describe('When creating an event', function () {
    var factory = new message_factory_1.MessageFactory();
    var event = factory.CreateEvent(new message_contract_1.MessageContract("TestEvent", { test: "testEvent", thingy: "thingy" }));
    it('Should have Event category', function () {
        chai_1.expect(event.category).to.equal(category_1.Category.Event);
    });
    it('Should have an ID', function () {
        chai_1.expect(event.id).to.not.be.empty;
    });
    it('Should have a valid timestamp', function () {
        chai_1.expect(event.timestamp).to.not.be.null;
        chai_1.expect(event.timestamp).to.be.afterDate(new Date(2017, 1, 1));
        chai_1.expect(event.timestamp).to.equalDate(new Date());
        chai_1.expect(event.timestamp).to.be.beforeTime(new Date());
    });
    it('Should have valid data', function () {
        chai_1.expect(event.data.test).to.equal("testEvent");
        chai_1.expect(event.data.thingy).to.equal("thingy");
    });
});
//# sourceMappingURL=message-factory-spec.js.map