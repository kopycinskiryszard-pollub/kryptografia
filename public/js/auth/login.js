function initLoginPage() {
	const form = document.getElementById('login-form');
	const message = document.getElementById('login-message');
	if (!form || !message) {
		return;
	}
	form.onsubmit = async (event) => {
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
			authSession.save({
				token: result.token,
				user: result.user,
				activityTimeoutMs: result.activityTimeoutMs
			});
			updateAuthNavigation();
			showMessage(message, result.message || 'Logowanie zakończone sukcesem.', 'success');
			form.reset();
			window.location.hash = 'home';
		} catch (error) {
			const details = error.details?.length ? `<br>${error.details.join('<br>')}` : '';
			showMessage(message, `${error.message}${details}`, 'error');
		}
	};
}

let inactivityIntervalId = null;

function logout(reason = 'manual') {
	authSession.clear();
	updateAuthNavigation();
	if (reason === 'inactivity') {
		alert('Sesja wygasła z powodu braku aktywności.');
	}
	window.location.hash = 'home';
}

function updateAuthNavigation() {
	const isLoggedIn = authSession.isLoggedIn();
	document.querySelectorAll('.auth-only')
			.forEach((element) => {
				element.classList.toggle('hidden', !isLoggedIn);
			});
	document.querySelectorAll('.guest-only')
			.forEach((element) => {
				element.classList.toggle('hidden', isLoggedIn);
			});
}

function startInactivityWatcher() {
	if (inactivityIntervalId) {
		clearInterval(inactivityIntervalId);
	}
	const activityEvents = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'];
	activityEvents.forEach((eventName) => {
		document.addEventListener(eventName, () => {
			authSession.touch();
		});
	});
	inactivityIntervalId = setInterval(() => {
		if (authSession.isExpiredByInactivity()) {
			logout('inactivity');
		}
	}, 10000);
}

function initLogoutButton() {
	const logoutButton = document.getElementById('logout-button');
	if (!logoutButton) {
		return;
	}
	logoutButton.onclick = () => {
		logout('manual');
	};
}

window.addEventListener('DOMContentLoaded', () => {
	initLogoutButton();
	updateAuthNavigation();
	startInactivityWatcher();
	const pageFromHash = window.location.hash.replace('#', '');
	void loadPage(pages[pageFromHash] ? pageFromHash : 'home');
});
window.initLoginPage = initLoginPage;