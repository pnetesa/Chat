var common = require('./common.js');
var roomData = require('../data/room.js');
var login = require('./login.js');

function handleGetRooms(reqUrl, req, res) {

    var userInfo = common.getUrlObj(reqUrl, 'userInfo');
    login.authorize(res, userInfo, function () {
        getRooms(res);
    });
};

function getRooms(res) {
    roomData.getAll(function (err, roomsData) {

        var rooms = [];

        roomsData.forEach(function (roomData) {
            var room = JSON.parse(roomData);
            rooms.push(room);
        });

        common.jsonResponse(res, 200, rooms);
    });
}

function handleCreateRoom(reqUrl, req, res) {

    var userInfo = common.getUrlObj(reqUrl, 'userInfo');
    login.authorize(res, userInfo, function () {

        var name = common.getUrlArg(reqUrl, 'name');

        var room = {
            id: 'r' + common.hashCode(name),
            name: name
        }

        roomData.save(room, function (err, result) {
            if (result > 0) {
                getRooms(res);
            } else {

                if (common.isDev) {
                    roomData.clear();
                }

                common.jsonResponse(res, 401, 'Room \'' + room.name + '\' already exists. Try another name.');
            }
        });
    });
};

exports.handleGetRooms = handleGetRooms;
exports.handleCreateRoom = handleCreateRoom;