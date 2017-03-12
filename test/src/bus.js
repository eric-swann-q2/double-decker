"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message_contract_1 = require("./messages/message-contract");
var systemMessage_1 = require("./messages/systemMessage");
var Bus = (function () {
    function Bus(_messageFactory, _emitter, _store, _logger) {
        this._messageFactory = _messageFactory;
        this._emitter = _emitter;
        this._store = _store;
        this._logger = _logger;
    }
    Object.defineProperty(Bus.prototype, "lastAction", {
        get: function () {
            return this._emitter.lastAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bus.prototype, "lastEvent", {
        get: function () {
            return this._emitter.lastEvent;
        },
        enumerable: true,
        configurable: true
    });
    Bus.prototype.receive = function (type, receiver) {
        this._emitter.addReceiver(type, receiver);
        this._logger.debug("Double-Decker Bus: [receive] : Receiver set for " + type + ": " + receiver);
    };
    Bus.prototype.unreceive = function (type, receiver) {
        var removed = this._emitter.removeReceiver(type.toLowerCase(), receiver);
        this._logger.debug("Double-Decker Bus: [unreceive] : Receiver removed for " + type + ": " + receiver);
    };
    Bus.prototype.send = function (actionContract) {
        var _this = this;
        var action = this._messageFactory.CreateAction(actionContract);
        this._logger.debug("Double-Decker Bus: [send] : Sending action: " + action);
        this._emitSystemMessage(systemMessage_1.SystemMessageType.ActionSent, action.id);
        this._emitter.emitAction(action)
            .then(function (result) {
            _this._store.addAction(action);
            _this._emitSystemMessage(systemMessage_1.SystemMessageType.ActionSent, action.id);
        })
            .catch(function (error) {
            _this._emitSystemMessage(systemMessage_1.SystemMessageType.ActionErred, action.id, error);
        });
    };
    Bus.prototype.createAndSend = function (type, data) {
        return this.send(new message_contract_1.MessageContract(type, data));
    };
    Bus.prototype.subscribe = function (type, subscriber) {
        this._emitter.addSubscriber(type, subscriber);
        this._logger.debug("Double-Decker Bus: [subscribe] : Appended subscriber for type: " + type + " : " + subscriber);
    };
    Bus.prototype.unsubscribe = function (type, subscriber) {
        var removed = this._emitter.removeSubscriber(type, subscriber);
        this._logger.debug("Double-Decker Bus: [unsubscribe] : Subscriber removed for " + type + ": " + subscriber);
    };
    Bus.prototype.publish = function (eventContract) {
        var _this = this;
        var event = this._messageFactory.CreateEvent(eventContract);
        this._logger.debug("Double-Decker Bus: [publish] : Publishing event: " + event);
        this._emitSystemMessage(systemMessage_1.SystemMessageType.EventHandled, event.id);
        this._emitter.emitEvent(event)
            .then(function (result) {
            _this._store.addEvent(event);
            _this._emitSystemMessage(systemMessage_1.SystemMessageType.EventPublished, event.id);
        })
            .catch(function (error) {
            _this._emitSystemMessage(systemMessage_1.SystemMessageType.EventErred, event.id, error);
        });
    };
    Bus.prototype.createAndPublish = function (type, data) {
        this.publish(new message_contract_1.MessageContract(type, data));
    };
    Bus.prototype._emitSystemMessage = function (type, originalMessageId, error) {
        if (error === void 0) { error = null; }
        var systemMessage = this._messageFactory.CreateSystemEvent(type, new systemMessage_1.MessageStatusData(originalMessageId, error));
        this._logger.debug("Double-Decker Bus: [emitSystemMessage] \n      : Emitting a system message: " + type + " : ID " + systemMessage.id + " : OriginalMessageId: " + originalMessageId);
        if (type === systemMessage_1.SystemMessageType.ActionErred || type === systemMessage_1.SystemMessageType.EventErred) {
            this._logger.error("Double-Decker Bus: [emitSystemMessage] \n      : Message Failure: " + type + " : ID " + systemMessage.id + " : OriginalMessageId: " + originalMessageId + " : Error: " + error);
        }
        this._emitter.emitEvent(systemMessage);
        this._store.addSystemEvent(systemMessage);
    };
    return Bus;
}());
exports.Bus = Bus;
//# sourceMappingURL=bus.js.map