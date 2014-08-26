var querystring = require('querystring');

var contentTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'gif': 'image/gif',
    'ico': 'image/x-icon',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png'
};

function getContentType(req) {

    var extension = 'html';
    if (req.url) {
        var index = req.url.lastIndexOf('.');
        if (index >= 0) {
            extension = req.url.substr(index + 1);
        }
    }

    return contentTypes[extension] || 'application/octet-stream';
};

function hashCode(text) {

    if (!text) {
        return 0;
    }

    var hash = 0;
    var char;

    for (var i = 0, length = text.length; i < length; i++) {
        char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }

    return hash;
}

function token() {
    return Math.random().toString(36).substr(2);
}

exports.getContentType = getContentType;
exports.hashCode = hashCode;
exports.token = token;
