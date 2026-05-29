const authRegex = require('./sharedRegex');

/**
 * Walidacja rejestracji
 * @param data
 * @returns {string[]|*[]}
 */
function validateRegisterData(data) {
	const errors = [];
	if (!data || typeof data !== 'object') {
		return ['Nieprawidłowe dane wejściowe.'];
	}
	const username = String(data.username || '')
	.trim();
	const email = String(data.email || '')
	.trim();
	const password = String(data.password || '');
	if (!authRegex.username.test(username)) {
		errors.push('Nazwa użytkownika musi mieć 3-50 znaków i może zawierać tylko litery, cyfry oraz znak _.');
	}
	if (!authRegex.email.test(email)) {
		errors.push('Podano nieprawidłowy adres e-mail.');
	}
	if (!authRegex.password.test(password)) {
		errors.push('Hasło musi mieć 8-72 znaki, minimum jedną małą literę, jedną wielką literę i jedną cyfrę.');
	}
	return errors;
}

/**
 * Walidacja logowania
 * @param data
 * @returns {string[]|*[]}
 */
function validateLoginData(data) {
	const errors = [];
	if (!data || typeof data !== 'object') {
		return ['Nieprawidłowe dane wejściowe.'];
	}
	const login = String(data.login || data.username || '')
	.trim();
	const password = String(data.password || '');
	if (!login) {
		errors.push('Login, nazwa użytkownika albo e-mail są wymagane.');
	}
	if (!password) {
		errors.push('Hasło jest wymagane.');
	}
	return errors;
}

module.exports = {
	validateRegisterData,
	validateLoginData
};