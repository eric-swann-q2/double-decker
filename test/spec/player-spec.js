"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chaiAsPromised = require("chai-as-promised");
var chai = require("chai");
var chai_1 = require("chai");
var emitter_1 = require("../src/emitter");
var store_1 = require("../src/store");
var message_factory_1 = require("../src/message-factory");
var bus_1 = require("../src/bus");
var player_1 = require("../src/player");
var logger_1 = require("../src/logger");
chai.use(chaiAsPromised);
var logger = new logger_1.ConsoleLogger;
describe('When using Action player', function () {
    var emitter = new emitter_1.Emitter(logger);
    var store = new store_1.MemoryStore();
    var messageFactory = new message_factory_1.DataWithIdMessageFactory("itemId");
    var bus = new bus_1.Bus(messageFactory, emitter, store, logger);
    var player = new player_1.ActionPlayer(emitter, store, logger);
    var receivedActions = new Array();
    var actionReceiver = function (action) {
        receivedActions.push(action);
    };
    bus.receive("testActionType", actionReceiver);
    bus.createAndSend("testActionType", { itemId: "test1" });
    bus.createAndSend("testActionType", { itemId: "test2" });
    bus.createAndSend("testActionType", { itemId: "test3" });
    bus.createAndSend("testActionType", { itemId: "test4" });
    bus.createAndSend("testActionType", { itemId: "test5" });
    bus.createAndSend("testActionType", { itemId: "test6" });
    it('Can see all published actions', function () {
        chai_1.expect(player.messages.length).to.equal(6);
        chai_1.expect(receivedActions.length).to.equal(6);
    });
    it('Can play the first action', function () {
        receivedActions.length = 0;
        player.playNext();
        chai_1.expect(receivedActions[0].data.itemId).to.equal("test1");
    });
    it('Playing message moves head', function () {
        chai_1.expect(player.previous.data.itemId).to.equal("test1");
        chai_1.expect(player.next.data.itemId).to.equal("test2");
    });
    it('Can play multiple actions', function () {
        var resultPromise = player.play(2);
        chai_1.expect(player.previous.data.itemId).to.equal("test3");
        chai_1.expect(player.next.data.itemId).to.equal("test4");
    });
    it('Can reset head', function () {
        var resultPromise = player.setHead(0);
        chai_1.expect(player.next.data.itemId).to.equal("test1");
    });
    it('Can reset head by ID', function () {
        var resultPromise = player.setHeadById("test3");
        chai_1.expect(player.next.data.itemId).to.equal("test3");
    });
    it('Can clear actions', function () {
        player.clear();
        chai_1.expect(player.next).to.be.undefined;
    });
});
describe('When using Event player', function () {
    var emitter = new emitter_1.Emitter(logger);
    var store = new store_1.MemoryStore();
    var messageFactory = new message_factory_1.DataWithIdMessageFactory("itemId");
    var bus = new bus_1.Bus(messageFactory, emitter, store, logger);
    var player = new player_1.EventPlayer(emitter, store, logger);
    var subscribedEvents = new Array();
    var eventSubscriber = function (event) {
        subscribedEvents.push(event);
    };
    store.clearActions();
    bus.subscribe("testEventType", eventSubscriber);
    bus.createAndPublish("testEventType", { itemId: "test1" });
    bus.createAndPublish("testEventType", { itemId: "test2" });
    bus.createAndPublish("testEventType", { itemId: "test3" });
    bus.createAndPublish("testEventType", { itemId: "test4" });
    it('Can see all published events', function () {
        chai_1.expect(player.messages.length).to.equal(4);
    });
    it('Can play the first event', function () {
        subscribedEvents.length = 0;
        player.playNext();
        chai_1.expect(subscribedEvents[0].data.itemId).to.equal("test1");
    });
    it('Playing message moves head', function () {
        chai_1.expect(player.previous.data.itemId).to.equal("test1");
        chai_1.expect(player.next.data.itemId).to.equal("test2");
    });
    it('Can play multiple events', function () {
        var resultPromise = player.play(2);
        chai_1.expect(player.previous.data.itemId).to.equal("test3");
        chai_1.expect(player.next.data.itemId).to.equal("test4");
    });
    it('Can reset head', function () {
        var resultPromise = player.setHead(0);
        chai_1.expect(player.next.data.itemId).to.equal("test1");
    });
    it('Can reset head by ID', function () {
        var resultPromise = player.setHeadById("test3");
        chai_1.expect(player.next.data.itemId).to.equal("test3");
    });
    it('Can clear events', function () {
        player.clear();
        chai_1.expect(player.next).to.be.undefined;
    });
});
//# sourceMappingURL=player-spec.js.map