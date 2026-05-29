/**
 * Dane zalogowanego
 * @type {{token: string, user: string, lastActivityAt: string, activityTimeoutMs: string}}
 */
const authStorageKeys = {
	token: 'jwtToken',
	user: 'authUser',
	lastActivityAt: 'authLastActivityAt',
	activityTimeoutMs: 'authActivityTimeoutMs'
};
/**
 * Obsługa zadań autoryzacji
 * @type {{register({username: *, email: *, password: *}): Promise<any>, login({login: *, password: *}): Promise<any>, getProfile(): Promise<any>}}
 */
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
		const token = authSession.getToken();
		const response = await fetch('/api/auth/profile', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return parseJsonResponse(response);
	}
};
/**
 * Obsługa sesji zalogowanego użytkownika
 * @type {{save({token: *, user: *, activityTimeoutMs: *}): void, clear(): void, getToken(): string, getUser(): (null|any|undefined), isLoggedIn(): boolean, touch(): void, isExpiredByInactivity(): boolean}}
 */
const authSession = {
	save({
		token,
		user,
		activityTimeoutMs
	}) {
		localStorage.setItem(authStorageKeys.token, token);
		localStorage.setItem(authStorageKeys.user, JSON.stringify(user));
		localStorage.setItem(authStorageKeys.activityTimeoutMs, String(activityTimeoutMs || 900000));
		this.touch();
	},
	clear() {
		localStorage.removeItem(authStorageKeys.token);
		localStorage.removeItem(authStorageKeys.user);
		localStorage.removeItem(authStorageKeys.lastActivityAt);
		localStorage.removeItem(authStorageKeys.activityTimeoutMs);
	},
	getToken() {
		return localStorage.getItem(authStorageKeys.token);
	},
	getUser() {
		const rawUser = localStorage.getItem(authStorageKeys.user);
		if (!rawUser) {
			return null;
		}
		try {
			return JSON.parse(rawUser);
		} catch (error) {
			return null;
		}
	},
	isLoggedIn() {
		return Boolean(this.getToken());
	},
	touch() {
		if (this.isLoggedIn()) {
			localStorage.setItem(authStorageKeys.lastActivityAt, String(Date.now()));
		}
	},
	isExpiredByInactivity() {
		const token = this.getToken();
		if (!token) {
			return false;
		}
		const lastActivityAt = Number(localStorage.getItem(authStorageKeys.lastActivityAt) || 0);
		const activityTimeoutMs = Number(localStorage.getItem(authStorageKeys.activityTimeoutMs) || 900000);
		if (!lastActivityAt) {
			return false;
		}
		return Date.now() - lastActivityAt > activityTimeoutMs;
	}
};

/**
 * Analiza odpowiedzi serwera
 * @param response
 * @returns {Promise<any>}
 */
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