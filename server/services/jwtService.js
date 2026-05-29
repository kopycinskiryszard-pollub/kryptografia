const jwt = require('jsonwebtoken');
const env = require('../config/env');

function generateToken(user) {
	return jwt.sign({
		userId: user.id,
		username: user.username
	}, env.jwt.secret, {
		expiresIn: env.jwt.expiresIn
	});
}

function verifyToken(token) {
	return jwt.verify(token, env.jwt.secret);
}

module.exports = {
	generateToken,
	verifyToken
};