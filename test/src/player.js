"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var category_1 = require("./messages/category");
var Player = (function () {
    function Player(_store, _logger) {
        this._store = _store;
        this._logger = _logger;
        this._headPosition = 0;
    }
    Object.defineProperty(Player.prototype, "systemEvents", {
        get: function () {
            return this._store.systemEvents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "next", {
        get: function () {
            if (this._headPosition < this.messages.length) {
                var message = this.messages[this._headPosition];
                this._logger.debug("Double-Decker Hub: [next] : Retrieving next " + this._category + " at position " + this._headPosition + ".", message);
                return message;
            }
            this._logger.debug("Double-Decker Hub: [next] : read head is at max position, no next " + this._category);
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "previous", {
        get: function () {
            if (this._headPosition > 0) {
                var position = this._headPosition - 1;
                var event_1 = this.messages[position];
                this._logger.debug("Double-Decker Hub: [previous] : Retrieving previous " + this._category + " at position " + position + ".", event_1);
                return event_1;
            }
            this._logger.debug("Double-Decker Hub: [previous] : eventHead is at position 0, no previous " + this._category);
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.setHead = function (position) {
        if (position < 0 || position >= this.messages.length) {
            this._throwError("Double-Decker Hub: [setHead] : Attempted to set read head outside of message range. \n        Attempted value:" + position + ". Max value:" + this.messages.length);
        }
        this._headPosition = position;
    };
    Player.prototype.setHeadById = function (messageId) {
        var position = this.messages.findIndex(function (msg) { return msg.id === messageId; });
        if (position < 0) {
            this._throwError("Double-Decker Hub: [setHeadById] : Could not find the requested messageId: " + messageId);
        }
        this._headPosition = position;
    };
    Player.prototype.playNext = function () {
        this._logger.debug("Double-Decker Hub: [play] : Playing " + this._category + " : " + this.next);
        if (this.next.behavior.shouldPlay) {
            this._playNext(this.next);
        }
        this._headPosition++;
    };
    Player.prototype.play = function (length) {
        var results = new Array();
        for (var i = 0; i < length; i++) {
            this.playNext();
        }
    };
    Player.prototype.clear = function () {
        this._logger.debug("Double-Decker Hub: [reset] : Resetting " + this._category + " hub");
        this._clearMessages();
        this._headPosition = 0;
    };
    Player.prototype._throwError = function (errorMessage) {
        this._logger.error(errorMessage);
        throw new Error(errorMessage);
    };
    return Player;
}());
exports.Player = Player;
var ActionPlayer = (function (_super) {
    __extends(ActionPlayer, _super);
    function ActionPlayer(_emitter, store, logger) {
        var _this = _super.call(this, store, logger) || this;
        _this._emitter = _emitter;
        _this.logger = logger;
        _this._category = category_1.Category.Action;
        return _this;
    }
    Object.defineProperty(ActionPlayer.prototype, "messages", {
        get: function () { return this._store.actions; },
        enumerable: true,
        configurable: true
    });
    ActionPlayer.prototype._playNext = function (next) {
        this._emitter.emitAction(this.next);
    };
    ActionPlayer.prototype._clearMessages = function () {
        this._store.clearActions();
    };
    return ActionPlayer;
}(Player));
exports.ActionPlayer = ActionPlayer;
var EventPlayer = (function (_super) {
    __extends(EventPlayer, _super);
    function EventPlayer(_emitter, store, logger) {
        var _this = _super.call(this, store, logger) || this;
        _this._emitter = _emitter;
        _this.logger = logger;
        _this._category = category_1.Category.Event;
        return _this;
    }
    Object.defineProperty(EventPlayer.prototype, "messages", {
        get: function () { return this._store.events; },
        enumerable: true,
        configurable: true
    });
    EventPlayer.prototype._playNext = function (next) {
        this._emitter.emitEvent(next);
    };
    EventPlayer.prototype._clearMessages = function () {
        this._store.clearEvents();
    };
    return EventPlayer;
}(Player));
exports.EventPlayer = EventPlayer;
//# sourceMappingURL=player.js.map