var common = require('./common.js');
var accountData = require('../data/account.js');

var availableColors = [
    '#0000ff',
    '#8a2be2',
    '#a52a2a',
    '#deb887',
    '#5f9ea0',
    '#6495ed',
    '#dc143c',
    '#006400',
    '#ff8c00',
    '#b22222',
    '#cd5c5c',
];

function handleRegister(reqUrl, req, res) {

    var userInfo = common.getUrlObj(reqUrl, 'userInfo');

    accountData.isExists(userInfo.email, function (err, result) {

        var accountExists = result > 0;

        if (accountExists) {
            reject(res, userInfo.email);
        } else {
            register(res, userInfo.username, userInfo.email, userInfo.password);
        }
    });
};

function register(res, username, email, password) {

    var account = {
        username: username,
        color: getColor(),
        passHash: common.hashCode(password),
        token: common.token()
    };

    accountData.save(email, account, function (err, result) {
        if (result === 1) {
            common.jsonResponse(res, 200, {
                message: 'Registered user \'' + email + '\'.',
                username: account.username,
                color: account.color,
                email: email,
                token: account.token
            });
        } else {
            common.jsonResponse(res, 403, 'Registration failed. Cannot create user account.');
        }
    });
}

function getColor() {
    return availableColors[Math.ceil(Math.random() * availableColors.length)];
}

function reject(res, email) {

    if (common.isDev) {
        accountData.clear();
    }

    common.jsonResponse(res, 401, 'User \'' + email + '\' already registered. Try another email.');
}

exports.handleRegister = handleRegister;