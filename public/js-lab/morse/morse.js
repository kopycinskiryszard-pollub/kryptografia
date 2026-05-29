const MORSE_DICTIONARY = {
	A: '.-',
	B: '-...',
	C: '-.-.',
	D: '-..',
	E: '.',
	F: '..-.',
	G: '--.',
	H: '....',
	I: '..',
	J: '.---',
	K: '-.-',
	L: '.-..',
	M: '--',
	N: '-.',
	O: '---',
	P: '.--.',
	Q: '--.-',
	R: '.-.',
	S: '...',
	T: '-',
	U: '..-',
	V: '...-',
	W: '.--',
	X: '-..-',
	Y: '-.--',
	Z: '--..',
	1: '.----',
	2: '..---',
	3: '...--',
	4: '....-',
	5: '.....',
	6: '-....',
	7: '--...',
	8: '---..',
	9: '----.',
	0: '-----',
	',': '--..--',
	'.': '.-.-.-',
	'?': '..--..',
	'/': '-..-.',
	'-': '-....-',
	'(': '-.--.',
	')': '-.--.-',
	' ': '/',
	Ą: '.-.-',
	Ć: '-.-..',
	Ę: '..-..',
	Ł: '.-..-',
	Ń: '--.--',
	Ó: '---.',
	Ś: '...-...',
	Ź: '--..-',
	Ż: '--..-.'
};
const MORSE_REVERSE_DICTIONARY = createReverseDictionary(MORSE_DICTIONARY);
const MORSE_ALLOWED_ENCRYPT_REGEX = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9,.?/()\- \s]*$/;
const MORSE_ALLOWED_DECRYPT_REGEX = /^[.\-/\s]*$/;

/**
 * Tworzy odwrócony słownik kodu Morse'a.
 * Funkcja jest wywoływana tylko raz, poza decryptMorse(), aby nie generować
 * słownika przy każdym deszyfrowaniu.
 *
 * @param {Record<string, string>} dictionary
 * @returns {Record<string, string>}
 */
function createReverseDictionary(dictionary) {
	const reversedDictionary = {};
	for (const character in dictionary) {
		reversedDictionary[dictionary[character]] = character;
	}
	return reversedDictionary;
}

/**
 * Szyfruje tekst na kod Morse'a.
 * Litery są zamieniane na wielkie znaki. Spacja w tekście jawnym jest
 * reprezentowana jako ukośnik.
 *
 * @param {string} text
 * @returns {string}
 */
function encryptMorse(text) {
	const result = [];
	for (const character of text.toUpperCase()) {
		const morseCode = MORSE_DICTIONARY[character];
		if (morseCode) {
			result.push(morseCode);
		}
	}
	return result.join(' ');
}

/**
 * Deszyfruje kod Morse'a na tekst jawny.
 * Słowa są rozdzielane ukośnikiem. Odwrócony słownik jest używany z pamięci,
 * a nie tworzony ponownie w tej funkcji.
 *
 * @param {string} morseText
 * @returns {string}
 */
function decryptMorse(morseText) {
	return morseText
	.trim()
	.split(/\s+/)
	.map((morseToken) => MORSE_REVERSE_DICTIONARY[morseToken] || '�')
	.join('')
	.replace(/\s+/g, ' ')
	.trim();
}

/**
 * Inicjalizuje stronę kodu Morse'a.
 *
 * @returns {void}
 */
function initMorsePage() {
	initMorseEncryptSection();
	initMorseDecryptSection();
}

/**
 * Inicjalizuje sekcję szyfrowania tekstu na kod Morse'a.
 *
 * @returns {void}
 */
function initMorseEncryptSection() {
	const input = document.getElementById('morse-encrypt-text');
	const encryptButton = document.getElementById('morse-encrypt-button');
	const clearButton = document.getElementById('morse-encrypt-clear');
	const result = document.getElementById('morse-encrypt-result');
	const message = document.getElementById('morse-encrypt-message');
	if (!input || !encryptButton || !clearButton || !result || !message) {
		return;
	}
	input.oninput = () => {
		validateMorseEncryptInput(input, message);
	};
	encryptButton.onclick = () => {
		const validationResult = validateMorseEncryptInput(input, message);
		if (!validationResult) {
			result.textContent = '-';
			return;
		}
		const encryptedText = encryptMorse(input.value);
		result.textContent = encryptedText || '-';
		showMorseMessage(message, 'Tekst został zaszyfrowany.', 'success');
	};
	clearButton.onclick = () => {
		input.value = '';
		result.textContent = '-';
		showMorseMessage(message, 'Wyczyszczono sekcję szyfrowania.', 'info');
	};
}

/**
 * Inicjalizuje sekcję deszyfrowania kodu Morse'a.
 *
 * @returns {void}
 */
function initMorseDecryptSection() {
	const input = document.getElementById('morse-decrypt-text');
	const decryptButton = document.getElementById('morse-decrypt-button');
	const clearButton = document.getElementById('morse-decrypt-clear');
	const result = document.getElementById('morse-decrypt-result');
	const message = document.getElementById('morse-decrypt-message');
	if (!input || !decryptButton || !clearButton || !result || !message) {
		return;
	}
	input.oninput = () => {
		validateMorseDecryptInput(input, message);
	};
	decryptButton.onclick = () => {
		const validationResult = validateMorseDecryptInput(input, message);
		if (!validationResult) {
			result.textContent = '-';
			return;
		}
		const decryptedText = decryptMorse(input.value);
		result.textContent = decryptedText || '-';
		showMorseMessage(message, 'Kod Morse\'a został odszyfrowany.', 'success');
	};
	clearButton.onclick = () => {
		input.value = '';
		result.textContent = '-';
		showMorseMessage(message, 'Wyczyszczono sekcję deszyfrowania.', 'info');
	};
}

/**
 * Waliduje tekst wejściowy do szyfrowania.
 *
 * @param {HTMLTextAreaElement} input
 * @param {HTMLElement} message
 * @returns {boolean}
 */
function validateMorseEncryptInput(input, message) {
	const value = input.value;
	if (!MORSE_ALLOWED_ENCRYPT_REGEX.test(value)) {
		showMorseMessage(message, 'Tekst zawiera znak, którego nie ma w słowniku Morse\'a.', 'error');
		input.value = removeInvalidEncryptCharacters(value);
		return false;
	}
	showMorseMessage(message, 'Tekst zawiera wyłącznie dozwolone znaki.', 'info');
	return true;
}

/**
 * Waliduje kod wejściowy do deszyfrowania.
 *
 * @param {HTMLTextAreaElement} input
 * @param {HTMLElement} message
 * @returns {boolean}
 */
function validateMorseDecryptInput(input, message) {
	const value = input.value;
	if (!MORSE_ALLOWED_DECRYPT_REGEX.test(value)) {
		showMorseMessage(message, 'Kod Morse\'a może zawierać tylko kropki, myślniki, ukośniki i spacje.', 'error');
		input.value = removeInvalidDecryptCharacters(value);
		return false;
	}
	showMorseMessage(message, 'Kod Morse\'a zawiera wyłącznie dozwolone znaki.', 'info');
	return true;
}

/**
 * Usuwa z tekstu jawnego znaki niedozwolone dla szyfrowania Morse'a.
 *
 * @param {string} value
 * @returns {string}
 */
function removeInvalidEncryptCharacters(value) {
	return Array
	.from(value)
	.filter((character) => MORSE_ALLOWED_ENCRYPT_REGEX.test(character))
	.join('');
}

/**
 * Usuwa z tekstu Morse'a znaki niedozwolone dla deszyfrowania.
 *
 * @param {string} value
 * @returns {string}
 */
function removeInvalidDecryptCharacters(value) {
	return Array
	.from(value)
	.filter((character) => MORSE_ALLOWED_DECRYPT_REGEX.test(character))
	.join('');
}

/**
 * Wyświetla komunikat w sekcji Morse'a.
 *
 * @param {HTMLElement} element
 * @param {string} message
 * @param {'info'|'success'|'error'} type
 * @returns {void}
 */
function showMorseMessage(element, message, type = 'info') {
	element.textContent = message;
	element.className = `message message-${type}`;
}

window.initMorsePage = initMorsePage;