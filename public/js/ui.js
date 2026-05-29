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
	register: '/pages/register.html'
};
const pageInitializers = {
	entropy: () => window.initEntropyPage?.(),
	crc: () => window.initCrcPage?.(),
	permutations: () => window.initPermutationsPage?.(),
	ciphers: () => window.initCryptogramsPage?.(),
	rot13: () => window.initRot13Page?.(),
	login: () => window.initLoginPage?.(),
	register: () => window.initRegisterPage?.()
};

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

function initializePage(pageName) {
	const initializer = pageInitializers[pageName];
	if (typeof initializer === 'function') {
		initializer();
	}
}

function setActiveButton(pageName) {
	navButtons.forEach((button) => {
		button.classList.toggle('active', button.dataset.page === pageName);
	});
	const applicationPages = ['entropy', 'crc', 'permutations', 'ciphers', 'rot13'];
	const applicationsButton = document.querySelector('.dropdown-toggle');
	if (applicationsButton) {
		applicationsButton.classList.toggle('active', applicationPages.includes(pageName));
	}
}

function updateHash(pageName) {
	const currentHash = window.location.hash.replace('#', '');
	if (currentHash !== pageName) {
		window.location.hash = pageName;
	}
}

function renderLoadError() {
	app.innerHTML = `
		<section class="page-section">
			<h2>Błąd ładowania strony</h2>
			<p>Nie udało się wczytać wybranej podstrony.</p>
		</section>
	`;
}

function showMessage(element, text, type = 'info') {
	if (!element) {
		return;
	}
	element.innerHTML = text;
	element.className = `message message-${type}`;
}

navButtons.forEach((button) => {
	button.addEventListener('click', () => {
		void loadPage(button.dataset.page);
	});
});
window.addEventListener('DOMContentLoaded', () => {
	const pageFromHash = window.location.hash.replace('#', '');
	void loadPage(pages[pageFromHash] ? pageFromHash : 'home');
});
window.addEventListener('hashchange', () => {
	const pageFromHash = window.location.hash.replace('#', '');
	void loadPage(pages[pageFromHash] ? pageFromHash : 'home');
});