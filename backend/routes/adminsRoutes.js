const express = require('express');
const router = express.Router();
const { getAdmins } = require('../controllers/getAdminsController');

router.get('/getAdmins', getAdmins);    

module.exports = router;