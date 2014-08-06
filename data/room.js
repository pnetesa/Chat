var redis = require('redis');
var redisClient = redis.createClient();
var NAME = 'room';

function getAll(callback) {
    redisClient.smembers(NAME, callback);
}

function save(room, callback) {
    redisClient.sadd(NAME, JSON.stringify(room), callback);
}

function clear() {
    redisClient.smembers(NAME, function (err, rooms) {
        rooms.forEach(function (room) {
            redisClient.srem(NAME, room);
        });
        console.log('-- Cleared room data');
    });
}

exports.getAll = getAll;
exports.save = save;
exports.clear = clear;