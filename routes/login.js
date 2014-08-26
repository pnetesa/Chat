var common = require('./common.js');
var accountData = require('../data/account.js');
var HttpError = require('../utils/error').HttpError;
var async = require('async');

function post(req, res, next) {

    var loginInfo = req.body;

    async.waterfall([
        function (callback) {
            findUser(loginInfo, callback);
        },
        authenticate
    ], function (err, result) {
        if (err) {
            return next(err);
        }

        res.json(result);
    });

};

function findUser(loginInfo, callback) {
    accountData.get(loginInfo.email, function (err, data) {

        if (err) {
            return callback(err);
        }

        if (!data) {
            return callback(new HttpError(403, 'Invalid email \'' + loginInfo.email + '\'.'));
        }

        callback(null, loginInfo.email, loginInfo.password, JSON.parse(data));
    });
}

function authenticate(email, password, account, callback) {
    if (account.passHash !== common.hashCode(password)) {
        return callback(new HttpError(403, 'Invalid email \'' + email + '\'.'));
    }

    account.token = common.token();
    accountData.save(email, account, function (err, result) {

        if (err) {
            return callback(err);
        }

        callback(null, {
            message: 'Authorized user \'' + email + '\'.',
            username: account.username,
            email: email,
            token: account.token
        });
    });
}

// Auto-login passed well if we get here
function get(req, res, next) {
    res.json({ message: 'Auto-login ok.' });
};

exports.post = post;
exports.get = get;
