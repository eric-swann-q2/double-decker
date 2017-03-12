"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chaiAsPromised = require("chai-as-promised");
var chai = require("chai");
var chai_1 = require("chai");
var emitter_1 = require("../src/emitter");
var logger_1 = require("../src/logger");
var message_1 = require("../src/messages/message");
chai.use(chaiAsPromised);
describe('When using Action emitter', function () {
    var emitter = new emitter_1.Emitter(new logger_1.ConsoleLogger());
    var receivedActions = new Array();
    var actionReceiver = function (action) { receivedActions.push(action); return receivedActions; };
    it('Can add and get a receiver', function () {
        emitter.addReceiver("testActionType", actionReceiver);
        var receiver = emitter.getReceiver("testActionType");
        chai_1.expect(receiver).to.equal(actionReceiver);
    });
    it('Can emit an action to the receiver', function () {
        var resultPromise = emitter.emitAction(new message_1.Action("testAction1", "testActionType", { testProp: "testProp" }, new Date()));
        chai_1.expect(resultPromise).to.eventually.not.be.undefined;
        chai_1.expect(resultPromise).to.eventually.have.property("id", "testAction1");
    });
    it('Errs if adding a duplicate receiver', function () {
        chai_1.expect(function () { return emitter.addReceiver("testActionType", actionReceiver); }).to.throw;
    });
    it('Can remove a receiver', function () {
        emitter.removeReceiver("testActionType", actionReceiver);
        var receiver = emitter.getReceiver("testActionType");
        chai_1.expect(receiver).to.be.empty;
    });
    it('Errs when removing a non-existent receiver type', function () {
        chai_1.expect(function () { return emitter.removeReceiver("testActionTypeBad", actionReceiver); }).to.throw;
    });
    it('Errs when removing a non-existent receiver callback', function () {
        chai_1.expect(function () { return emitter.removeReceiver("testActionType", function (action) { return null; }); }).to.throw;
    });
});
describe('When using Event emitter', function () {
    var emitter = new emitter_1.Emitter(new logger_1.ConsoleLogger());
    var receivedEvents = new Array();
    var eventSubscriber = function (event) { receivedEvents.push(event); return receivedEvents; };
    var receivedEvents2 = new Array();
    var eventSubscriber2 = function (event) { receivedEvents2.push(event); return receivedEvents2; };
    it('Can add and get a subscriber', function () {
        emitter.addSubscriber("testEventType", eventSubscriber);
        var subscribers = emitter.getSubscribers("testEventType");
        chai_1.expect(subscribers[0]).to.equal(eventSubscriber);
    });
    it('Can emit an event to the subscriber', function () {
        var resultPromise = emitter.emitEvent(new message_1.Event("testEvent1", "testEventType", { testProp: "testProp" }, new Date()));
        chai_1.expect(resultPromise).to.eventually.not.be.undefined;
        chai_1.expect(resultPromise).to.eventually.have.property("id", "testEvent1");
    });
    it('Can add a second subscriber for same event type', function () {
        emitter.addSubscriber("testEventType", eventSubscriber2);
        var subscribers = emitter.getSubscribers("testEventType");
        chai_1.expect(subscribers[1]).to.equal(eventSubscriber2);
    });
    it('Can emit an events to multiple subscribers', function () {
        receivedEvents.length = 0;
        var resultPromises = emitter.emitEvent(new message_1.Event("testEventMultiple", "testEventType", { testProp: "testProp" }, new Date()));
        chai_1.expect(resultPromises).to.eventually.have.property("[0].id", "testEventMultiple");
        chai_1.expect(resultPromises).to.eventually.have.property("[1].id", "testEventMultiple");
    });
    it('Can remove a subscriber', function () {
        emitter.removeSubscriber("testEventType", eventSubscriber);
        var subscribers = emitter.getSubscribers("testEventType");
        chai_1.expect(subscribers).to.not.contain(eventSubscriber);
    });
    it('Errs when removing a non-existent subscriber type', function () {
        chai_1.expect(function () { return emitter.removeSubscriber("testEventTypeBad", eventSubscriber); }).to.throw;
    });
    it('Errs when removing a non-existent subscriber callback', function () {
        chai_1.expect(function () { return emitter.removeSubscriber("testEventType", function (event) { return null; }); }).to.throw;
    });
});
//# sourceMappingURL=emitter-spec.js.map