function transformRot(text, shift) {
	const lowercaseAlphabet = 'aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż';
	const uppercaseAlphabet = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ';
	const alphabetLength = lowercaseAlphabet.length;
	const normalizedShift = (
								(
									shift % alphabetLength
								) + alphabetLength
							) % alphabetLength;
	let result = '';
	for (const char of text) {
		let index = lowercaseAlphabet.indexOf(char);
		if (index !== -1) {
			result +=
				lowercaseAlphabet[(
									  index + normalizedShift
								  ) % alphabetLength];
			continue;
		}
		index = uppercaseAlphabet.indexOf(char);
		if (index !== -1) {
			result +=
				uppercaseAlphabet[(
									  index + normalizedShift
								  ) % alphabetLength];
			continue;
		}
		result += char;
	}
	return result;
}

function initRot13Page() {
	const textInput = document.getElementById('rot13-text');
	const shiftInput = document.getElementById('rot13-shift');
	const encryptButton = document.getElementById('rot13-encrypt');
	const decryptButton = document.getElementById('rot13-decrypt');
	const clearButton = document.getElementById('rot13-clear');
	const resultBox = document.getElementById('rot13-result');
	if (!textInput || !shiftInput || !encryptButton || !decryptButton || !clearButton || !resultBox) {
		return;
	}
	encryptButton.onclick = () => {
		const text = textInput.value;
		const shift = Number(shiftInput.value || 13);
		resultBox.textContent = transformRot(text, shift);
	};
	decryptButton.onclick = () => {
		const text = textInput.value;
		const shift = Number(shiftInput.value || 13);
		resultBox.textContent = transformRot(text, -shift);
	};
	clearButton.onclick = () => {
		textInput.value = '';
		resultBox.textContent = '-';
	};
}