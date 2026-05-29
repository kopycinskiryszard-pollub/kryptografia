function initLoginPage() {
	const form = document.getElementById('login-form');
	const message = document.getElementById('login-message');
	if (!form || !message) {
		return;
	}
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const loginData = {
			login: String(formData.get('login') || '')
			.trim(),
			password: String(formData.get('password') || '')
		};
		const validationErrors = validateLoginForm(loginData);
		if (validationErrors.length > 0) {
			showMessage(message, validationErrors.join('<br>'), 'error');
			return;
		}
		try {
			const result = await authApi.login(loginData);
			localStorage.setItem('jwtToken', result.token);
			showMessage(message, result.message || 'Logowanie zakończone sukcesem.', 'success');
			form.reset();
		} catch (error) {
			const details = error.details?.length ? `<br>${error.details.join('<br>')}` : '';
			showMessage(message, `${error.message}${details}`, 'error');
		}
	});
}