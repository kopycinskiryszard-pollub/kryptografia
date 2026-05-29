require('dotenv')
.config();
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
for (const key of requiredEnv) {
	if (!process.env[key]) {
		throw new Error(`Brak wymaganej zmiennej środowiskowej: ${key}`);
	}
}
const dbPort = Number(process.env.DB_PORT);
const appPort = Number(process.env.PORT || 3000);
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS || 12);
if (!Number.isInteger(dbPort)) {
	throw new Error('DB_PORT musi być liczbą całkowitą.');
}
if (!Number.isInteger(appPort)) {
	throw new Error('PORT musi być liczbą całkowitą.');
}
if (!Number.isInteger(bcryptRounds)) {
	throw new Error('BCRYPT_ROUNDS musi być liczbą całkowitą.');
}
const env = {
	nodeEnv: process.env.NODE_ENV || 'development',
	port: appPort,
	db: {
		host: String(process.env.DB_HOST),
		port: dbPort,
		user: String(process.env.DB_USER),
		password: String(process.env.DB_PASSWORD),
		database: String(process.env.DB_NAME)
	},
	jwt: {
		secret: String(process.env.JWT_SECRET),
		expiresIn: process.env.JWT_EXPIRES_IN || '1h'
	},
	bcrypt: {
		rounds: bcryptRounds
	}
};
module.exports = env;