var db = require('../utils/database');
var models = {};

var schema = new db.Schema({
    username: String,
    color: {
        type: String,
        required: true,
        default: '#000000'
    },
    text: String,
    isSystem: {
        type: Boolean,
        default: false
    },
    isFile: {
        type: Boolean,
        default: false
    },
    filename: String,
    filepath: String,
    created: {
        type: Date,
        default: Date.now
    }
});

exports.getModel = function (roomId) {

    if (!models[roomId]) {
        models[roomId] = db.model('Message', schema, roomId);
    }

    return models[roomId];
}
