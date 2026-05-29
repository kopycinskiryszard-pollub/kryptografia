const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
	validateRegisterData,
	validateLoginData
} = require('../validators/authValidators');
const router = express.Router();
router.post('/register', validateRequest(validateRegisterData), authController.register);
router.post('/login', validateRequest(validateLoginData), authController.login);
router.get('/profile', authMiddleware, authController.profile);
module.exports = router;