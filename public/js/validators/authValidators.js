const authRegex = {
	username: /^[a-zA-Z0-9_]{4,20}$/,
	email: /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,251}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/,
	password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@#$%^&*()=+-_?]).{8,72}$/
};

/**
 * Podstawowa walidacja danych z formy rejestracji
 * @param username
 * @param email
 * @param password
 * @returns {*[]}
 */
function validateRegisterForm({
	username,
	email,
	password
}) {
	const errors = [];
	if (!authRegex.username.test(username)) {
		errors.push('Nazwa użytkownika musi mieć 4-20 znaków i może zawierać tylko litery, cyfry oraz znak _.');
	}
	if (!authRegex.email.test(email)) {
		errors.push('Podano nieprawidłowy adres e-mail.');
	}
	if (!authRegex.password.test(password)) {
		errors.push('Hasło musi mieć 8-72 znaki, minimum jedną małą literę, jedną wielką literę, jedną cyfrę i jeden znak specjalny @#$%^&*()=+-_? .');
	}
	return errors;
}

/**
 * Podstawowa walidacja danych z formy rejestracji
 * @param login
 * @param password
 * @returns {*[]}
 */
function validateLoginForm({
	login,
	password
}) {
	const errors = [];
	if (!login) {
		errors.push('Login lub e-mail jest wymagany.');
	}
	if (!password) {
		errors.push('Hasło jest wymagane.');
	}
	return errors;
}