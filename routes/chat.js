var getModel = require('../models/message').getModel;
var async = require('async');
var config = require('../config');
var authorization = require('../middleware/authorize');
var log = require('../utils/log');
var MAX_MESSAGES = 20

function init(server) {
    var io = require('socket.io').listen(server);
    io.set('origins', config.get('socketsOrigins'));
    io.sockets.on('connection', clientConnected);
}

function clientConnected(client) {

    client.on('join', function (roomId, userInfo) {
        authorizeClient(client, userInfo, function (account) {
            join(client, roomId, userInfo.email, account);
        });
    });

    client.on('message', function (text, callback) {
        authorizeClient(client, client.userInfo, function (account) {
            message(client, text, callback, account);
        });
    });

    client.on('uploaded-file', function (file) {
        authorizeClient(client, client.userInfo, function (account) {
            uploadedFile(client, file, account);
        });
    });

    client.on('disconnect', function () {
        authorizeClient(client, client.userInfo, function (account) {
            disconnect(client, account);
        });
    });
}

function authorizeClient(client, userInfo, success) {

    authorization.authorize(userInfo, function (err, account) {
        if (err) {
            log.warning(err);
            client.emit('unauthorized');
            return;
        }

        success(account);
    });

}

function join(client, roomId, email, account) {

    client.userInfo = {
        email: email,
        token: account.token
    };
    client.roomId = roomId

    async.waterfall([
        function (callback) {
            sendHistory(client, roomId, callback);
        },
        function (callback) {

            var message = getSystemMsg(
                client.roomId,
                account.username + ' has joined the chat',
                account.color);

            message.save(function (err) {

                if (err) {
                    callback(err);
                }

                notifyOthers(client, message);
                callback(null);
            });
        },
    ], function (err) {
        if (err) {
            log.error(err);
            return client.emit('error');
        }
    });
}

function sendHistory(client, roomId, callback) {

    var Message = getModel(roomId);
    Message.find({}, function (err, messages) {

        if (err) {
            callback(err);
        }

        messages.forEach(function (message) {
            notifyMe(client, message);
        });
        callback(null);
    }).limit(MAX_MESSAGES);
}

function message(client, text, callback, account) {

    var Message = getModel(client.roomId);
    var message = new Message({
        username: account.username,
        color: account.color,
        text: text
    });

    message.save(function (err) {

        if (err) {
            log.error(err);
            return client.emit('error');
        }

        notifyMe(client, message);
        notifyOthers(client, message);

        callback && callback();
    });
}

function uploadedFile(client, file, account) {

    var Message = getModel(client.roomId);
    var message = new Message({
        username: account.username,
        color: account.color,
        isFile: true,
        filename: file.filename,
        filepath: file.filepath
    });

    message.save(function (err) {

        if (err) {
            log.error(err);
            return client.emit('error');
        }

        notifyMe(client, message);
        notifyOthers(client, message);
    });
}

function disconnect(client, account) {

    var message = getSystemMsg(
        client.roomId,
        account.username + ' has left',
        account.color);

    message.save(function (err) {

        if (err) {
            log.error(err);
            return client.emit('error');
        }

        notifyOthers(client, message);
    });
}

function getSystemMsg(roomId, text, color) {

    var Message = getModel(roomId);
    return new Message({
        isSystem: true,
        username: '',
        color: color,
        text: text
    });
}

function notifyMe(client, message) {
    client.emit('message', client.roomId, message);
}

function notifyOthers(client, message) {
    client.broadcast.emit('message', client.roomId, message);
}

module.exports = init;
