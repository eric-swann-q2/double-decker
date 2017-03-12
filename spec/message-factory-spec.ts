import { MessageContract } from '../src/messages/message-contract';
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai-datetime/index.d.ts" />

import * as chaiDateTime from 'chai-datetime/chai-datetime';
import * as chai from 'chai';
import { expect } from 'chai';
import { Category } from '../src/messages/category';
import { IMessageFactory, MessageFactory } from '../src/message-factory';

chai.use(chaiDateTime);

describe('When creating an action', () => {

  let factory: IMessageFactory = new MessageFactory();
  const action = factory.CreateAction(new MessageContract("TestAction", { test: "testAction", thingy: "thingy" }));

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

  it('Should have valid data', () => {
    expect(action.data.test).to.equal("testAction");
    expect(action.data.thingy).to.equal("thingy");
  });

});

describe('When creating an event', () => {

  let factory: IMessageFactory = new MessageFactory();
  const event = factory.CreateEvent(new MessageContract("TestEvent", { test: "testEvent", thingy: "thingy" }));

  it('Should have Event category', () => {
    expect(event.category).to.equal(Category.Event);
  });

  it('Should have an ID', () => {
    expect(event.id).to.not.be.empty;
  });

  it('Should have a valid timestamp', () => {
    expect(event.timestamp).to.not.be.null;
    expect(event.timestamp).to.be.afterDate(new Date(2017, 1, 1));
    expect(event.timestamp).to.equalDate(new Date());
    expect(event.timestamp).to.be.beforeTime(new Date());
  });

  it('Should have valid data', () => {
    expect(event.data.test).to.equal("testEvent");
    expect(event.data.thingy).to.equal("thingy");
  });

});
