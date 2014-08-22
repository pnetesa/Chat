var common = require('./common.js');
var accountData = require('../data/account.js');

    //function post(reqUrl, req, res) {
function post(req, res, next) {
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

exports.post = post;
