"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SystemMessageType;
(function (SystemMessageType) {
    SystemMessageType[SystemMessageType["ActionSent"] = 0] = "ActionSent";
    SystemMessageType[SystemMessageType["EventPublished"] = 1] = "EventPublished";
    SystemMessageType[SystemMessageType["ActionHandled"] = 2] = "ActionHandled";
    SystemMessageType[SystemMessageType["EventHandled"] = 3] = "EventHandled";
    SystemMessageType[SystemMessageType["ActionErred"] = 4] = "ActionErred";
    SystemMessageType[SystemMessageType["EventErred"] = 5] = "EventErred";
})(SystemMessageType = exports.SystemMessageType || (exports.SystemMessageType = {}));
var MessageStatusData = (function () {
    function MessageStatusData(messageId, error) {
        if (error === void 0) { error = null; }
        this.messageId = messageId;
        this.error = error;
    }
    return MessageStatusData;
}());
exports.MessageStatusData = MessageStatusData;
//# sourceMappingURL=systemMessage.js.map