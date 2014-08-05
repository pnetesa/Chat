var common = require('./common.js');
var accountData = require('../data/account.js');

function handleLogin(reqUrl, req, res) {
    var loginInfo = common.getUrlArg(reqUrl, 'loginInfo');
    accountData.get(loginInfo.email, function (err, data) {
        if (!data) {
            reject(res, loginInfo.email);
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

function handleAutologin(reqUrl, req, res) {
    var tokenInfo = common.getUrlArg(reqUrl, 'tokenInfo');
    accountData.get(tokenInfo.email, function (err, data) {

        if (!data) {
            reject(res, tokenInfo.email);
        } else {
            autologin(res, tokenInfo.email, tokenInfo.token, data);
        }
    });
};

function autologin(res, email, token, data) {

    var account = JSON.parse(data);

    if (account.token === token) {
        common.jsonResponse(res, 200, 'Authorized user \'' + email + '\'.');
    } else {
        common.jsonResponse(res, 401, 'Invalid token');
    }
}

function reject(res, email) {
    common.jsonResponse(res, 403, 'Invalid email \'' + email + '\'.');
}

function handleLogout(reqUrl, req, res) {
    var tokenInfo = common.getUrlArg(reqUrl, 'tokenInfo');
    accountData.get(tokenInfo.email, function (err, data) {
        if (!data) {
            reject(res, tokenInfo.email);
        } else {
            logout(res, tokenInfo.email, tokenInfo.token, data);
        }
    });
};

function logout(res, email, token, data) {
    var account = JSON.parse(data);
    if (account.token === token) {
        account.token = '';
        accountData.save(email, account, function (err, result) {
            common.jsonResponse(res, 200, 'User \'' + email + '\' logged out');
        });
    } else {
        common.jsonResponse(res, 401, 'Invalid token');
    }
}

exports.handleLogin = handleLogin;
exports.handleAutologin = handleAutologin;
exports.handleLogout = handleLogout;