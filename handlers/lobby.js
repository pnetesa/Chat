﻿var common = require('./common.js');
var roomData = require('../data/room.js');
var login = require('./login.js');

function handleGetRooms(reqUrl, req, res) {

    login.authorizeRequest(reqUrl, res, function () {
        getRooms(res);
    });

};

function getRooms(res) {
    roomData.getAll(function (err, records) {

        var rooms = [];

        records.forEach(function (record) {
            var room = JSON.parse(record);
            rooms.push(room);
        });

        common.jsonResponse(res, 200, rooms);
    });
}

function handleCreateRoom(reqUrl, req, res) {

    login.authorizeRequest(reqUrl, res, function () {
        var name = common.getUrlArg(reqUrl, 'name');
        createRoom(res, name);
    });
};

function createRoom(res, name) {

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

            common.jsonResponse(res, 403, 'Room \'' + room.name + '\' already exists. Try another name.');
        }
    });
}

exports.handleGetRooms = handleGetRooms;
exports.handleCreateRoom = handleCreateRoom;