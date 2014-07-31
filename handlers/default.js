var fs = require('fs');
var getContentType = require('./common.js').getContentType;

function handleDefault(reqUrl, req, res) {
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

function getFilePath (req) {
    return __dirname + '../../public' + (req.url === '/' ? '/index.html' : req.url);
};

exports.default = handleDefault;
exports.map = {
    '/register.json': require('./register').handleRegister
};
