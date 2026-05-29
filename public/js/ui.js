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
	entropy: 'initEntropyPage',
	crc: 'initCrcPage',
	permutations: 'initPermutationsPage',
	ciphers: 'initCryptogramsPage',
	rot13: 'initRot13Page',
	login: 'initLoginPage',
	register: 'initRegisterPage'
};

async function loadPage(pageName) {
	const normalizedPageName = pages[pageName] ? pageName : 'home';
	const pagePath = pages[normalizedPageName];
	try {
		const response = await fetch(pagePath);
		if (!response.ok) {
			throw new Error(`Nie udało się załadować strony: ${pagePath}`);
		}
		app.innerHTML = await response.text();
		setActiveButton(normalizedPageName);
		updateHash(normalizedPageName);
		initializePage(normalizedPageName);
	} catch (error) {
		console.error(error);
		app.innerHTML = `
			<section class="page-section">
				<h2>Błąd ładowania strony</h2>
				<p>Nie udało się wczytać wybranej podstrony.</p>
			</section>
		`;
	}
}

function initializePage(pageName) {
	const initializerName = pageInitializers[pageName];
	if (!initializerName) {
		return;
	}
	const initializer = window[initializerName];
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

function showMessage(element, text, type = 'info') {
	if (!element) {
		return;
	}
	element.innerHTML = text;
	element.className = `message message-${type}`;
}

navButtons.forEach((button) => {
	button.addEventListener('click', () => {
		loadPage(button.dataset.page);
	});
});
window.addEventListener('DOMContentLoaded', () => {
	const pageFromHash = window.location.hash.replace('#', '');
	loadPage(pages[pageFromHash] ? pageFromHash : 'home');
});
window.addEventListener('hashchange', () => {
	const pageFromHash = window.location.hash.replace('#', '');
	loadPage(pages[pageFromHash] ? pageFromHash : 'home');
});