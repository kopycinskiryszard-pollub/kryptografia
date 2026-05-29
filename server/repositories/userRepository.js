const database = require('../config/database');
/**
 * @typedef {object} AuthUser
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {boolean|number} isActive
 * @property {string} passwordHash
 * @property {string} hashAlgorithm
 */

/**
 * @typedef {object} PublicUser
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {Date|string} createdAt
 * @property {boolean|number} isActive
 */
/**
 * Szuka użytkownika po nazwie użytkownika albo adresie e-mail.
 *
 * @param {string} login
 * @returns {Promise<AuthUser|null>}
 */
async function findByUsernameOrEmail(login) {
	const rows = await database.query(`
        SELECT u.id,
               u.username,
               u.email,
               u.is_active,
               c.password_hash,
               c.hash_algorithm
        FROM users u
                 INNER JOIN credentials c ON c.user_id = u.id
        WHERE u.username = ?
           OR u.email = ?
        LIMIT 1
	`, [login, login]);
	return rows[0] || null;
}

/**
 * Pobiera publiczne dane użytkownika po identyfikatorze.
 *
 * @param {number} userId
 * @returns {Promise<PublicUser|null>}
 */
async function findPublicById(userId) {
	const rows = await database.query(`
        SELECT id,
               username,
               email,
               created_at AS createdAt,
               is_active  AS isActive
        FROM users
        WHERE id = ?
        LIMIT 1
	`, [userId]);
	return rows[0] || null;
}

/**
 * Sprawdza, czy istnieje użytkownik o podanej nazwie lub adresie e-mail.
 *
 * @param {string} username
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function existsByUsernameOrEmail(username, email) {
	const rows = await database.query(`
        SELECT id
        FROM users
        WHERE username = ?
           OR email = ?
        LIMIT 1
	`, [username, email]);
	return rows.length > 0;
}

/**
 * Tworzy użytkownika i powiązane dane uwierzytelniające.
 *
 * @param {object} userData
 * @param {string} userData.username
 * @param {string} userData.email
 * @param {string} userData.passwordHash
 * @returns {Promise<{id: number, username: string, email: string}>}
 */
async function createUserWithCredentials({
	username,
	email,
	passwordHash
}) {
	return database.transaction(async (connection) => {
		const userResult = await connection.query(`
            INSERT INTO users (username, email, is_active)
            VALUES (?, ?, 1)
		`, [username, email]);
		const userId = Number(userResult.insertId);
		await connection.query(`
            INSERT INTO credentials (user_id, password_hash, hash_algorithm)
            VALUES (?, ?, ?)
		`, [userId, passwordHash, 'bcrypt']);
		return {
			id: userId,
			username,
			email
		};
	});
}

module.exports = {
	findByUsernameOrEmail,
	findPublicById,
	existsByUsernameOrEmail,
	createUserWithCredentials
};