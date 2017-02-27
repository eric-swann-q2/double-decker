/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai-datetime/index.d.ts" />

import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { expect } from 'chai';
import { Emitter } from '../src/emitter';
import { MemoryStore } from '../src/store';
import { DataWithIdMessageFactory } from '../src/message-factory';
import { IBus, Bus } from '../src/bus';
import { IActionPlayer, ActionPlayer, IEventPlayer, EventPlayer } from '../src/player';
import { ConsoleLogger } from '../src/logger';
import { ActionCallback, Action, EventCallback, Event } from '../src/message';

chai.use(chaiAsPromised);
const logger = new ConsoleLogger;

describe('When using Action player', () => {
  const emitter = new Emitter(logger);
  const store = new MemoryStore();
  const messageFactory = new DataWithIdMessageFactory("itemId");
  const bus: IBus = new Bus(messageFactory, emitter, store, logger);
  const player: IActionPlayer = new ActionPlayer(emitter, store, logger);

  const receivedActions = new Array<Action<any>>();
  const actionReceiver: ActionCallback = action => { receivedActions.push(action); return receivedActions; }

  bus.receive("testActionType", actionReceiver);
  let resultPromise = bus.send("testActionType", { itemId: "test1" });
  let resultPromise2 = bus.send("testActionType", { itemId: "test2" });
  let resultPromise3 = bus.send("testActionType", { itemId: "test3" });
  let resultPromise4 = bus.send("testActionType", { itemId: "test4" });

  it('Can see all published actions', () => {
    expect(player.messages.length).to.equal(4);
  });

  it('Can play the first action', () => {
    receivedActions.length = 0;
    let resultPromise = player.playNext();

    expect(resultPromise).to.eventually.not.be.undefined;
    expect(resultPromise).to.eventually.have.property("type", "testActionType");
  });

  it('Playing message moves head', () => {
    expect(player.previous.data.itemId).to.equal("test1");
    expect(player.next.data.itemId).to.equal("test2");
  });

  it('Can play multiple actions', () => {
    let resultPromise = player.play(2);
    expect(player.previous.data.itemId).to.equal("test3");
    expect(player.next.data.itemId).to.equal("test4");
  });

  it('Can reset head', () => {
    let resultPromise = player.setHead(0);
    expect(player.next.data.itemId).to.equal("test1");
  });

  it('Can reset head by ID', () => {
    let resultPromise = player.setHeadById("test3");
    expect(player.next.data.itemId).to.equal("test3");
  });

  it('Can clear actions', () => {
    player.clear();
    expect(player.next).to.be.undefined;
  });

});

describe('When using Event player', () => {
  const emitter = new Emitter(logger);
  const store = new MemoryStore();
  const messageFactory = new DataWithIdMessageFactory("itemId");
  const bus: IBus = new Bus(messageFactory, emitter, store, logger);
  const player: IEventPlayer = new EventPlayer(emitter, store, logger);

  const subscribedEvents = new Array<Event<any>>();
  const eventSubscriber: EventCallback = event => { subscribedEvents.push(event); return subscribedEvents; }

  bus.subscribe("testEventType", eventSubscriber);
  let resultPromise = bus.publish("testEventType", { itemId: "test1" });
  let resultPromise2 = bus.publish("testEventType", { itemId: "test2" });
  let resultPromise3 = bus.publish("testEventType", { itemId: "test3" });
  let resultPromise4 = bus.publish("testEventType", { itemId: "test4" });

  it('Can see all published events', () => {
    expect(player.messages.length).to.equal(4);
  });

  it('Can play the first event', () => {
    subscribedEvents.length = 0;
    let resultPromise = player.playNext();

    expect(resultPromise).to.eventually.not.be.undefined;
    expect(resultPromise).to.eventually.have.property("type", "testEventType");
  });

  it('Playing message moves head', () => {
    expect(player.previous.data.itemId).to.equal("test1");
    expect(player.next.data.itemId).to.equal("test2");
  });

  it('Can play multiple events', () => {
    let resultPromise = player.play(2);
    expect(player.previous.data.itemId).to.equal("test3");
    expect(player.next.data.itemId).to.equal("test4");
  });

  it('Can reset head', () => {
    let resultPromise = player.setHead(0);
    expect(player.next.data.itemId).to.equal("test1");
  });

  it('Can reset head by ID', () => {
    let resultPromise = player.setHeadById("test3");
    expect(player.next.data.itemId).to.equal("test3");
  });

  it('Can clear events', () => {
    player.clear();
    expect(player.next).to.be.undefined;
  });

});


