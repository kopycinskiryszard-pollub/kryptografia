const app = document.getElementById('app');
const navButtons = document.querySelectorAll('[data-page]');
const pages = {
	home: '/pages/home.html',
	entropy: '/pages/entropy.html',
	crc: '/pages/crc.html',
	permutations: '/pages/permutations.html',
	ciphers: '/pages/ciphers.html',
	rot13: '/pages/rot13.html',
	login: '/pages/login.html',
	register: '/pages/register.html',
	profile: '/pages/profile.html',
	morse: '/pages/morse.html',
};
const pageInitializers = {
	entropy: () => window.initEntropyPage?.(),
	crc: () => window.initCrcPage?.(),
	permutations: () => window.initPermutationsPage?.(),
	ciphers: () => window.initCryptogramsPage?.(),
	rot13: () => window.initRot13Page?.(),
	morse: () => window.initMorsePage?.(),
	login: () => window.initLoginPage?.(),
	register: () => window.initRegisterPage?.(),
	profile: () => window.initProfilePage()
};

/**
 * Ładowanie podstrony i jej elementów. Wstawienie do <main> na stronie głównej
 * @param pageName
 * @returns {Promise<void>}
 */
async function loadPage(pageName) {
	const normalizedPageName = pages[pageName] ? pageName : 'home';
	const pagePath = pages[normalizedPageName];
	try {
		const response = await fetch(pagePath);
		if (!response.ok) {
			console.error(`Nie udało się załadować strony: ${pagePath}`);
			renderLoadError();
			return;
		}
		app.innerHTML = await response.text();
		setActiveButton(normalizedPageName);
		updateHash(normalizedPageName);
		initializePage(normalizedPageName);
	} catch (error) {
		console.error(error);
		renderLoadError();
	}
}

/**
 * Start inicjalizacji podstrony
 * @param pageName
 */
function initializePage(pageName) {
	const initializer = pageInitializers[pageName];
	if (typeof initializer === 'function') {
		initializer();
	}
}

/**
 * Oznaczanie aktywnej strony w pasku nawigacji
 * @param pageName
 */
function setActiveButton(pageName) {
	navButtons.forEach((button) => {
		button.classList.toggle('active', button.dataset.page === pageName);
	});
	const applicationPages = ['entropy', 'crc', 'permutations', 'ciphers', 'rot13', 'morse'];
	const applicationsButton = document.querySelector('.dropdown-toggle');
	if (applicationsButton) {
		applicationsButton.classList.toggle('active', applicationPages.includes(pageName));
	}
}

/**
 * Formatowanie nazwy podstrony. Usuwa #
 * @param pageName
 */
function updateHash(pageName) {
	const currentHash = window.location.hash.replace('#', '');
	if (currentHash !== pageName) {
		window.location.hash = pageName;
	}
}

/**
 * Wyświetlania błędu ładowania podstrony
 */
function renderLoadError() {
	app.innerHTML = `
		<section class="page-section">
			<h2>Błąd ładowania strony</h2>
			<p>Nie udało się wczytać wybranej strony.</p>
		</section>
	`;
}

/**
 * Ogólna funkcja wyświetlania komunikatów na stronie
 * @param element
 * @param text
 * @param type
 */
function showMessage(element, text, type = 'info') {
	if (!element) {
		return;
	}
	element.innerHTML = text;
	element.className = `message message-${type}`;
}

/**
 * Inicjalizacja zegarka w nagłówku
 */
function initHeaderDateTime() {
	updateHeaderDateTime();
	setInterval(updateHeaderDateTime, 1000);
}

/**
 * Wyświetlanie zegarka
 */
function updateHeaderDateTime() {
	const dateElement = document.getElementById('current-date');
	const timeElement = document.getElementById('current-time');
	if (!dateElement || !timeElement) {
		return;
	}
	const now = new Date();
	const day = String(now.getDate())
	.padStart(2, '0');
	const month = String(now.getMonth() + 1)
	.padStart(2, '0');
	const year = String(now.getFullYear());
	const hours = String(now.getHours())
	.padStart(2, '0');
	const minutes = String(now.getMinutes())
	.padStart(2, '0');
	const seconds = String(now.getSeconds())
	.padStart(2, '0');
	dateElement.textContent = `${day}-${month}-${year}`;
	timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

navButtons.forEach((button) => {
	button.addEventListener('click', () => {
		void loadPage(button.dataset.page);
	});
});
window.addEventListener('DOMContentLoaded', () => {
	initHeaderDateTime();
	const pageFromHash = window.location.hash.replace('#', '');
	void loadPage(pages[pageFromHash] ? pageFromHash : 'home');
});
window.addEventListener('hashchange', () => {
	const pageFromHash = window.location.hash.replace('#', '');
	void loadPage(pages[pageFromHash] ? pageFromHash : 'home');
});