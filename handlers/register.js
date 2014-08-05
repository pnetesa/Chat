var common = require('./common.js');
var querystring = require('querystring');
var redis = require('redis');
var redisClient = redis.createClient();
var consts = require('./consts.js');

function handleRegister(reqUrl, req, res) {

    var queryObj = querystring.parse(reqUrl.query);
    var userInfo = JSON.parse(queryObj.userInfo);

    registerUser(res, userInfo.email, common.hashCode(userInfo.password));
};

function registerUser(res, email, passHash) {

    redisClient.hexists(consts.ACCOUNT, email, function (err, result) {

        var accountExists = result > 0;

        if (accountExists) {
            reject(res, email);
        } else {
            register(res, email, passHash);
        }
    });
}

function reject(res, email) {
    common.jsonResponse(res, 401, 'User \'' + email + '\' already registered. Try another email.');
    //clear();
}

function register(res, email, passHash) {

    var account = { passHash: passHash, token: common.token() };

    redisClient.hset(consts.ACCOUNT, email, JSON.stringify(account), function (err, result) {
        if (result === 1) {
            common.jsonResponse(res, 200, {
                message: 'Registered user \'' + email + '\'.',
                email: email,
                token: account.token
            });
        } else {
            common.jsonResponse(res, 403, 'Registration failed. Cannot create user account.');
        }
    });
}

function clear() {
    redisClient.del(consts.ACCOUNT);
}

exports.handleRegister = handleRegister;