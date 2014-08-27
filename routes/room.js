var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var config = require('../config');
var getModel = require('../models/message').getModel;
var authorization = require('../middleware/authorize');
var async = require('async');
var log = require('../utils/log');

function get(req, res, next) {

    var Message = getModel(req.query.roomId);
    Message.find({}, function (err, messages) {

        if (err) {
            return next(err);
        }

        res.json(messages.reverse());
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

            log.info('Uploaded file: ' + file);

            callback(null, {
                filename: upload.name,
                filepath: file.substr(file.indexOf(config.get('uploadDir')))
            });
        });
    });
}

exports.get = get;
exports.post = post;