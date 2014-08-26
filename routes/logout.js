var common = require('./common.js');
var accountData = require('../data/account.js');
var HttpError = require('../utils/error').HttpError;

function post(req, res, next) {

    var userInfo = req.body.userInfo;
    accountData.get(userInfo.email, function (err, data) {

        if (err) {
            return next(err);
        }

        var account = JSON.parse(data);

        accountData.save(userInfo.email, account, function (err, result) {
            
            if (err) {
                return next(err);
            }

            res.json({ message: 'User \'' + userInfo.email + '\' logged out' });
        });
    });
};

exports.post = post;
