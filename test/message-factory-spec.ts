/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai-datetime/index.d.ts" />

import * as chaiDateTime from 'chai-datetime/chai-datetime';
import * as chai from 'chai';
import { expect } from 'chai';
import { Category } from '../src/category';
import { IMessageFactory, MessageFactory } from '../src/message-factory';

chai.use(chaiDateTime);

describe('When creating an action', () => {

  let factory:IMessageFactory = new MessageFactory();
   const action = factory.CreateAction("TestAction", {test:"test", thingy:"thingy"});

  it('Should have Action category', () => {
    expect(action.category).to.equal(Category.Action);
  });

  it('Should have an ID', () => {
    expect(action.id).to.not.be.empty;
  });

  it('Should have a valid timestamp', () => {
    expect(action.timestamp).to.not.be.null;
    expect(action.timestamp).to.be.afterDate(new Date(2017, 1, 1));
    expect(action.timestamp).to.equalDate(new Date());
    expect(action.timestamp).to.be.beforeTime(new Date());
  });


});
