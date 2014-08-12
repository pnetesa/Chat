var fs = require('fs');
var formidable = require('formidable');
var common = require('./common.js');
var login = require('./login.js');
var messageData = require('../data/message.js');

function clientConnected(client) {

    client.on('join', function (roomId, userInfo) {
        authorizeClient(client, userInfo, function () {
            join(client, roomId, userInfo);
        });
    });

    client.on('message', function (msg) {
        authorizeClient(client, client.userInfo, function () {
            message(client, msg);
        });
    });

    client.on('uploaded-file', function (msg) {
        authorizeClient(client, client.userInfo, function () {
            uploadedFile(client, msg);
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

function uploadedFile(client, msg) {
    msg.isFile = true;
    notify(client, msg);
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
    client.broadcast.emit('message', client.roomId, message);
}

function notify(client, message) {
    client.emit('message', client.roomId, message);
}

function handleGetHistory(reqUrl, req, res) {

    login.authorizeRequest(reqUrl, res, function (userInfo) {

        var roomId = common.getUrlArg(reqUrl, 'roomId');
        messageData.getAll(roomId, function (err, records) {
            var messages = [];

            records.forEach(function (record) {
                var message = JSON.parse(record);
                messages.push(message);
            });

            common.jsonResponse(res, 200, messages);
        });
    });

};

function handleUploadFile(reqUrl, req, res) {

    if (req.method.toLowerCase() !== 'post') {
        common.jsonResponse(res, 403, 'Invalid http method');
        return;
    }

    var form = new formidable.IncomingForm();
    form.uploadDir = common.uploadDir;
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {

        if (err) {
            common.jsonResponse(res, 400, err);
            console.log(err);
            return;
        }

        var userInfo = { email: fields.email, token: fields.token };
        login.authorize(userInfo, function (authorized) {

            if (!authorized) {
                common.jsonResponse(res, 401, 'Invalid token');
                return;
            }

            var directory = common.uploadDir + '/' + +new Date();
            var file = directory + '/' + files.upload.name;

            fs.mkdir(directory, function (err) {

                fs.rename(files.upload.path, file, function (err) {
                    if (err) {
                        console.log(err);
                        fs.unlink(file);
                        fs.rename(files.upload.path, file);
                    }

                    common.jsonResponse(res, 200, {
                        filename: files.upload.name,
                        filepath: file.substr(file.indexOf('upload/')),
                    });
                });
            });

        });
    });


}

exports.clientConnected = clientConnected;
exports.handleGetHistory = handleGetHistory;
exports.handleUploadFile = handleUploadFile;