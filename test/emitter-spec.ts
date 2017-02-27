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
    expect(() => emitter.addReceiver("testActionType", actionReceiver)).to.throw();
  });

  it('Can remove a receiver', () => {
    const receiver = emitter.removeReceiver("testActionType", actionReceiver);
    expect(receiver).to.equal(actionReceiver);
  });

});
