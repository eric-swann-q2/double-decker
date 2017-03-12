/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import { expect } from 'chai';
import { Action, Event } from '../src/messages/message';
import { IStore, MemoryStore } from '../src/store';

describe('When storing actions', () => {
  it('Can retrieve stored actions', () => {
    const store: IStore = new MemoryStore();
    const testAction = new Action("testId", "testType", { test: "testData" }, new Date());
    store.addAction(testAction);
    expect(store.actions[0]).to.equal(testAction);
  });

  it('Can clear stored actions', () => {
    const store: IStore = new MemoryStore();
    const testAction = new Action("testId", "testType", { test: "testData" }, new Date());
    store.addAction(testAction);
    store.clearActions();
    expect(store.actions.length).to.equal(0);
  });
});

describe('When storing events', () => {
  it('Can retrieve stored events', () => {
    const store: IStore = new MemoryStore();
    const testEvent = new Event("testId", "testType", { test: "testData" }, new Date());
    store.addEvent(testEvent);
    expect(store.events[0]).to.equal(testEvent);
  });

  it('Can clear stored events', () => {
    const store: IStore = new MemoryStore();
    const testEvent = new Event("testId", "testType", { test: "testData" }, new Date());
    store.addEvent(testEvent);
    store.clearEvents();
    expect(store.events.length).to.equal(0);
  });
});
