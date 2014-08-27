var common = require('./common.js');
var roomData = require('../data/room.js');
var config = require('../config');
var log = require('../utils/log');
var HttpError = require('../utils/error').HttpError;

function get(req, res, next) {

    roomData.getAll(function (err, records) {

        var rooms = [];

        records.forEach(function (record) {
            var room = JSON.parse(record);
            rooms.push(room);
        });

        res.json(rooms);
    });

};

function post(req, res, next) {

    var room = {
        id: 'r' + common.hashCode(req.body.name),
        name: req.body.name
    }

    roomData.save(room, function (err, result) {

        if (err) {
            return next(err);
        } else if (result === 0) {

            if (config.get('isDev')) {
                roomData.clear();
                log.info('Cleared room data. All rooms and messages deleted');
            }

            return next(
                new HttpError(401,
                    'Room \'' + room.name + '\' already exists. Try another name.'));
        }

        res.json({ message: 'Created room \'' + room.name + '\'.' });
    });
};


exports.get = get;
exports.post = post;