"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Emitter = (function () {
    function Emitter(_logger) {
        this._logger = _logger;
        this._receiverStore = new Map();
        this._subscriberStore = new Map();
    }
    Object.defineProperty(Emitter.prototype, "lastAction", {
        get: function () {
            return this._lastAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Emitter.prototype, "lastEvent", {
        get: function () {
            return this._lastEvent;
        },
        enumerable: true,
        configurable: true
    });
    Emitter.prototype.addReceiver = function (type, receiver) {
        var lowerType = type.toLowerCase();
        var existingReceiver = this._receiverStore.get(lowerType);
        if (existingReceiver) {
            this._throwError("Double-Decker Emitter: [addReceiver] : Action receiver was already present for type " + type + ": Receiver: " + existingReceiver);
        }
        this._logger.debug("Double-Decker Emitter: [addReceiver] : Adding Action receiver for type: " + type + ": Receiver: " + receiver);
        this._receiverStore.set(lowerType, receiver);
    };
    Emitter.prototype.removeReceiver = function (type, receiver) {
        var lowerType = type.toLowerCase();
        var existingReceiver = this._receiverStore.get(lowerType);
        if (!existingReceiver || receiver !== existingReceiver) {
            this._throwError("Double-Decker Emitter: [removeReceiver] : Action receiver to remove was not registered for type " + type + ": Receiver: " + receiver);
        }
        this._receiverStore.delete(lowerType);
        this._logger.debug("Double-Decker Emitter: [removeReceiver] : Removed Action receiver for type: " + type + ": Receiver: " + receiver);
    };
    Emitter.prototype.getReceiver = function (type) {
        this._logger.debug("Double-Decker Emitter: [getReceiver] : Getting Action receiver for type: " + type + ".");
        return this._receiverStore.get(type.toLowerCase());
    };
    Emitter.prototype.emitAction = function (action) {
        var receiver = this._receiverStore.get(action.type.toLowerCase());
        if (!receiver) {
            this._throwError("Double-Decker Emitter: [emitAction] : Receiver was not registered for type " + action.type + ".");
        }
        this._logger.debug("Double-Decker Emitter: [emitAction] : Emitting Action for type: " + action.type + ". Action: " + action + ". Receiver: " + receiver);
        var result = receiver(action);
        this._lastAction = action;
        return Promise.resolve(result);
    };
    Emitter.prototype.addSubscriber = function (type, subscriber) {
        var lowerType = type.toLowerCase();
        var subscribers = this._subscriberStore.get(lowerType);
        if (!subscribers) {
            this._logger.debug("Double-Decker Emitter: [addSubscriber] : No subscribers registered for type: " + type + ". Registering a new store array.");
            subscribers = new Array();
            this._subscriberStore.set(lowerType, subscribers);
        }
        subscribers.push(subscriber);
        this._logger.debug("Double-Decker Emitter: [addSubscriber] : Added subscriber for type: " + type + " : " + subscriber);
    };
    Emitter.prototype.removeSubscriber = function (type, subscriber) {
        var lowerType = type.toLowerCase();
        var subscribers = this._subscriberStore.get(lowerType);
        if (subscribers) {
            var itemIndex = subscribers.indexOf(subscriber);
            if (itemIndex >= 0) {
                subscribers.splice(itemIndex, 1);
                this._logger.debug("Double-Decker Emitter: [removeSubscriber] : Removed subscriber at index " + itemIndex + ": Subscriber: " + subscriber);
                return;
            }
        }
        this._throwError("Double-Decker Emitter: [removeSubscriber] : Subscriber to unsubscribe was not registered for type " + type + ": " + subscriber);
    };
    Emitter.prototype.getSubscribers = function (type) {
        this._logger.debug("Double-Decker Emitter: [getSubscribers] : Getting Event subscribers for type: " + type + ".");
        return this._subscriberStore.get(type.toLowerCase());
    };
    Emitter.prototype.emitEvent = function (event) {
        var _this = this;
        var resultPromises = new Array();
        var subscribers = this._subscriberStore.get(event.type.toLowerCase());
        if (subscribers) {
            subscribers.forEach(function (subscriber) {
                _this._logger.debug("Double-Decker Emitter: [emitEvent] : Emitting Event for type: " + event.type + ". Event: " + event + ". Subscriber:" + subscriber);
                resultPromises.push(Promise.resolve(subscriber(event)));
            });
        }
        if (this.lastAction) {
            event.actionId = this.lastAction.id;
        }
        this._lastEvent = event;
        return Promise.all(resultPromises);
    };
    Emitter.prototype._throwError = function (errorMessage) {
        this._logger.error(errorMessage);
        throw new Error(errorMessage);
    };
    return Emitter;
}());
exports.Emitter = Emitter;
//# sourceMappingURL=emitter.js.map