/**
 * Inicjalizacja strony rejestracji nowego użytkownika
 */
function initRegisterPage() {
	const form = document.getElementById('register-form');
	const message = document.getElementById('register-message');
	if (!form || !message) {
		return;
	}
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const registerData = {
			username: String(formData.get('username') || '')
			.trim(),
			email: String(formData.get('email') || '')
			.trim(),
			password: String(formData.get('password') || '')
		};
		const validationErrors = validateRegisterForm(registerData);
		if (validationErrors.length > 0) {
			showMessage(message, validationErrors.join('<br>'), 'error');
			return;
		}
		try {
			const result = await authApi.register(registerData);
			showMessage(message, result.message || 'Rejestracja zakończona sukcesem.', 'success');
			form.reset();
		} catch (error) {
			const details = error.details?.length ? `<br>${error.details.join('<br>')}` : '';
			showMessage(message, `${error.message}${details}`, 'error');
		}
	});
}