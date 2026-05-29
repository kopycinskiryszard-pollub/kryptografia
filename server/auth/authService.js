const userRepository = require('../repositories/userRepository');
const passwordService = require('./passwordService');
const jwtService = require('./jwtService');

async function register({
	username,
	email,
	password
}) {
	const normalizedUsername = username.trim();
	const normalizedEmail = email.trim()
								 .toLowerCase();
	const userExists = await userRepository.existsByUsernameOrEmail(normalizedUsername, normalizedEmail);
	if (userExists) {
		const error = new Error('Nazwa użytkownika lub e-mail już istnieje.');
		error.statusCode = 409;
		throw error;
	}
	const passwordHash = await passwordService.hashPassword(password);
	const user = await userRepository.createUserWithCredentials({
		username: normalizedUsername,
		email: normalizedEmail,
		passwordHash
	});
	return {
		id: user.id,
		username: user.username,
		email: user.email
	};
}

async function login({
	login,
	username,
	password
}) {
	const providedLogin = String(login || username || '')
	.trim();
	const user = await userRepository.findByUsernameOrEmail(providedLogin);
	if (!user) {
		const error = new Error('Nieprawidłowy login lub hasło.');
		error.statusCode = 401;
		throw error;
	}
	if (!user.is_active) {
		const error = new Error('Konto użytkownika jest nieaktywne.');
		error.statusCode = 403;
		throw error;
	}
	const passwordIsValid = await passwordService.verifyPassword(password, user.password_hash);
	if (!passwordIsValid) {
		const error = new Error('Nieprawidłowy login lub hasło.');
		error.statusCode = 401;
		throw error;
	}
	const token = jwtService.generateToken({
		id: user.id,
		username: user.username
	});
	return {
		token,
		user: {
			id: user.id,
			username: user.username,
			email: user.email
		}
	};
}

async function getProfile(userId) {
	const user = await userRepository.findPublicById(userId);
	if (!user || !user.is_active) {
		const error = new Error('Użytkownik nie istnieje lub jest nieaktywny.');
		error.statusCode = 404;
		throw error;
	}
	return {
		id: user.id,
		username: user.username,
		email: user.email,
		createdAt: user.created_at
	};
}

module.exports = {
	register,
	login,
	getProfile
};