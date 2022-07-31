const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    mongoose.connect(config.get('db'))
        .then(() => winston.info('Connected to MongoDB...'));
}
// 'Could not connect to MongoDB...'