/* Zamiana bajtów na Base64 */
function bytesToBase64(bytes) {
	return btoa(String.fromCharCode(... bytes));
}

/* Konwersja tekstu do bajtów */
function textToBytes(text) {
	return new TextEncoder()
	.encode(text);
}

/* Szyfrowanie AES */
async function encryptAES(text) {
	// Generowanie klucza AES-256
	const aesKey = await crypto.subtle.generateKey({
		name: 'AES-CBC',
		length: 256
	}, true, ['encrypt']);
	// Generowanie IV
	const iv = crypto.getRandomValues(new Uint8Array(16));
	// Konwersja tekstu
	const plainBytes = textToBytes(text);
	// Szyfrowanie
	const encryptedBuffer = await crypto.subtle.encrypt({
		name: 'AES-CBC',
		iv: iv
	}, aesKey, plainBytes);
	// Eksport klucza
	const exportedKey = await crypto.subtle.exportKey('raw', aesKey);
	// Konwersje do Base64
	const cipherText = bytesToBase64(new Uint8Array(encryptedBuffer));
	const key = bytesToBase64(new Uint8Array(exportedKey));
	const encodedIV = bytesToBase64(iv);
	// Zwrócenie danych
	return {
		cipherText: cipherText,
		key: key,
		iv: encodedIV
	};
}