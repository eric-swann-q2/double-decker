"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var category_1 = require("../src/messages/category");
describe('Category Enum', function () {
    it('Should have action category', function () {
        var category = category_1.Category.Action;
        chai_1.expect(category).to.equal(category_1.Category.Action);
    });
    it('Should have event category', function () {
        var category = category_1.Category.Event;
        chai_1.expect(category).to.equal(category_1.Category.Event);
    });
});
//# sourceMappingURL=category-spec.js.map