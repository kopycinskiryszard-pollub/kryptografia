const authApi = {
	async register({
		username,
		email,
		password
	}) {
		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				email,
				password
			})
		});
		return parseJsonResponse(response);
	},
	async login({
		login,
		password
	}) {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				login,
				password
			})
		});
		return parseJsonResponse(response);
	},
	async getProfile() {
		const token = localStorage.getItem('jwtToken');
		const response = await fetch('/api/auth/profile', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return parseJsonResponse(response);
	}
};

async function parseJsonResponse(response) {
	const data = await response.json()
							   .catch(() => (
								   {}
							   ));
	if (!response.ok) {
		const error = new Error(data.error || 'Wystąpił błąd żądania.');
		error.status = response.status;
		error.details = data.errors || [];
		throw error;
	}
	return data;
}