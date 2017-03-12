"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var push_id_1 = require("./push-id");
var message_1 = require("./messages/message");
var behavior_1 = require("./messages/behavior");
var systemMessage_1 = require("./messages/systemMessage");
var MessageFactory = (function () {
    function MessageFactory() {
    }
    MessageFactory.prototype.CreateAction = function (actionContract) {
        return new message_1.Action(push_id_1.createId(), actionContract.type.toLowerCase(), actionContract.data, new Date(), actionContract.behavior);
    };
    MessageFactory.prototype.CreateEvent = function (eventContract) {
        return new message_1.Event(push_id_1.createId(), eventContract.type.toLowerCase(), eventContract.data, new Date(), eventContract.behavior);
    };
    MessageFactory.prototype.CreateSystemEvent = function (type, data) {
        var behavior = new behavior_1.Behavior();
        behavior.isSystem = true;
        behavior.shouldPlay = false;
        return new message_1.Event(push_id_1.createId(), systemMessage_1.SystemMessageType[type].toLowerCase(), data, new Date(), behavior);
    };
    return MessageFactory;
}());
exports.MessageFactory = MessageFactory;
var DataWithIdMessageFactory = (function () {
    function DataWithIdMessageFactory(idProperty) {
        if (idProperty === void 0) { idProperty = "id"; }
        this.idProperty = idProperty;
    }
    DataWithIdMessageFactory.prototype.CreateAction = function (actionContract) {
        return new message_1.Action(actionContract.data[this.idProperty], actionContract.type.toLowerCase(), actionContract.data, new Date(), actionContract.behavior);
    };
    DataWithIdMessageFactory.prototype.CreateEvent = function (eventContract) {
        return new message_1.Event(eventContract.data[this.idProperty], eventContract.type.toLowerCase(), eventContract.data, new Date(), eventContract.behavior);
    };
    DataWithIdMessageFactory.prototype.CreateSystemEvent = function (type, data) {
        var behavior = new behavior_1.Behavior();
        behavior.isSystem = true;
        behavior.shouldPlay = true;
        return new message_1.Event(data[this.idProperty], systemMessage_1.SystemMessageType[type], data, new Date(), behavior);
    };
    return DataWithIdMessageFactory;
}());
exports.DataWithIdMessageFactory = DataWithIdMessageFactory;
//# sourceMappingURL=message-factory.js.map