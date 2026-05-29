/* Szyfrowanie RSA */
async function encryptRSA(text) {
	// Generowanie pary kluczy RSA
	const rsaKeys = await crypto.subtle.generateKey({
		name: 'RSA-OAEP',
		modulusLength: 2048,
		publicExponent: new Uint8Array([1, 0, 1]),
		hash: 'SHA-256'
	}, true, ['encrypt', 'decrypt']);
	// Konwersja tekstu
	const plainBytes = textToBytes(text);
	// Szyfrowanie
	const encryptedBuffer = await crypto.subtle.encrypt({
		name: 'RSA-OAEP'
	}, rsaKeys.publicKey, plainBytes);
	// Eksport klucza publicznego
	const publicKeyBuffer = await crypto.subtle.exportKey('spki', rsaKeys.publicKey);
	const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', rsaKeys.privateKey);
	const privateKey = bytesToBase64(new Uint8Array(privateKeyBuffer));
	// Konwersje Base64
	const cipherText = bytesToBase64(new Uint8Array(encryptedBuffer));
	const publicKey = bytesToBase64(new Uint8Array(publicKeyBuffer));
	// Zwrócenie danych
	return {
		cipherText: cipherText,
		publicKey: publicKey,
		privateKey: privateKey
	};
}