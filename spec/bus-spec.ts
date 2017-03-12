/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai-datetime/index.d.ts" />

import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { expect } from 'chai';
import { Emitter } from '../src/emitter';
import { MemoryStore } from '../src/store';
import { MessageFactory } from '../src/message-factory';
import { IBus, Bus } from '../src/bus';
import { ConsoleLogger } from '../src/logger';
import { Action, Event } from '../src/messages/message';
import { ActionCallback, EventCallback } from '../src/messages/callbacks';

chai.use(chaiAsPromised);
const logger = new ConsoleLogger;

describe('When using Action emitter', () => {
  const emitter = new Emitter(logger);
  const store = new MemoryStore();
  const bus: IBus = new Bus(new MessageFactory(), emitter, store, logger);

  const receivedActions = new Array<Action<any>>();
  const actionReceiver: ActionCallback = action => { receivedActions.push(action); return receivedActions; }

  it('Can add and get a receiver', () => {
    bus.receive("testActionType", actionReceiver);
    const receiver = emitter.getReceiver("testActionType");
    expect(receiver).to.equal(actionReceiver);
  });

  it('Can emit an action to the receiver', () => {
    bus.createAndSend("testActionType", { testProp: "testActionProp1" });
    expect(bus.lastAction.type).to.equal("testactiontype");
  });

  it('Records the last action', () => {
    expect(bus.lastAction.data.testProp).to.equal("testActionProp1");
  });

  it('Errs if adding a duplicate receiver', () => {
    expect(() => bus.receive("testActionType", actionReceiver)).to.throw;
  });

  it('Can remove a receiver', () => {
    bus.unreceive("testActionType", actionReceiver);
    const receiver = emitter.getReceiver("testActionType");
    expect(receiver).to.be.empty;
  });

  it('Errs when removing a non-existent receiver type', () => {
    expect(() => bus.unreceive("testActionTypeBad", actionReceiver)).to.throw;
  });

  it('Errs when removing a non-existent receiver callback', () => {
    expect(() => bus.unreceive("testActionType", action => { return null; })).to.throw;
  });
});

describe('When using Event emitter', () => {

  const emitter = new Emitter(logger);
  const bus: IBus = new Bus(new MessageFactory(), emitter, new MemoryStore(), logger);

  const receivedEvents = new Array<Event<any>>();
  const eventSubscriber: EventCallback = event => { receivedEvents.push(event); }
  const eventSubscriber2: EventCallback = event => { receivedEvents.push(event); }

  it('Can add and get a subscriber', () => {
    bus.subscribe("testEventType", eventSubscriber);
    const subscribers = emitter.getSubscribers("testEventType");
    expect(subscribers[0]).to.equal(eventSubscriber);
  });

  it('Can emit an event to the subscriber', () => {
    bus.createAndPublish("testEventType", { testProp: "testEventProp1" });
    expect(bus.lastEvent.type).to.equal("testeventtype");
  });

  it('Records data from the last event', () => {
    bus.createAndPublish("testEventType", { testProp: "testEventProp2" });
    expect(bus.lastEvent.data.testProp).to.equal("testEventProp2");
  });

  it('Can add a second subscriber for same event type', () => {
    bus.subscribe("testEventType", eventSubscriber2);
    const subscribers = emitter.getSubscribers("testEventType");
    expect(subscribers[1]).to.equal(eventSubscriber2);
  });

  it('Can emit an events to multiple subscribers', () => {
    receivedEvents.length = 0;
    let resultPromise = bus.createAndPublish("testEventType", { testProp: "testProp" });

    expect(receivedEvents).to.have.length(2);
  });

  it('Can remove a subscriber', () => {
    bus.unsubscribe("testEventType", eventSubscriber);
    const subscribers = emitter.getSubscribers("testEventType");
    expect(subscribers).to.not.contain(eventSubscriber);
  });

  it('Errs when removing a non-existent subscriber type', () => {
    expect(() => bus.unsubscribe("testEventTypeBad", eventSubscriber)).to.throw;
  });

  it('Errs when removing a non-existent subscriber callback', () => {
    expect(() => bus.unsubscribe("testEventType", event => { return null; })).to.throw;
  });

});
