"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Behavior = (function () {
    function Behavior(mustPlay, shouldPlay, isSystem) {
        if (mustPlay === void 0) { mustPlay = false; }
        if (shouldPlay === void 0) { shouldPlay = true; }
        if (isSystem === void 0) { isSystem = false; }
        this.mustPlay = mustPlay;
        this.shouldPlay = shouldPlay;
        this.isSystem = isSystem;
    }
    return Behavior;
}());
exports.Behavior = Behavior;
//# sourceMappingURL=behavior.js.map