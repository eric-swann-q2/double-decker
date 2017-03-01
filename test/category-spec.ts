/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import { expect } from 'chai';
import { Category } from '../src/messages/category';

describe('Category Enum', () => {

  it('Should have action category', () => {
    let category = Category.Action;
    expect(category).to.equal(Category.Action);
  });

  it('Should have event category', () => {
    let category = Category.Event;
    expect(category).to.equal(Category.Event);
  });

});
