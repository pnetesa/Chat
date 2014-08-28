var Account = require('../models/account').Account;
var HttpError = require('../utils/error').HttpError;

function post(req, res, next) {

    var userInfo = req.body.userInfo;

    var account = new Account({
        username: userInfo.username,
        email: userInfo.email.toLowerCase(),
        password: userInfo.password
    });

    account.generateColor();

    account.save(function (err, account) {

        if (err) {
            return next(new HttpError(401, 'User \'' + userInfo.email + '\' already registered. Try another email'));
        }

        res.json({
            message: 'Registered user \'' + account.email + '\'.',
            username: account.username,
            email: account.email,
            token: account.token
        });
    });
};

exports.post = post;