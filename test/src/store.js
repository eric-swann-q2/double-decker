"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MemoryStore = (function () {
    function MemoryStore() {
        this.actions = new Array();
        this.events = new Array();
        this.systemEvents = new Array();
    }
    MemoryStore.prototype.addAction = function (action) {
        this.actions.push(action);
    };
    MemoryStore.prototype.addEvent = function (event) {
        this.events.push(event);
    };
    MemoryStore.prototype.addSystemEvent = function (event) {
        this.systemEvents.push(event);
    };
    MemoryStore.prototype.clearActions = function () {
        this.actions.length = 0;
    };
    MemoryStore.prototype.clearEvents = function () {
        this.events.length = 0;
    };
    return MemoryStore;
}());
exports.MemoryStore = MemoryStore;
//# sourceMappingURL=store.js.map