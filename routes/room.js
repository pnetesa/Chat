var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var config = require('../config');
var messageData = require('../data/message.js');
var authorization = require('../middleware/authorize');
var async = require('async');

function get(req, res, next) {

    var roomId = req.query.roomId;
    messageData.getAll(roomId, function (err, records) {

        if (err) {
            return next(err);
        }

        var messages = [];

        records.forEach(function (record) {
            var message = JSON.parse(record);
            messages.push(message);
        });

        res.json(messages);
    });
};

function post(req, res, next) {
    
    async.waterfall([
        function (callback) {
            parseForm(req, callback);
        },
        saveFile,
    ], function (err, result) {
        if (err) {
            return next(err);
        }

        res.json(result);
    });
}

function parseForm(req, callback) {

    var uploadDir = req.app.get('uploadDir');

    var form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {

        if (err) {
            return callback(err);
        }

        var userInfo = {
            email: fields.email,
            token: fields.token
        };

        authorization.authorize(userInfo, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, uploadDir, files.upload)
        });
    });
}

function saveFile(uploadDir, upload, callback) {

    var directory = path.join(uploadDir, +new Date() + '');
    var file = path.join(directory, upload.name);

    fs.mkdir(directory, function (err) {

        if (err) {
            return callback(err);
        }

        fs.rename(upload.path, file, function (err) {
            if (err) {
                console.log(err);
                fs.unlink(file);
                fs.rename(upload.path, file, function (err) { // 2nd try...
                    if (err) {
                        return callback(err);
                    }
                });
            }

            callback(null, {
                filename: upload.name,
                filepath: file.substr(file.indexOf(config.get('uploadDir')))
            });
        });
    });
}

exports.get = get;
exports.post = post;