var winston = require('winston');
var config = require('../config');

module.exports = new winston.Logger({
    transports: [
        new winston.transports.Console({
            colorize: true,
            level: config.get('isDev') ? 'debug' : 'error'
        })
    ]
});