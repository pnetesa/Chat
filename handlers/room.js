var common = require('./common.js');
var messageData = require('../data/message.js');

function clientConnected(client) {

    client.on('join', join);
    client.on('message', message);
    client.on('disconnect', disconnect);

    function join(roomId, userInfo) {
        messageData.get(roomId, function (err, result) {

            var rows = result.reverse();
            rows.forEach(function (row) {
                var message = JSON.parse(row);
                client.emit('message', message);
            });

        });
    }

    function message(roomId, message) {
        messageData.save(roomId, message);
    }

    function disconnect(userInfo) {
    }

}

exports.clientConnected = clientConnected;