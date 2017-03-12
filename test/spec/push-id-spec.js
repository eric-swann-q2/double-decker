"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var push_id_1 = require("../src/push-id");
describe('Push ID Generator', function () {
    it('Should create valid ID', function () {
        var id = push_id_1.createId();
        chai_1.expect(id).to.not.be.empty;
        chai_1.expect(id).to.have.length(20);
    });
    it('Should generate sequential IDs', function () {
        var id1 = push_id_1.createId();
        var id2 = push_id_1.createId();
        chai_1.expect(id1.substr(0, 19)).to.equal(id2.substr(0, 19), 'The IDs are the same except the last char');
    });
});
//# sourceMappingURL=push-id-spec.js.map