var common = require('./common.js');
var roomData = require('../data/room.js');
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
            return next(
                new HttpError(401,
                    'Room \'' + room.name + '\' already exists. Try another name.'));
        }

        next();
    });
};


exports.get = get;
exports.post = post;