/**
 * Obsługa pośrednia błędów
 * @param error
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function errorMiddleware(error, req, res, next) {
	const statusCode = error.statusCode || 500;
	if (statusCode === 500) {
		console.error(error);
	}
	return res.status(statusCode)
			  .json({
				  success: false,
				  error: error.message || 'Wystąpił błąd serwera.'
			  });
}

module.exports = errorMiddleware;