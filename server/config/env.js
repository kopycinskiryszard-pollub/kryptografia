require('dotenv')
.config();
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
for (const key of requiredEnv) {
	if (!process.env[key]) {
		throw new Error(`Brak wymaganej zmiennej środowiskowej: ${key}`);
	}
}
const env = {
	nodeEnv: process.env.NODE_ENV || 'development',
	port: Number(process.env.PORT || 3000),
	db: {
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT || 3306),
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN || '1h'
	},
	bcrypt: {
		rounds: Number(process.env.BCRYPT_ROUNDS || 12)
	}
};
module.exports = env;