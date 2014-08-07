﻿var http = require('http');
var url = require('url');
var socket = require('socket.io');

var routing = require('./handlers/routing');
var room = require('./handlers/room');

var port = process.env.port || 5555;

var app = http.createServer(handleRequest);
var io = socket(app);

function handleRequest(req, res) {

    var reqUrl = url.parse(req.url);
    var pathname = reqUrl.pathname;
    console.log(pathname);

    var handler = routing.map[pathname] || routing.default;
    handler(reqUrl, req, res);

}

app.listen(port);
console.log('-- Server has started');

io.on('connection', room.clientConnected);