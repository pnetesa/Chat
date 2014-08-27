var db = require('../utils/database');

var schema = new db.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    roomId: {
        type: String,
        required: true,
        default: 'r000000000000000000000000'
    }
});

exports.Room = db.model('Room', schema);