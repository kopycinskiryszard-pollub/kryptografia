const bcrypt = require('bcrypt');
const env = require('../config/env');

async function hashPassword(password) {
	return bcrypt.hash(password, env.bcrypt.rounds);
}

async function verifyPassword(password, passwordHash) {
	return bcrypt.compare(password, passwordHash);
}

module.exports = {
	hashPassword,
	verifyPassword
};