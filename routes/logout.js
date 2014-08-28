var Account = require('../models/account').Account;

function post(req, res, next) {

    var userInfo = req.body.userInfo;

    Account.logout(userInfo.email, userInfo.token, function (err, account) {

        if (err) {
            return next(err);
        }

        res.json({ message: 'User \'' + account.email + '\' logged out' });
    });
};

exports.post = post;
