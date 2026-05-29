const mariadb = require('mariadb');
const env = require('./env');
const pool = mariadb.createPool({
	host: env.db.host,
	port: env.db.port,
	user: env.db.user,
	password: env.db.password,
	database: env.db.database,
	connectionLimit: 5,
	charset: 'utf8mb4'
});

/**
 * Pojedyncze zapytanie do bazy
 * @param sql
 * @param params
 * @returns {Promise<any>}
 */
async function query(sql, params = []) {
	let connection;
	try {
		connection = await pool.getConnection();
		return await connection.query(sql, params);
	} finally {
		if (connection) {
			await connection.release();
		}
	}
}

/**
 * Połączenie transakcji do bazy
 * @param callback
 * @returns {Promise<*>}
 */
async function transaction(callback) {
	let connection;
	try {
		connection = await pool.getConnection();
		await connection.beginTransaction();
		const result = await callback(connection);
		await connection.commit();
		return result;
	} catch (error) {
		if (connection) {
			await connection.rollback();
		}
		throw error;
	} finally {
		if (connection) {
			await connection.release();
		}
	}
}

/**
 * Test połączenia z bazą
 * @returns {Promise<boolean>}
 */
async function testConnection() {
	const result = await query('SELECT 1 AS connected');
	return result[0]?.connected === 1;
}

module.exports = {
	pool,
	query,
	transaction,
	testConnection
};