var Room = require('../models/room').Room;
var HttpError = require('../utils/error').HttpError;

function get(req, res, next) {
    Room.find({}, function (err, rooms) {

        if (err) {
            return next(err);
        }

        res.json(rooms);
    });
};

function post(req, res, next) {

    var room = new Room({
        name: req.body.name
    });
    room.roomId = 'r' + room._id.valueOf();

    room.save(function (err) {

        if (err) {
            return next(new HttpError(401,
                    'Room \'' + room.name + '\' already exists. Try another name'));
        }

        res.json({ message: 'Created room \'' + room.name + '\'.' });
    });
};


exports.get = get;
exports.post = post;