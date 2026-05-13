// authMiddleware.js
const authToken = require('./authToken')
const User = require('../models/User')


exports.isAdmin = async (req, res, next) => {
    try {
        // Authenticate first, then authorize against the database role.
        await authToken(req, res, async () => {
            const user = await User.findById(req.userId);
            if (user && user.isAdmin) {
                next();
            } else {
                res.status(403).json({ message: 'Admin permission required' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
