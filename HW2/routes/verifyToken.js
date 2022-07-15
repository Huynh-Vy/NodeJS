const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const token = req.header('jwt');
    if (!token) return res.status(401).send({ 'message': 'Access denied' });

    try {
        const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verifiedUser;
        next();
    } catch (error) {
        return res.status(400).send({
            'message': 'Invalid token',
        });
    }
};
