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
    ], function (err, userInfo) {
        if (err) {
            return next(err);
        }

        res.json(userInfo);
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

function login(res, email, password, data) {

    var account = JSON.parse(data);
    var passHash = common.hashCode(password);

    if (account.passHash === passHash) {


    } else {
        invalidPassword(res);
    }
}

//function get(reqUrl, req, res) {
function get(req, res, next) {

    authorizeRequest(reqUrl, res, function (userInfo) {
        authorizedUser(res, userInfo.email);
    });

};

function authorize(userInfo, callback) {

    if (!userInfo) {
        callback(false);
        return;
    }

    accountData.get(userInfo.email, function (err, data) {

        if (!data) {
            callback(false);
        } else {
            var account = JSON.parse(data);
            callback(userInfo.token === account.token);
        }
    });
}

function authorizeRequest(req, res, success) {

    //var userInfo = common.getUrlObj(reqUrl, 'userInfo');
    var userInfo = JSON.parse(req.query.userInfo);
    authorize(userInfo, function (authorized) {

        if (!authorized) {
            accessDenied(res);
            return;
        }

        success(userInfo);
    });
}

function handleLogout(reqUrl, req, res) {
    var userInfo = common.getUrlObj(reqUrl, 'userInfo');
    accountData.get(userInfo.email, function (err, data) {
        if (!data) {
            invalidEmail(res, userInfo.email);
        } else {
            logout(res, userInfo.email, userInfo.token, data);
        }
    });
};

function logout(res, email, token, data) {
    var account = JSON.parse(data);
    if (account.token === token) {
        account.token = '';
        accountData.save(email, account, function (err, result) {
            userLoggedOut(res, email);
        });
    } else {
        invalidToken(res);
    }
}

function authorizedUser(res, arg) {

    if (typeof(arg) === 'string') {
        arg = 'Authorized user \'' + arg + '\'.'
    } else {
        arg.message = 'Authorized user \'' + arg.email + '\'.';
    }

    common.jsonResponse(res, 200, arg);
}

function userLoggedOut(res, email) {
    common.jsonResponse(res, 200, 'User \'' + email + '\' logged out');
}

function invalidPassword(res) {
    common.jsonResponse(res, 401, 'Invalid password');
}

function invalidEmail(res, email) {
    common.jsonResponse(res, 403, 'Invalid email \'' + email + '\'.');
}

function invalidToken(res, message) {
    message = message || 'Invalid token';
    common.jsonResponse(res, 401, message);
}

function accessDenied(res) {
    common.jsonResponse(res, 401, 'Access denied');
}

exports.post = post;
exports.get = get;
exports.handleLogout = handleLogout;
exports.authorize = authorize;
exports.authorizeRequest = authorizeRequest;
