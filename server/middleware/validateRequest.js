function validateRequest(validator) {
	return (req, res, next) => {
		const errors = validator(req.body);
		if (errors.length > 0) {
			return res.status(400)
					  .json({
						  success: false,
						  errors
					  });
		}
		next();
	};
}

module.exports = validateRequest;