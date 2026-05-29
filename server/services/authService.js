const userRepository = require('../repositories/userRepository');
const passwordService = require('./passwordService');
const jwtService = require('./jwtService');

/**
 * Rejestracja użytkownika
 * @param username
 * @param email
 * @param password
 * @returns {Promise<{id: number, username: string, email: string}>}
 */
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

/**
 * Logowanie użytkownika
 * @param login
 * @param username
 * @param password
 * @returns {Promise<{token: *, user: {id: number, username: string, email: string}}>}
 */
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
	if (!user.isActive) {
		const error = new Error('Konto użytkownika jest nieaktywne.');
		error.statusCode = 403;
		throw error;
	}
	const passwordIsValid = await passwordService.verifyPassword(password, user.passwordHash);
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

/**
 * Pobieranie danych profilu
 * @param userId
 * @returns {Promise<{id: number, username: string, email: string, createdAt: Date|string}>}
 */
async function getProfile(userId) {
	const user = await userRepository.findPublicById(userId);
	if (!user || !user.isActive) {
		const error = new Error('Użytkownik nie istnieje lub jest nieaktywny.');
		error.statusCode = 404;
		throw error;
	}
	const usernameHash = await passwordService.hashPassword(user.username);
	return {
		id: user.id,
		username: user.username,
		email: user.email,
		createdAt: user.createdAt
	};
}

module.exports = {
	register,
	login,
	getProfile
};