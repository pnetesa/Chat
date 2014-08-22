﻿var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./utils/log');
var HttpError = require('./utils/error').HttpError;

var app = express();

// all environments
app.set('port', config.get('port'));

app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.logger(
    config.get('isDev') ? 'dev' : 'default'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(require('./middleware/sendHttpError'));

app.use(app.router);

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {

    if (typeof err === 'number') { // next(404);
        err = new HttpError(err);
    }

    if (err instanceof HttpError) { // next(new HttpError(...));
        return res.sendHttpError(err);
    }

    if (config.get('isDev')) {
        var errorHandler = app.use(express.errorHandler());
        errorHandler(err, req, res, next);
    } else {
        log.error(err);
        err = new HttpError(500);
        res.sendHttpError(err);
    }
});

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
});

require('./routes/chat')(server);