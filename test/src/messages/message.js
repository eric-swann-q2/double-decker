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
var category_1 = require("./category");
var behavior_1 = require("./behavior");
var Message = (function () {
    function Message(id, category, type, data, timestamp, behavior) {
        this.id = id;
        this.category = category;
        this.type = type;
        this.data = data;
        this.timestamp = timestamp;
        this.behavior = behavior;
    }
    return Message;
}());
exports.Message = Message;
var Action = (function (_super) {
    __extends(Action, _super);
    function Action(id, type, data, timestamp, behavior) {
        if (behavior === void 0) { behavior = new behavior_1.Behavior(); }
        return _super.call(this, id, category_1.Category.Action, type, data, timestamp, behavior) || this;
    }
    return Action;
}(Message));
exports.Action = Action;
var Event = (function (_super) {
    __extends(Event, _super);
    function Event(id, type, data, timestamp, behavior) {
        if (behavior === void 0) { behavior = new behavior_1.Behavior(); }
        return _super.call(this, id, category_1.Category.Event, type, data, timestamp, behavior) || this;
    }
    return Event;
}(Message));
exports.Event = Event;
//# sourceMappingURL=message.js.map