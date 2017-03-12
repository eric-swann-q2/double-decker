"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chaiAsPromised = require("chai-as-promised");
var chai = require("chai");
var chai_1 = require("chai");
var emitter_1 = require("../src/emitter");
var store_1 = require("../src/store");
var message_factory_1 = require("../src/message-factory");
var bus_1 = require("../src/bus");
var logger_1 = require("../src/logger");
chai.use(chaiAsPromised);
var logger = new logger_1.ConsoleLogger;
describe('When using Action emitter', function () {
    var emitter = new emitter_1.Emitter(logger);
    var store = new store_1.MemoryStore();
    var bus = new bus_1.Bus(new message_factory_1.MessageFactory(), emitter, store, logger);
    var receivedActions = new Array();
    var actionReceiver = function (action) { receivedActions.push(action); return receivedActions; };
    it('Can add and get a receiver', function () {
        bus.receive("testActionType", actionReceiver);
        var receiver = emitter.getReceiver("testActionType");
        chai_1.expect(receiver).to.equal(actionReceiver);
    });
    it('Can emit an action to the receiver', function () {
        bus.createAndSend("testActionType", { testProp: "testActionProp1" });
        chai_1.expect(bus.lastAction.type).to.equal("testactiontype");
    });
    it('Records the last action', function () {
        chai_1.expect(bus.lastAction.data.testProp).to.equal("testActionProp1");
    });
    it('Errs if adding a duplicate receiver', function () {
        chai_1.expect(function () { return bus.receive("testActionType", actionReceiver); }).to.throw;
    });
    it('Can remove a receiver', function () {
        bus.unreceive("testActionType", actionReceiver);
        var receiver = emitter.getReceiver("testActionType");
        chai_1.expect(receiver).to.be.empty;
    });
    it('Errs when removing a non-existent receiver type', function () {
        chai_1.expect(function () { return bus.unreceive("testActionTypeBad", actionReceiver); }).to.throw;
    });
    it('Errs when removing a non-existent receiver callback', function () {
        chai_1.expect(function () { return bus.unreceive("testActionType", function (action) { return null; }); }).to.throw;
    });
});
describe('When using Event emitter', function () {
    var emitter = new emitter_1.Emitter(logger);
    var bus = new bus_1.Bus(new message_factory_1.MessageFactory(), emitter, new store_1.MemoryStore(), logger);
    var receivedEvents = new Array();
    var eventSubscriber = function (event) { receivedEvents.push(event); };
    var eventSubscriber2 = function (event) { receivedEvents.push(event); };
    it('Can add and get a subscriber', function () {
        bus.subscribe("testEventType", eventSubscriber);
        var subscribers = emitter.getSubscribers("testEventType");
        chai_1.expect(subscribers[0]).to.equal(eventSubscriber);
    });
    it('Can emit an event to the subscriber', function () {
        bus.createAndPublish("testEventType", { testProp: "testEventProp1" });
        chai_1.expect(bus.lastEvent.type).to.equal("testeventtype");
    });
    it('Records data from the last event', function () {
        bus.createAndPublish("testEventType", { testProp: "testEventProp2" });
        chai_1.expect(bus.lastEvent.data.testProp).to.equal("testEventProp2");
    });
    it('Can add a second subscriber for same event type', function () {
        bus.subscribe("testEventType", eventSubscriber2);
        var subscribers = emitter.getSubscribers("testEventType");
        chai_1.expect(subscribers[1]).to.equal(eventSubscriber2);
    });
    it('Can emit an events to multiple subscribers', function () {
        receivedEvents.length = 0;
        var resultPromise = bus.createAndPublish("testEventType", { testProp: "testProp" });
        chai_1.expect(receivedEvents).to.have.length(2);
    });
    it('Can remove a subscriber', function () {
        bus.unsubscribe("testEventType", eventSubscriber);
        var subscribers = emitter.getSubscribers("testEventType");
        chai_1.expect(subscribers).to.not.contain(eventSubscriber);
    });
    it('Errs when removing a non-existent subscriber type', function () {
        chai_1.expect(function () { return bus.unsubscribe("testEventTypeBad", eventSubscriber); }).to.throw;
    });
    it('Errs when removing a non-existent subscriber callback', function () {
        chai_1.expect(function () { return bus.unsubscribe("testEventType", function (event) { return null; }); }).to.throw;
    });
});
//# sourceMappingURL=bus-spec.js.map