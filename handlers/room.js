var common = require('./common.js');
var login = require('./login.js');
var messageData = require('../data/message.js');

function clientConnected(client) {

    client.on('join', function (roomId, userInfo) {
        authorizeClient(client, userInfo, function () {
            join(client, roomId, userInfo);
        });
    });

    client.on('message', function (roomId, msg) {
        authorizeClient(client, client.userInfo, function () {
            message(client, roomId, msg);
        });
    });

    client.on('disconnect', function (userInfo) {
        authorizeClient(client, client.userInfo, function () {
            disconnect(client, userInfo);
        });
    });
}

function authorizeClient(client, userInfo, success) {

    login.authorize(userInfo, function (authorized) {

        if (!authorized) {
            notifySystem(client, 'Not authorized!');
            return;
        }

        success();
    });
}

function join(client, roomId, userInfo) {
    sendHistory(client, roomId);
    client.userInfo = userInfo;
    client.roomId = roomId
    notifySystem(client, 
        client.userInfo.username + ' has joined the chat',
        true,
        userInfo.color);
}

function sendHistory(client, roomId) {
    messageData.get(roomId, function (err, result) {

        var rows = result.reverse();
        rows.forEach(function (row) {
            notify(client, JSON.parse(row));
        });

    });
}

function message(client, msg) {
    notifyAll(client, msg);
}

function disconnect(client) {
    notifySystem(client,
        client.userInfo.username + ' has left',
        true,
        client.userInfo.color);
}

function notifySystem(client, text, all, color) {

    var message = {
        isSystem: true,
        username: '',
        color: color || '#000000',
        text: text
    };

    all ? notifyAll(client, message) : notify(client, message);
}

function notifyAll(client, message) {
    messageData.save(client.roomId, message);
    client.broadcast.emit('message', message);
}

function notify(client, message) {
    client.emit('message', message);
}

exports.clientConnected = clientConnected;