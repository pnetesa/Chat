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
    redisClient.smembers(NAME, function (err, records) {
        records.forEach(function (record) {
            var roomId = JSON.parse(record).id;

            redisClient.lrange(roomId, 0, -1, function (err, result) {
                result.forEach(function (message) {
                    redisClient.lrem(roomId, 0, message);
                });
            });

            redisClient.srem(NAME, record);
        });
        console.log('-- Cleared room data');
    });
}

exports.getAll = getAll;
exports.save = save;
exports.clear = clear;