const app = document.getElementById('app');
const navButtons = document.querySelectorAll('.nav-button');
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

async function loadPage(pageName) {
	const pagePath = pages[pageName] || pages.home;
	try {
		const response = await fetch(pagePath);
		if (!response.ok) {
			throw new Error(`Nie udało się załadować strony: ${pagePath}`);
		}
		const html = await response.text();
		app.innerHTML = html;
		setActiveButton(pageName);
		window.location.hash = pageName;
		initializePage(pageName);
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

function setActiveButton(pageName) {
	navButtons.forEach((button) => {
		const isActive = button.dataset.page === pageName;
		button.classList.toggle('active', isActive);
	});
}

function initializePage(pageName) {
	switch (pageName) {
		case 'login':
			loadScriptOnce('/js/api/authApi.js')
			.then(() => loadScriptOnce('/js/validators/authValidators.js'))
			.then(() => loadScriptOnce('/js/auth/login.js'))
			.then(() => {
				if (typeof initLoginPage === 'function') {
					initLoginPage();
				}
			});
			break;
		case 'register':
			loadScriptOnce('/js/api/authApi.js')
			.then(() => loadScriptOnce('/js/validators/authValidators.js'))
			.then(() => loadScriptOnce('/js/auth/register.js'))
			.then(() => {
				if (typeof initRegisterPage === 'function') {
					initRegisterPage();
				}
			});
			break;
		default:
			break;
	}
}

function loadScriptOnce(src) {
	return new Promise((resolve, reject) => {
		const existingScript = document.querySelector(`script[src="${src}"]`);
		if (existingScript) {
			resolve();
			return;
		}
		const script = document.createElement('script');
		script.src = src;
		script.onload = resolve;
		script.onerror = () => reject(new Error(`Nie udało się załadować skryptu: ${src}`));
		document.body.appendChild(script);
	});
}

navButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const pageName = button.dataset.page;
		loadPage(pageName);
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

function showMessage(element, text, type = 'info') {
	element.innerHTML = text;
	element.className = `message message-${type}`;
}