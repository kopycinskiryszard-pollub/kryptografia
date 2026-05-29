const authService = require('../services/authService');
const env = require('../config/env');

/**
 * Obsługa żądania rejestracji nowego użytkownika
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function register(req, res, next) {
	try {
		const user = await authService.register(req.body);
		return res.status(201)
				  .json({
					  success: true,
					  message: 'Użytkownik został zarejestrowany.',
					  user
				  });
	} catch (error) {
		next(error);
	}
}

/**
 * Obsługa żądania logowania
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function login(req, res, next) {
	try {
		const result = await authService.login(req.body);
		return res.status(200)
				  .json({
					  success: true,
					  message: 'Logowanie zakończone sukcesem.',
					  token: result.token,
					  activityTimeoutMs: env.auth.activityTimeoutMs,
					  user: result.user
				  });
	} catch (error) {
		next(error);
	}
}

/**
 * Obsługa zapytania o dane profilowe
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function profile(req, res, next) {
	try {
		const user = await authService.getProfile(req.user.userId);
		return res.status(200)
				  .json({
					  success: true,
					  message: 'Dostęp do chronionego zasobu przyznany.',
					  user
				  });
	} catch (error) {
		next(error);
	}
}

module.exports = {
	register,
	login,
	profile
};