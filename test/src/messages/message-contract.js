"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var behavior_1 = require("./behavior");
var MessageContract = (function () {
    function MessageContract(type, data, behavior) {
        if (behavior === void 0) { behavior = new behavior_1.Behavior(); }
        this.type = type;
        this.data = data;
        this.behavior = behavior;
    }
    return MessageContract;
}());
exports.MessageContract = MessageContract;
//# sourceMappingURL=message-contract.js.map