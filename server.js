var http = require('http');
var url = require('url');
var routing = require('./handlers/routing');
var port = process.env.port || 5555;

http.createServer(function (req, res) {

    var reqUrl = url.parse(req.url);
    var pathname = reqUrl.pathname;
    console.log(pathname);

    var handler = routing.map[pathname] || routing.default;
    handler(reqUrl, req, res);

}).listen(port);
console.log('Server has started');

