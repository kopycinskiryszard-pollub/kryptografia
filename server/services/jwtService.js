const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Wygenerowanie nowego tokenu
 * @param user
 * @returns {*}
 */
function generateToken(user) {
	return jwt.sign({
		userId: user.id,
		username: user.username
	}, env.jwt.secret, {
		expiresIn: env.jwt.expiresIn
	});
}

/**
 * Sprawdzenia czy token jest poprawny
 * @param token
 * @returns {*}
 */
function verifyToken(token) {
	return jwt.verify(token, env.jwt.secret);
}

module.exports = {
	generateToken,
	verifyToken
};