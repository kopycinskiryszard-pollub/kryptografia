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
const pageScripts = {
	entropy: ['/js-lab/entropy/entropy.js'],
	crc: ['/js-lab/crc/crc.js'],
	permutations: ['/js-lab/permutations/permutacje.js'],
	ciphers: ['/js-lab/attacks/cezarCipher.js', '/js-lab/attacks/transpositionCipher.js', '/js-lab/attacks/aesCipher.js', '/js-lab/attacks/rsaCipher.js',
			  '/js-lab/attacks/cryptograms.js'],
	rot13: ['/js-lab/rot13/rot13.js']
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
		updateHash(pageName);
		await initializePage(pageName);
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

function updateHash(pageName) {
	if (window.location.hash.replace('#', '') !== pageName) {
		window.location.hash = pageName;
	}
}

async function initializePage(pageName) {
	const pageRoot = app.querySelector('[data-scripts]');
	if (pageRoot) {
		const scripts = pageRoot.dataset.scripts
								.split(',')
								.map((script) => script.trim())
								.filter(Boolean);
		for (const script of scripts) {
			await loadScriptOnce(script);
		}
		const initFunctionName = pageRoot.dataset.init;
		if (initFunctionName && typeof window[initFunctionName] === 'function') {
			window[initFunctionName]();
		}
	}
	switch (pageName) {
		case 'login':
			await loadScriptOnce('/js/api/authApi.js');
			await loadScriptOnce('/js/validators/authValidators.js');
			await loadScriptOnce('/js/auth/login.js');
			if (typeof initLoginPage === 'function') {
				initLoginPage();
			}
			break;
		case 'register':
			await loadScriptOnce('/js/api/authApi.js');
			await loadScriptOnce('/js/validators/authValidators.js');
			await loadScriptOnce('/js/auth/register.js');
			if (typeof initRegisterPage === 'function') {
				initRegisterPage();
			}
			break;
		default:
			break;
	}
}

function loadScriptOnce(src) {
	return new Promise((resolve, reject) => {
		const existingScript = document.querySelector(`script[src="${src}"]`);
		if (existingScript) {
			if (existingScript.dataset.loaded === 'true') {
				resolve();
				return;
			}
			existingScript.addEventListener('load', resolve, {once: true});
			existingScript.addEventListener('error', reject, {once: true});
			return;
		}
		const script = document.createElement('script');
		script.src = src;
		script.onload = () => {
			script.dataset.loaded = 'true';
			resolve();
		};
		script.onerror = () => {
			reject(new Error(`Nie udało się załadować skryptu: ${src}`));
		};
		document.body.appendChild(script);
	});
}

async function runPageScripts(pageName) {
	const scripts = pageScripts[pageName] || [];
	if (scripts.length === 0) {
		return;
	}
	const sourceCodes = [];
	for (const scriptPath of scripts) {
		const response = await fetch(scriptPath);
		if (!response.ok) {
			throw new Error(`Nie udało się załadować skryptu: ${scriptPath}`);
		}
		sourceCodes.push(await response.text());
	}
	const pageCode = sourceCodes.join('\n\n');
	/*
	 Skrypty laboratoryjne są wykonywane po wstawieniu HTML do <main>.
	 Kod uruchamiamy w lokalnym zakresie funkcji, żeby uniknąć konfliktów
	 ponownej deklaracji const przy powrocie na tę samą podstronę.
	 */
	const executePageCode = new Function(pageCode);
	executePageCode();
}

function showMessage(element, text, type = 'info') {
	element.innerHTML = text;
	element.className = `message message-${type}`;
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