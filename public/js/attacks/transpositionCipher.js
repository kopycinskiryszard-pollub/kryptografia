// Generowanie permutacji w permutacje.js
function encryptTransposition(text, blockSize, permutation) {
	const paddingChar = ' ';
	let result = '';
	// Iteracja po blokach
	for (let i = 0; i < text.length; i += blockSize) {
		let block = text.slice(i, i + blockSize);
		while (block.length < blockSize) {
			block += paddingChar;
		}
		// Tablica wynikowa
		const encryptedBlock = new Array(blockSize);
		// Przestawienie znaków zgodnie z permutacją
		for (let j = 0; j < blockSize; j++) {
			const targetIndex = permutation[j] - 1;
			encryptedBlock[targetIndex] = block[j];
		}
		result += encryptedBlock.join('');
	}
	// Zwrócenie danych
	return result;
}