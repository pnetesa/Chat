var Account = require('../models/account').Account;

function post(req, res, next) {

    var loginInfo = req.body;

    Account.authenticate(loginInfo.email, loginInfo.password, function (err, account) {

        if (err) {
            return next(err);
        }

        res.json({
            message: 'Authorized user \'' + account.email + '\'.',
            username: account.username,
            email: account.email,
            token: account.token
        });
    });
};

// Auto-login passed well if we get here
function get(req, res, next) {
    res.json({ message: 'Auto-login ok.' });
};

exports.post = post;
exports.get = get;
