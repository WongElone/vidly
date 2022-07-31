const config = require('config');

module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: environment variable jwtPrivateKey is not defined.');
    }
    if (!config.get('db')) {
        throw new Error('FATAL ERROR: enrionment variable db is not defined.');
    }
}