const jwt = require('jsonwebtoken');

module.exports = async function auth(req, res, next) {
    const token = req.header('jwt');
    if (!token) {
        return res.status(400).json({ message: 'Access denied' });
    }

    try {
        const verifiedUser = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = verifiedUser;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


