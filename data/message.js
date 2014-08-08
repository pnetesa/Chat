var redis = require('redis');
var redisClient = redis.createClient();

function get(roomId, callback) {
    redisClient.lrange(roomId, 0, 20, callback);
}

function getAll(roomId, callback) {
    redisClient.lrange(roomId, 0, -1, callback);
}

function save(roomId, message) {
    redisClient.lpush(roomId, JSON.stringify(message));
}

exports.get = get;
exports.getAll = getAll;
exports.save = save;
