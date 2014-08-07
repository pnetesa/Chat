var redis = require('redis');
var redisClient = redis.createClient();

function get(roomId, callback) {
    redisClient.lrange(roomId, 0, -1, callback);
}

function save(roomId, message) {
    redisClient.lpush(roomId, JSON.stringify(message));
    redisClient.ltrim(roomId, 0, 20);
}

exports.get = get;
exports.save = save;
