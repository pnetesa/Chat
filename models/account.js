var common = require('../utils/common');
var db = require('../utils/database');
var async = require('async');
var HttpError = require('../utils/error').HttpError;

var schema = new db.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    passHash: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        default: '#000000'
    },
    token: String,
    created: {
        type: Date,
        default: Date.now
    }
});

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

schema.virtual('password')
    .set(function (password) {
        this.passHash = common.hashCode(password);
    });

schema.methods.generateColor = function () {
    this.color = availableColors[Math.ceil(Math.random() * (availableColors.length - 1))];
}

schema.methods.generateToken = function () {
    this.token = common.token();
}

schema.methods.clearToken = function () {
    this.token = '';
}

schema.methods.isPasswordValid = function (password) {
    return this.passHash === common.hashCode(password);
}

schema.statics.authenticate = function (email, password, callback) {
    var Account = this;

    async.waterfall([
        function (callback) {
            Account.findOne({ email: email.toLowerCase() }, callback);
        },
        function (account, callback) {
            if (!account) {
                return callback(new HttpError(403, 'Invalid email \'' + email + '\''));
            }

            if (!account.isPasswordValid(password)) {
                return callback(new HttpError(403, 'Invalid password'));
            }

            account.generateToken();
            account.save(function (err) {

                if (err) {
                    return callback(err);
                }

                return callback(null, account);
            });

        }
    ], callback);
}

schema.statics.authorize = function (email, token, callback) {
    var Account = this;

    async.waterfall([
        function (callback) {
            Account.findOne({ email: email.toLowerCase() }, callback);
        },
        function (account, callback) {
            if (!account) {
                return callback(new HttpError(403, 'Invalid email \'' + email + '\''));
            }

            if (account.token !== token) {
                return callback(new HttpError(403, 'Invalid token'));
            }

            return callback(null, account);
        }
    ], callback);
}

schema.statics.logout = function (email, token, callback) {
    var Account = this;

    async.waterfall([
        function (callback) {
            Account.findOne({ email: email.toLowerCase() }, callback);
        },
        function (account, callback) {
            if (!account) {
                return callback(new HttpError(403, 'Invalid email \'' + email + '\''));
            }

            if (account.token !== token) {
                return callback(new HttpError(403, 'Invalid token'));
            }

            account.clearToken();
            account.save(function (err) {

                if (err) {
                    return callback(err);
                }

                return callback(null, account);
            });
        }
    ], callback);
}

exports.Account = db.model('Account', schema);