const authRegex = {
	username: /^[a-zA-Z0-9_]{3,50}$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/
};

function validateRegisterForm({
	username,
	email,
	password
}) {
	const errors = [];
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