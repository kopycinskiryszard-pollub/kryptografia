function initCryptogramsPage() {
	const cryptoPlainText = document.getElementById('crypto-plain-text');
	const caesarKey = document.getElementById('caesar-key');
	const transpositionSize = document.getElementById('transposition-size');
	const generateCiphersButton = document.getElementById('generate-ciphers');
	const caesarResult = document.getElementById('caesar-result');
	const transpositionPermutation = document.getElementById('transposition-permutation');
	const transpositionResult = document.getElementById('transposition-result');
	const aesResult = document.getElementById('aes-result');
	const aesKeyResult = document.getElementById('aes-key-result');
	const aesIvResult = document.getElementById('aes-iv-result');
	const rsaResult = document.getElementById('rsa-result');
	const rsaPublicResult = document.getElementById('rsa-public-result');
	const rsaPrivateResult = document.getElementById('rsa-private-result');
	if (!cryptoPlainText || !caesarKey || !transpositionSize || !generateCiphersButton || !caesarResult || !transpositionPermutation || !transpositionResult
		|| !aesResult || !aesKeyResult || !aesIvResult || !rsaResult || !rsaPublicResult || !rsaPrivateResult) {
		return;
	}
	generateCiphersButton.onclick = async () => {
		const text = cryptoPlainText.value;
		const caesarShift = Number(caesarKey.value);
		const blockSize = Number(transpositionSize.value);
		if (text.length === 0) {
			alert('Podaj tekst jawny.');
			return;
		}
		if (blockSize < 2) {
			alert('Długość bloku musi być większa od 1.');
			return;
		}
		caesarResult.textContent = encryptCaesar(text, caesarShift);
		const permutation = generatePermutation(blockSize);
		transpositionPermutation.textContent = permutation.join(' ');
		transpositionResult.textContent = encryptTransposition(text, blockSize, permutation);
		aesResult.textContent = 'Generowanie...';
		aesKeyResult.textContent = 'Generowanie...';
		aesIvResult.textContent = 'Generowanie...';
		const aesData = await encryptAES(text);
		aesResult.textContent = aesData.cipherText;
		aesKeyResult.textContent = aesData.key;
		aesIvResult.textContent = aesData.iv;
		rsaResult.textContent = 'Generowanie...';
		rsaPublicResult.textContent = 'Generowanie...';
		rsaPrivateResult.textContent = 'Generowanie...';
		try {
			const rsaData = await encryptRSA(text);
			rsaResult.textContent = rsaData.cipherText;
			rsaPublicResult.textContent = rsaData.publicKey;
			rsaPrivateResult.textContent = rsaData.privateKey;
		} catch (error) {
			rsaResult.textContent = 'Błąd RSA: tekst jest zbyt długi.';
			rsaPublicResult.textContent = '-';
			rsaPrivateResult.textContent = '-';
		}
	};
}