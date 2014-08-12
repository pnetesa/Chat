var http = require('http');
var url = require('url');
var socket = require('socket.io');

var routing = require('./handlers/routing');
var room = require('./handlers/room');

var port = process.env.port || 5555;
require('./handlers/common').uploadDir = __dirname + '/public/upload';

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
console.log('-- Server runs on port ' + port);

io.on('connection', room.clientConnected);