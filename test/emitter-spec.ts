/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai-datetime/index.d.ts" />

import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { expect } from 'chai';
import { Emitter, IEmitter } from '../src/emitter';
import { ConsoleLogger } from '../src/logger';
import { ActionCallback, Action, EventCallback, Event } from '../src/message';

chai.use(chaiAsPromised);

describe('When using Action emitter', () => {

  const emitter: IEmitter = new Emitter(new ConsoleLogger());

  const receivedActions = new Array<Action<any>>();
  const actionReceiver: ActionCallback = action => { receivedActions.push(action); return receivedActions; }

  it('Can add and get a receiver', () => {
    emitter.addReceiver("testActionType", actionReceiver);
    const receiver = emitter.getReceiver("testActionType");
    expect(receiver).to.equal(actionReceiver);
  });

  it('Can emit an action to the receiver', () => {
    let resultPromise = emitter.emitAction(new Action("testAction1", "testActionType", { testProp: "testProp" }, new Date()));

    expect(resultPromise).to.eventually.not.be.undefined;
    expect(resultPromise).to.eventually.have.property("id", "testAction1");
  });

  it('Errs if adding a duplicate receiver', () => {
    expect(() => emitter.addReceiver("testActionType", actionReceiver)).to.throw;
  });

  it('Can remove a receiver', () => {
    const receiver = emitter.removeReceiver("testActionType", actionReceiver);
    expect(receiver).to.equal(actionReceiver);
  });

  it('Errs when removing a non-existent receiver type', () => {
    expect(() => emitter.removeReceiver("testActionTypeBad", actionReceiver)).to.throw;
  });

  it('Errs when removing a non-existent receiver callback', () => {
    expect(() => emitter.removeReceiver("testActionType", action => {return null;})).to.throw;
  });

});

describe('When using Event emitter', () => {

  const emitter: IEmitter = new Emitter(new ConsoleLogger());

  const receivedEvents = new Array<Event<any>>();
  const eventSubscriber: EventCallback = event => { receivedEvents.push(event); return receivedEvents; }

  const receivedEvents2 = new Array<Event<any>>();
  const eventSubscriber2: EventCallback = event => { receivedEvents2.push(event); return receivedEvents2; }

  it('Can add and get a subscriber', () => {
    emitter.addSubscriber("testEventType", eventSubscriber);
    const subscribers = emitter.getSubscribers("testEventType");
    expect(subscribers[0]).to.equal(eventSubscriber);
  });

  it('Can emit an event to the subscriber', () => {
    let resultPromise = emitter.emitEvent(new Event("testEvent1", "testEventType", { testProp: "testProp" }, new Date()))[0];

    expect(resultPromise).to.eventually.not.be.undefined;
    expect(resultPromise).to.eventually.have.property("id", "testEvent1");
  });

  it('Can add a second subscriber for same event type', () => {
    emitter.addSubscriber("testEventType", eventSubscriber2);
    const subscribers = emitter.getSubscribers("testEventType");
    expect(subscribers[1]).to.equal(eventSubscriber2);
    
  });

  it('Can emit an events to multiple subscribers', () => {
    receivedEvents.length = 0;
    let resultPromises = emitter.emitEvent(new Event("testEventMultiple", "testEventType", { testProp: "testProp" }, new Date()));

    expect(resultPromises[0]).to.eventually.have.property("id", "testEventMultiple");
    expect(resultPromises[1]).to.eventually.have.property("id", "testEventMultiple");
  });

  it('Can remove a subscriber', () => {
    const subscriber = emitter.removeSubscriber("testEventType", eventSubscriber);
    expect(subscriber).to.equal(eventSubscriber);
  });

  it('Errs when removing a non-existent subscriber type', () => {
    expect(() => emitter.removeSubscriber("testEventTypeBad", eventSubscriber)).to.throw;
  });

  it('Errs when removing a non-existent subscriber callback', () => {
    expect(() => emitter.removeSubscriber("testEventType", event => {return null;})).to.throw;
  });

});
