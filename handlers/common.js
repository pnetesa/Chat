var contentTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'ico': 'image/x-icon',
    'js': 'application/javascript',
    'json': 'application/json',
    'jpg': 'image/jpeg',
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

    return contentTypes[extension];
};


function hashCode(text) {

    if (!text) {
        return 0;
    }

    var hash = 0;
    var char;

    for (var i = 0; i < text.length; i++) {
        char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }

    return hash;
}

function jsonResponse(res, statusCode, arg) {

    var result = arg && (typeof (arg) === 'string') ? { message: arg }
                                                    : arg ? arg : {};

    res.writeHead(statusCode, { 'Content-Type': getContentType('json') });
    res.end(JSON.stringify(result));
}

function token() {
    return Math.random().toString(36).substr(2);
}

exports.getContentType = getContentType;
exports.hashCode = hashCode;
exports.jsonResponse = jsonResponse;
exports.token = token;
