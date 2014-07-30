var http = require('http');
var port = process.env.port || 5555;
var fs = require('fs');

var contentTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'ico': 'image/x-icon',
    'js': 'application/javascript',
    'json': 'application/json',
    'jpg': 'image/jpeg',
    'png': 'image/png'
};

http.createServer(function (req, res) {

    console.log(req.url);

    var handler = routes[req.url] || handleDefault;
    handler(req, res);

}).listen(port);
console.log('Server has started');

var handleDefault = function (req, res) {
    fs.readFile(getFilePath(req), function (err, file) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(err + '\n');
        } else {
            res.writeHead(200, { 'Content-Type': getContentType(req) });
            res.end(file);
        }
    });
};

var handleGetProducts = function (req, res) {
    res.writeHead(200, { 'Content-Type': getContentType('json') });
    res.end(JSON.stringify(data));
};

var routes = {
    '/products.json': handleGetProducts
};

var getFilePath = function(req) {
    return __dirname + '/public' + (req.url === '/' ? '/index.html' : req.url);
};

var getContentType = function(req) {

    var extension = 'html';
    if (req.url) {
        var index = req.url.lastIndexOf('.');
        if (index >= 0) {
            extension = req.url.substr(index + 1);
        }
    }

    return contentTypes[extension];
};

var data = [];
