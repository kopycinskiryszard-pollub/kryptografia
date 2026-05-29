const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
	validateRegisterInput,
	validateLoginInput
} = require('../validators/authValidators');
const router = express.Router();
router.post('/register', validateRequest(validateRegisterInput), authController.register);
router.post('/login', validateRequest(validateLoginInput), authController.login);
router.get('/profile', authMiddleware, authController.profile);
module.exports = router;