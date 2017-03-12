"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../src/logger");
describe('Logger', function () {
    var logger = new logger_1.ConsoleLogger();
    it('Should successfully log error', function () {
        logger.error('Test Message Error');
    });
    it('Should successfully log warn', function () {
        logger.warn('Test Message Warn');
    });
    it('Should successfully log info', function () {
        logger.info('Test Message Info');
    });
    it('Should successfully log debug', function () {
        logger.debug('Test Message Debug');
    });
    it('Should successfully log debug with multiple arguments', function () {
        logger.debug('Test Message Debug', { test: 'test', thing: 'thing' });
    });
});
//# sourceMappingURL=logger-spec.js.map