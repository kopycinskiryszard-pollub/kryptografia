const jwtService = require('../services/jwtService');

function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401)
				  .json({
					  success: false,
					  error: 'Brak nagłówka Authorization.'
				  });
	}
	const [scheme, token] = authHeader.split(' ');
	if (scheme !== 'Bearer' || !token) {
		return res.status(401)
				  .json({
					  success: false,
					  error: 'Nieprawidłowy format nagłówka Authorization. Oczekiwano: Bearer <token>.'
				  });
	}
	try {
		req.user = jwtService.verifyToken(token);
		next();
	} catch (error) {
		return res.status(401)
				  .json({
					  success: false,
					  error: 'Token JWT jest nieprawidłowy albo wygasł.'
				  });
	}
}

module.exports = authMiddleware;