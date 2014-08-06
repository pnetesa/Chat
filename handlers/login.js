var common = require('./common.js');
var accountData = require('../data/account.js');

function handleLogin(reqUrl, req, res) {
    var loginInfo = common.getUrlObj(reqUrl, 'loginInfo');
    accountData.get(loginInfo.email, function (err, data) {
        if (!data) {
            invalidEmail(res, loginInfo.email);
        } else {
            login(res, loginInfo.email, loginInfo.password, data);
        }
    });
};

function login(res, email, password, data) {

    var account = JSON.parse(data);
    var passHash = common.hashCode(password);

    if (account.passHash === passHash) {

        account.token = common.token();
        accountData.save(email, account, function (err, result) {
            authorizedUser(res, {
                username: account.username,
                email: email,
                token: account.token
            });
        });

    } else {
        invalidPassword(res);
    }
}

function handleAutologin(reqUrl, req, res) {
    var userInfo = common.getUrlObj(reqUrl, 'userInfo');
    authorize(res, userInfo, function (authorized) {
        if (authorized) {
            authorizedUser(res, userInfo.email);
        } else {
            invalidToken(res, 'Detected another usage of your account.');
        }
    }, true);
};

function authorize(res, userInfo, callback, handleNonAuthorized) {
    accountData.get(userInfo.email, function (err, data) {

        if (!data) {
            invalidEmail(res, userInfo.email);
        } else {

            var account = JSON.parse(data);
            var authorized = userInfo.token === account.token;

            if (!authorized && !handleNonAuthorized) {
                invalidToken(res);
            } else {
                callback(authorized);
            }
        }
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

exports.handleLogin = handleLogin;
exports.handleAutologin = handleAutologin;
exports.handleLogout = handleLogout;
exports.authorize = authorize;