var accountData = require('../data/account');
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

    accountData.get(userInfo.email, function (err, data) {

        if (!data) {
            next(new HttpError(403, "Invalid e-mail"));
        } else {
            var account = JSON.parse(data);
            if (userInfo.token === account.token) {
                next();
            } else {
                next(new HttpError(403, "Invalid token"));
            }
        }
    });
}

module.exports.get = get;
module.exports.post = post;
module.exports.authorize = authorize;