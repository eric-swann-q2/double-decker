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
import { Action, Event } from '../src/messages/message';
import { ActionCallback, EventCallback } from '../src/messages/callbacks';

chai.use(chaiAsPromised);
const logger = new ConsoleLogger;

describe('When using Action player', () => {
  const emitter = new Emitter(logger);
  const store = new MemoryStore();
  const messageFactory = new DataWithIdMessageFactory("itemId");
  const bus: IBus = new Bus(messageFactory, emitter, store, logger);
  const player: IActionPlayer = new ActionPlayer(emitter, store, logger);

  const receivedActions = new Array<Action<any>>();
  const actionReceiver: ActionCallback = action => {
    receivedActions.push(action);
  }

  bus.receive("testActionType", actionReceiver);
  bus.createAndSend("testActionType", { itemId: "test1" });
  bus.createAndSend("testActionType", { itemId: "test2" });
  bus.createAndSend("testActionType", { itemId: "test3" });
  bus.createAndSend("testActionType", { itemId: "test4" });
  bus.createAndSend("testActionType", { itemId: "test5" });
  bus.createAndSend("testActionType", { itemId: "test6" });

  it('Can see all published actions', () => {
    expect(player.messages.length).to.equal(6);
    expect(receivedActions.length).to.equal(6);
  });

  it('Can play the first action', () => {
    receivedActions.length = 0;
    player.playNext();
    expect(receivedActions[0].data.itemId).to.equal("test1");
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
  const eventSubscriber: EventCallback = event => {
      subscribedEvents.push(event);
  }

  store.clearActions();
  bus.subscribe("testEventType", eventSubscriber);
  bus.createAndPublish("testEventType", { itemId: "test1" });
  bus.createAndPublish("testEventType", { itemId: "test2" });
  bus.createAndPublish("testEventType", { itemId: "test3" });
  bus.createAndPublish("testEventType", { itemId: "test4" });

  it('Can see all published events', () => {
    expect(player.messages.length).to.equal(4);
  });

  it('Can play the first event', () => {
    subscribedEvents.length = 0;
    player.playNext();

    expect(subscribedEvents[0].data.itemId).to.equal("test1");
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


