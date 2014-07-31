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

exports.getContentType = getContentType;
