"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
var lastPushTime = 0;
var lastRandChars = [];
function createId() {
    var now = new Date().getTime();
    var duplicateTime = (now === lastPushTime);
    lastPushTime = now;
    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
        timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
        now = Math.floor(now / 64);
    }
    if (now !== 0) {
        throw new Error("We should have converted the entire timestamp.");
    }
    var id = timeStampChars.join("");
    if (duplicateTime) {
        var j = void 0;
        for (j = 11; j >= 0 && lastRandChars[j] === 63; j--) {
            lastRandChars[j] = 0;
        }
        lastRandChars[j]++;
    }
    else {
        for (var j = 0; j < 12; j++) {
            lastRandChars[j] = Math.floor(Math.random() * 64);
        }
    }
    for (var k = 0; k < 12; k++) {
        id += PUSH_CHARS.charAt(lastRandChars[k]);
    }
    if (id.length !== 20) {
        throw new Error("Length should be 20.");
    }
    return id;
}
exports.createId = createId;
;
//# sourceMappingURL=push-id.js.map