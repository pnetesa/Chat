var common = require('./common.js');
var accountData = require('../data/account.js');
var HttpError = require('../utils/error').HttpError;
var async = require('async');

var availableColors = [
    '#6495ed',
    '#6d1b72',
    '#361b72',
    '#aa7100',
    '#7c7c7c',
    '#721b1b',
    '#49721b',
    '#69721b',
    '#1b5372',
    '#1b7249',
    '#000000',
];

function post(req, res, next) {

    var userInfo = req.body.userInfo;
    async.waterfall([
        function (callback) {
            ensureNewUser(userInfo, callback);
        },
        function (callback) {
            register(userInfo.username, userInfo.email, userInfo.password, callback);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        }

        res.json(result);
    });
};

function ensureNewUser(userInfo, callback) {
    accountData.isExists(userInfo.email, function (err, result) {

        if (err) {
            return callback(err);
        }

        var accountExists = result > 0;
        if (accountExists) {
            return callback(new HttpError(401, 'User \'' + userInfo.email + '\' already registered. Try another email.'));
        }

        callback(null);
    });
}

function register(username, email, password, callback) {

    var account = {
        username: username,
        color: getColor(),
        passHash: common.hashCode(password),
        token: common.token()
    };

    accountData.save(email, account, function (err, result) {

        if (err) {
            return callback(err);
        }

        callback(null, {
            message: 'Registered user \'' + email + '\'.',
            username: account.username,
            email: email,
            token: account.token
        });
    });
}

function getColor() {
    return availableColors[Math.ceil(Math.random() * (availableColors.length - 1))];
}

exports.post = post;