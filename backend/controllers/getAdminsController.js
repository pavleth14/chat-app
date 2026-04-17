const User = require('../models/User');

exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('-password -refreshTokens'); // ne šalji osetljive podatke

        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};