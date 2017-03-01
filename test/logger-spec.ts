/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import { ILogger, ConsoleLogger } from '../src/logger';

describe('Logger', () => {

  let logger: ILogger = new ConsoleLogger();

  it('Should successfully log error', () => {
    logger.error('Test Message Error');
  });

  it('Should successfully log warn', () => {
    logger.warn('Test Message Warn');
  });

  it('Should successfully log info', () => {
    logger.info('Test Message Info');
  });

  it('Should successfully log debug', () => {
    logger.debug('Test Message Debug');
  });

  it('Should successfully log debug with multiple arguments', () => {
    logger.debug('Test Message Debug', { test: 'test', thing: 'thing' });
  });

});
