var common = require('./common.js');
var querystring = require('querystring');
var redis = require('redis');
var redisClient = redis.createClient();
var consts = require('./consts.js');

function handleAutologin(reqUrl, req, res) {

    var queryObj = querystring.parse(reqUrl.query);
    var tokenInfo = JSON.parse(queryObj.tokenInfo);

    autologinUser(res, tokenInfo.email, tokenInfo.token);
};

function autologinUser(res, email, token) {

    redisClient.hget(consts.ACCOUNT, email, function (err, data) {

        if (!data) {
            reject(res, email);
        } else {
            autologin(res, email, token, data);
        }
    });
}

function autologin(res, email, token, data) {

    var account = JSON.parse(data);

    if (account.token === token) {
        common.jsonResponse(res, 200, 'Authorized user \'' + email + '\'.');
    } else {
        common.jsonResponse(res, 401, 'Invalid token');
    }
}

function handleLogin(reqUrl, req, res) {

    var queryObj = querystring.parse(reqUrl.query);
    var loginInfo = JSON.parse(queryObj.loginInfo);

    loginUser(res, loginInfo.email, loginInfo.password);
};

function loginUser(res, email, password) {

    redisClient.hget(consts.ACCOUNT, email, function (err, data) {

        if (!data) {
            reject(res, email);
        } else {
            login(res, email, password, data);
        }
    });
}

function login(res, email, password, data) {

    var account = JSON.parse(data);
    var passHash = common.hashCode(password);

    if (account.passHash === passHash) {

        account.token = common.token();
        redisClient.hset(consts.ACCOUNT, email, JSON.stringify(account), function (err, result) {
            common.jsonResponse(res, 200, {
                message: 'Authorized user \'' + email + '\'.',
                email: email,
                token: account.token
            });
        });

    } else {
        common.jsonResponse(res, 401, 'Invalid password');
    }
}

function reject(res, email) {
    common.jsonResponse(res, 403, 'Invalid email \'' + email + '\'.');
}

exports.handleAutologin = handleAutologin;
exports.handleLogin = handleLogin;