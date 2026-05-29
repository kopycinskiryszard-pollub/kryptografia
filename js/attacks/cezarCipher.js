function encryptCaesar(text, key) {
	const lowercaseAlphabet = 'aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż';
	const uppercaseAlphabet = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ';
	const alphabetLength = lowercaseAlphabet.length;
	const normalizedKey = ((key % alphabetLength) + alphabetLength) % alphabetLength;
	let result = '';
	for (const char of text) {
		// Małe litery
		let index = lowercaseAlphabet.indexOf(char);
		if (index !== -1) {
			const encryptedIndex = (index + normalizedKey) % alphabetLength;
			result += lowercaseAlphabet[encryptedIndex];
			continue;
		}
		// Wielkie litery
		index = uppercaseAlphabet.indexOf(char);
		if (index !== -1) {
			const encryptedIndex = (index + normalizedKey) % alphabetLength;
			result += uppercaseAlphabet[encryptedIndex];
			continue;
		}
		// Inne znaki
		result += char;
	}
	// Zwrócenie danych
	return result;
}