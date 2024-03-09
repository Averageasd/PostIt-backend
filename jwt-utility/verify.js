function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // split at the space
        const bearer = bearerHeader.split(' ');

        // get token from array
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // forbidden
        res.sendStatus(403)
    }
}

module.exports = verifyToken;