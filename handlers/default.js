var fs = require('fs');
var getContentType = require('./common.js').getContentType;

function handleDefault(reqUrl, req, res) {
    fs.readFile(getFilePath(req), function (err, file) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500: Not found');
        } else {
            res.writeHead(200, { 'Content-Type': getContentType(req) });
            res.end(file);
        }
    });
};

function getFilePath(req) {
    return __dirname + '../../public' +
        (req.url === '/' ?
            '/index.html' : decodeURIComponent(req.url));
};

exports.handleDefault = handleDefault;
