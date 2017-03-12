/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import { expect } from 'chai';
import { createId } from '../src/push-id';

describe('Push ID Generator', () => {

  it('Should create valid ID', () => {
    let id = createId();
    expect(id).to.not.be.empty;
    expect(id).to.have.length(20);
  });

  it('Should generate sequential IDs', () => {
    let id1 = createId();
    let id2 = createId();
    expect(id1.substr(0, 19)).to.equal(id2.substr(0, 19), 'The IDs are the same except the last char');
  });

});
