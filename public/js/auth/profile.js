/**
 * Inicjalizacja strony profilu użytkownika
 * @returns {Promise<void>}
 */
async function initProfilePage() {
	const message = document.getElementById('profile-message');
	const profileData = document.getElementById('profile-data');
	const usernameElement = document.getElementById('profile-username');
	const emailElement = document.getElementById('profile-email');
	const createdAtElement = document.getElementById('profile-created-at');
	if (!message || !profileData || !usernameElement || !emailElement || !createdAtElement) {
		return;
	}
	if (!authSession.isLoggedIn()) {
		showMessage(message, 'Musisz się zalogować, aby zobaczyć profil.', 'error');
		profileData.classList.add('hidden');
		return;
	}
	await loadProfileData({
		message,
		profileData,
		usernameElement,
		emailElement,
		createdAtElement
	});
}

/**
 * Ładowanie danych użytkownika
 * @param message
 * @param profileData
 * @param usernameElement
 * @param emailElement
 * @param createdAtElement
 * @returns {Promise<void>}
 */
async function loadProfileData({
	message,
	profileData,
	usernameElement,
	emailElement,
	createdAtElement
}) {
	try {
		const result = await authApi.getProfile();
		const user = result.user;
		usernameElement.textContent = user.username || '-';
		emailElement.textContent = user.email || '-';
		createdAtElement.textContent = formatDateTime(user.createdAt);
		showMessage(message, result.message || 'Dane profilu zostały pobrane.', 'success');
		profileData.classList.remove('hidden');
		authSession.touch();
	} catch (error) {
		profileData.classList.add('hidden');
		if (error.status === 401) {
			authSession.clear();
			updateAuthNavigation?.();
			showMessage(message, 'Sesja wygasła. Zaloguj się ponownie.', 'error');
			return;
		}
		showMessage(message, error.message || 'Nie udało się pobrać profilu.', 'error');
	}
}

/**
 * Formatowanie daty i czasu
 * @param value
 * @returns {string}
 */
function formatDateTime(value) {
	if (!value) {
		return '-';
	}
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return String(value);
	}
	return date.toLocaleString('pl-PL');
}

window.initProfilePage = initProfilePage;