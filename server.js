var http = require('http');
var url = require('url');
var handlers = require('./handlers/default');
var port = process.env.port || 5555;

http.createServer(function (req, res) {

    var reqUrl = url.parse(req.url);
    var pathname = reqUrl.pathname;
    console.log(pathname);

    var handler = handlers.map[pathname] || handlers.default;
    handler(reqUrl, req, res);

}).listen(port);
console.log('Server has started');

