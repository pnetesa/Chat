var getContentType = require('./common.js').getContentType;
var querystring = require('querystring');

function handleRegister(reqUrl, req, res) {

    var queryObj = querystring.parse(reqUrl.query);
    var data = JSON.parse(queryObj.userInfo);

    res.writeHead(200, { 'Content-Type': getContentType('json') });
    res.end(JSON.stringify(data));
};

exports.handleRegister = handleRegister;