const express = require('express');
const router = express.Router();
const authRoutes = require('./routes/authRoutes');
const adminsRoutes = require('./routes/adminsRoutes');

router.use('/api', authRoutes, adminsRoutes); // sve auth rute idu pod /api

module.exports = router; // 🚨 exportujemo router, ne app