/* szyfry.js */
/* Teksty jawne */
const LAB5_TEXTS = ['Podstawy kryptografii.', 'Szyfr Cezara jest prostym szyfrem podstawieniowym.',
					'Szyfr przestawieniowy zmienia kolejność znaków w tekście.',
					'AES jest współczesnym symetrycznym algorytmem szyfrowania blokowego.',
					'RSA wykorzystuje parę kluczy: publiczny oraz prywatny.',
					'Entropia Shannona pozwala ocenić losowość danych i szyfrogramów.',
					'Kryptografia chroni poufność integralność oraz autentyczność informacji.',
					'W szyfrach klasycznych często można zauważyć strukturę języka naturalnego.',
					'Bezpieczne zarządzanie kluczami jest równie ważne jak sam algorytm szyfrowania.',
					'Analiza kryptograficzna pozwala sprawdzić odporność szyfrów na różne rodzaje ataków.'];

/* Formatowanie numeru */
function formatNumber(number) {
	return String(number)
	.padStart(2, '0');
}

/* Zapis pojedynczego pliku */
async function saveTextFile(directoryHandle, fileName, content) {
	const fileHandle = await directoryHandle.getFileHandle(fileName, {
		create: true
	});
	const writable = await fileHandle.createWritable();
	await writable.write(content);
	await writable.close();
}

/* Generowanie plików */
async function generateLab5Files() {
	try {
		/* Wybór katalogu */
		const rootDirectory = await window['showDirectoryPicker']();
		/* Tworzenie katalogu ataki */
		const atakiDirectory = await rootDirectory.getDirectoryHandle('ataki', {
			create: true
		});
		/* Tabela entropii */
		const entropyRows = [];
		entropyRows.push('Lp.;Typ;Tekst;Entropia');
		/* Iteracja po tekstach */
		for (let i = 0; i < LAB5_TEXTS.length; i++) {
			const number = formatNumber(i + 1);
			const plainText = LAB5_TEXTS[i];
			/* Parametry */
			const caesarKeyValue = 3;
			const transpositionBlockSize = 10;
			const permutation = generatePermutation(transpositionBlockSize);
			/* Szyfr Cezara */
			const caesarCipher = encryptCaesar(plainText, caesarKeyValue);
			/* Szyfr przestawieniowy */
			const transpositionCipher = encryptTransposition(plainText, transpositionBlockSize, permutation);
			/* AES */
			const aesData = await encryptAES(plainText);
			/* RSA */
			let rsaData;
			try {
				rsaData = await encryptRSA(plainText);
			} catch (error) {
				rsaData = {
					cipherText: 'Błąd RSA: tekst zbyt długi.',
					publicKey: '-',
					privateKey: '-'
				};
			}
			/* Lista plików */
			const files = [{
				type: 'jawny',
				name: `tekst_${number}_jawny.txt`,
				content: plainText
			}, {
				type: 'cezar',
				name: `tekst_${number}_cezar.txt`,
				content: caesarCipher
			}, {
				type: 'przestawieniowy',
				name: `tekst_${number}_przestawieniowy.txt`,
				content: transpositionCipher
			}, {
				type: 'aes',
				name: `tekst_${number}_aes.txt`,
				content: aesData.cipherText
			}, {
				type: 'rsa',
				name: `tekst_${number}_rsa.txt`,
				content: rsaData.cipherText
			}];
			/* Zapisywanie plików */
			for (const file of files) {
				await saveTextFile(atakiDirectory, file.name, file.content);
				const entropy = calculateShannonEntropy(file.content);
				entropyRows.push([i + 1, file.type, file.content, entropy.toFixed(4)].join(';'));
			}
		}
		/* Zapis entropii */
		await saveTextFile(atakiDirectory, 'entropie.txt', entropyRows.join('\n'));
		/* Komunikat */
		alert('Wygenerowano pliki w katalogu ataki.');
	} catch (error) {
		console.error(error);
		alert('Nie udało się wygenerować plików: ' + error.message);
	}
}

/* Podpięcie przycisku */
const generateLab5FilesButton = document.getElementById('generate-files-for-ataki-lab');
if (generateLab5FilesButton) {
	generateLab5FilesButton
	.addEventListener('click', generateLab5Files);
}