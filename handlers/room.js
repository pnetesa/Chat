var common = require('./common.js');
var messageData = require('../data/message.js');

function clientConnected(client) {

    client.on('join', function (roomId, userInfo) {
        join(client, roomId, userInfo);
    });

    client.on('message', function (roomId, msg) {
        message(client, roomId, msg);
    });

    client.on('disconnect', function (userInfo) {
        disconnect(client, userInfo);
    });
}

function join(client, roomId, userInfo) {
    sendHistory(client, roomId);
    client.userInfo = userInfo;
    client.roomId = roomId
    notifySystem(client, 
        client.userInfo.username + ' has joined the chat',
        userInfo.color);
}

function sendHistory(client, roomId) {
    messageData.get(roomId, function (err, result) {

        var rows = result.reverse();
        rows.forEach(function (row) {
            var message = JSON.parse(row);
            client.emit('message', message);
        });

    });
}

function message(client, msg) {
    notifyAll(client, msg);
}

function disconnect(client) {
    notifySystem(client,
        client.userInfo.username + ' has left',
        client.userInfo.color);
}

function notifySystem(client, text, color) {
    var message = {
        isSystem: true,
        username: '',
        color: color || '#ffffff',
        text: text
    };
    notifyAll(client, message);
}

function notifyAll(client, message) {
    messageData.save(client.roomId, message);
    client.broadcast.emit('message', message);
}

exports.clientConnected = clientConnected;