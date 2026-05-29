function calculateHartleyEntropy(symbolCount) {
	if (symbolCount <= 1) {
		return 0;
	}
	return Math.log2(symbolCount);
}

function calculateShannonEntropy(text) {
	if (text.length === 0) {
		return 0;
	}
	const frequencies = {};
	for (const char of text) {
		frequencies[char] =
			(
				frequencies[char] || 0
			) + 1;
	}
	let entropy = 0;
	for (const char in frequencies) {
		const probability = frequencies[char] / text.length;
		entropy -= probability * Math.log2(probability);
	}
	return entropy;
}

function initEntropyPage() {
	const entropyText = document.getElementById('entropy-text');
	const entropyCalculateButton = document.getElementById('entropy-calculate');
	const entropyLength = document.getElementById('entropy-length');
	const entropySymbols = document.getElementById('entropy-symbols');
	const entropyHartley = document.getElementById('entropy-hartley');
	const entropyShannon = document.getElementById('entropy-shannon');
	if (!entropyText || !entropyCalculateButton || !entropyLength || !entropySymbols || !entropyHartley || !entropyShannon) {
		return;
	}
	entropyCalculateButton.onclick = () => {
		const text = entropyText.value;
		const uniqueSymbols = new Set(text);
		const hartley = calculateHartleyEntropy(uniqueSymbols.size);
		const shannon = calculateShannonEntropy(text);
		entropyLength.textContent = text.length;
		entropySymbols.textContent = uniqueSymbols.size.toString();
		entropyHartley.textContent = `${hartley.toFixed(4)} bit/znak`;
		entropyShannon.textContent = `${shannon.toFixed(4)} bit/znak`;
	};
}