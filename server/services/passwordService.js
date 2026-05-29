const bcrypt = require('bcrypt');
const env = require('../config/env');

/**
 * Hashowanie hasła
 * @param password
 * @returns {Promise<void|*>}
 */
async function hashPassword(password) {
	return bcrypt.hash(password, env.bcrypt.rounds);
}

/**
 * Sprawdzenie, czy hasła są zgodne
 * @param password
 * @param passwordHash
 * @returns {Promise<void|*>}
 */
async function verifyPassword(password, passwordHash) {
	return bcrypt.compare(password, passwordHash);
}

module.exports = {
	hashPassword,
	verifyPassword
};