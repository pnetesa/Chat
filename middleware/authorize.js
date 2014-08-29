var Account = require('../models/account').Account;
var HttpError = require('../utils/error').HttpError;

function get(req, res, next) {
    var userInfo = JSON.parse(req.query.userInfo);
    authorize(userInfo, next);
}

function post(req, res, next) {
    var userInfo = req.body.userInfo;
    authorize(userInfo, next);
}

function authorize(userInfo, next) {

    if (!userInfo) {
        next(new HttpError(403, "Unauthorized"));
        return;
    }

    Account.authorize(userInfo.email, userInfo.token, function (err, account) {

        if (err) {
            return next(err);
        }

        next(null, account);
    });
}

module.exports.get = get;
module.exports.post = post;
module.exports.authorize = authorize;