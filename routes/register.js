var common = require('./common.js');
var accountData = require('../data/account.js');

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
//function handleRegister(reqUrl, req, res) {

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
    return availableColors[Math.ceil(Math.random() * (availableColors.length - 1))];
}

function reject(res, email) {

    if (common.isDev) {
        accountData.clear();
    }

    common.jsonResponse(res, 401, 'User \'' + email + '\' already registered. Try another email.');
}

exports.post = post;