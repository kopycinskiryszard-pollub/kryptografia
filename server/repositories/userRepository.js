const database = require('../config/database');

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

async function findPublicById(userId) {
	const rows = await database.query(`
        SELECT id,
               username,
               email,
               created_at,
               is_active
        FROM users
        WHERE id = ?
        LIMIT 1
	`, [userId]);
	return rows[0] || null;
}

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