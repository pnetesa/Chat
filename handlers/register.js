var common = require('./common.js');
var accountData = require('../data/account.js');

function handleRegister(reqUrl, req, res) {

    var userInfo = common.getUrlArg(reqUrl, 'userInfo');

    accountData.isExists(userInfo.email, function (err, result) {

        var accountExists = result > 0;

        if (accountExists) {
            reject(res, userInfo.email);
        } else {
            register(res, userInfo.email, userInfo.password);
        }
    });
};

function register(res, email, password) {

    var account = {
        passHash: common.hashCode(password),
        token: common.token()
    };

    accountData.save(email, account, function (err, result) {
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

function reject(res, email) {
    common.jsonResponse(res, 401, 'User \'' + email + '\' already registered. Try another email.');
    //accountData.clear();
}

exports.handleRegister = handleRegister;