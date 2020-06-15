const winston = require('winston');

module.exports = function () {

    const consoleTransport = new winston.transports.Console({
        level: 'debug',
        showLevel: true,
        timestamp: true,
        colorize: true,
        json: false,
    });

    const logger = new winston.Logger({
        transports: [consoleTransport]
    });

    return logger;
};