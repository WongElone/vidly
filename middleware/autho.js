// user authorization
const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function (req, res, next) {
    const token = req.header('x-authen-token');
    if (!token) return res.status(401).send('Access denied. No token provided'); // terminate

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next(); // pass to next middleware
    }
    catch (ex) {
        res.status(400).send('Invalid token.'); // terminate
    }
}