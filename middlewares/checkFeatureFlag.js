const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkFeatureFlag = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.userId);

        if (user && user.flagEnabled) {
            req.isFlagEnabled = true;
        } else {
            req.isFlagEnabled = false;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};

module.exports = checkFeatureFlag;
