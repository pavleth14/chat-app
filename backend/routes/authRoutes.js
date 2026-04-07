// const express = require('express');
// const router = express.Router();
// const { customerLogin, adminLogin, customerRegister, adminRegister } = require('../controllers/authController');

// router.post('/customer-login', customerLogin);
// router.post('/admin-login', adminLogin);
// router.post('/customer-register', customerRegister); 
// router.post('/admin-register', adminRegister);       

// module.exports = router;



const express = require('express');
const router = express.Router();
const { register, login, refresh, logout  } = require('../controllers/authController');
const authMiddleware = require('../middlewere/authMiddlewere');

router.post('/register', register);    
router.post('/login', login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});

module.exports = router;