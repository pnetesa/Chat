var redis = require('redis');
var redisClient = redis.createClient();
var NAME = 'account';

function get(email, callback) {
    redisClient.hget(NAME, email, callback);
}

function save(email, account, callback) {
    redisClient.hset(NAME, email, JSON.stringify(account), callback);
}

function isExists(email, callback) {
    redisClient.hexists(NAME, email, callback);
}

function clear() {
    redisClient.del(NAME);
}

exports.get = get;
exports.save = save;
exports.isExists = isExists;
exports.clear = clear;