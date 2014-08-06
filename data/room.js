var redis = require('redis');
var redisClient = redis.createClient();
var NAME = 'room';

function getAll(callback) {
    redisClient.smembers(NAME, email, callback);
}

function save(room, callback) {
    redisClient.sadd(NAME, room, callback);
}

function isExists(room, callback) {
    redisClient.smembers(NAME, room, callback);
}

function clear() {
    redisClient.del(NAME);
}

exports.get = get;
exports.save = save;
exports.isExists = isExists;
exports.clear = clear;