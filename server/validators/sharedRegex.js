const authRegex = {
	username: /^[a-zA-Z0-9_]{3,50}$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/
};
module.exports = authRegex;