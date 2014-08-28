var config = require('../config');
var mongoose = require('mongoose');

mongoose.connect(config.get('database:uri'));

module.exports = mongoose;