// this middleware should be after autho
// so it can catch req.user sent by autho

// role-based authorization
module.exports = function (req, res, next) {
    // error 403 -> Forbidden (token correct but no permission)
    if (!req.user.isAdmin) {
        console.log(req.user);
        return res.status(403).send('Access denied'); // terminate if no permission
    }
    next();
}