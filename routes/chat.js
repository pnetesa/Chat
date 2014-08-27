var messageData = require('../data/message.js');
var config = require('../config');
var authorization = require('../middleware/authorize');

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

    client.on('uploaded-file', function (msg) {
        authorizeClient(client, client.userInfo, function (account) {
            uploadedFile(client, msg, account);
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
            client.emit('unauthorized');
            return;
        }

        success(account);
    });

}

function join(client, roomId, email, account) {
    sendHistory(client, roomId);
    client.userInfo = {
        email: email,
        token: account.token
    };
    client.roomId = roomId

    var msg = getSystemMsg(
        account.username + ' has joined the chat',
        account.color);

    messageData.save(client.roomId, msg);

    notifyOthers(client, msg);
}

function sendHistory(client, roomId) {
    messageData.get(roomId, function (err, result) {

        var rows = result.reverse();
        rows.forEach(function (row) {
            notifyMe(client, JSON.parse(row));
        });

    });
}

function message(client, text, callback, account) {

    var msg = {
        username: account.username,
        color: account.color,
        text: text
    };

    messageData.save(client.roomId, msg);

    notifyMe(client, msg);
    notifyOthers(client, msg);

    callback && callback();
}

function uploadedFile(client, msg, account) {

    msg.isFile = true;
    msg.username = account.username;
    msg.color = account.color;

    messageData.save(client.roomId, msg);

    notifyMe(client, msg);
    notifyOthers(client, msg);
}

function disconnect(client, account) {
    var msg = getSystemMsg(
        account.username + ' has left',
        account.color);

    messageData.save(client.roomId, msg);
    notifyOthers(client, msg);
}

function getSystemMsg(text, color) {
    return {
        isSystem: true,
        username: '',
        color: color || '#000000',
        text: text
    };
}

function notifyMe(client, message) {
    client.emit('message', client.roomId, message);
}

function notifyOthers(client, message) {
    client.broadcast.emit('message', client.roomId, message);
}

module.exports = init;
