/**
 *
 * @param text
 * @returns {string}
 */
function rot13(text) {
	let result = '';
	for (const char of text) {
		const code = char.charCodeAt(0);
		if (code >= 65 && code <= 90) {
			result +=
				String.fromCharCode((
									code - 65 + 13
									) % 26 + 65);
		} else if (code >= 97 && code <= 122) {
			result +=
				String.fromCharCode((
									code - 97 + 13
									) % 26 + 97);
		} else {
			result += char;
		}
	}
	return result;
}

/**
 *
 */
function initRot13Page() {
	const textInput = document.getElementById('rot13-text');
	const fileInput = document.getElementById('rot13-file');
	const transformButton = document.getElementById('rot13-transform');
	const loadFileButton = document.getElementById('rot13-load-file');
	const downloadButton = document.getElementById('rot13-download-result');
	const copyButton = document.getElementById('rot13-copy-result');
	const clearButton = document.getElementById('rot13-clear');
	const resultElement = document.getElementById('rot13-result');
	const fileInfoElement = document.getElementById('rot13-file-info');
	if (!textInput || !fileInput || !transformButton || !loadFileButton || !downloadButton || !copyButton || !clearButton || !resultElement
		|| !fileInfoElement) {
		return;
	}
	let loadedFileName = 'rot13-result.txt';
	transformButton.onclick = () => {
		const inputText = textInput.value;
		const transformedText = rot13(inputText);
		resultElement.textContent = transformedText || '-';
	};
	loadFileButton.onclick = () => {
		const file = fileInput.files[0];
		if (!file) {
			showRot13FileInfo(fileInfoElement, 'Nie wybrano pliku.', 'error');
			return;
		}
		if (!isTextFile(file)) {
			showRot13FileInfo(fileInfoElement, 'Nieprawidłowy typ pliku. Wybierz plik .txt.', 'error');
			return;
		}
		loadedFileName = createOutputFileName(file.name);
		const reader = new FileReader();
		reader.onload = () => {
			const fileContent = String(reader.result || '');
			const transformedText = rot13(fileContent);
			textInput.value = fileContent;
			resultElement.textContent = transformedText || '-';
			showRot13FileInfo(fileInfoElement, `Wczytano plik: ${file.name}`, 'success');
		};
		reader.onerror = () => {
			showRot13FileInfo(fileInfoElement, 'Nie udało się odczytać pliku.', 'error');
		};
		reader.readAsText(file, 'UTF-8');
	};
	downloadButton.onclick = () => {
		const resultText = resultElement.textContent;
		if (!resultText || resultText === '-') {
			showRot13FileInfo(fileInfoElement, 'Brak wyniku do zapisania.', 'error');
			return;
		}
		downloadTextFile(resultText, loadedFileName);
	};
	copyButton.onclick = async () => {
		const resultText = resultElement.textContent;
		if (!resultText || resultText === '-') {
			showRot13FileInfo(fileInfoElement, 'Brak wyniku do skopiowania.', 'error');
			return;
		}
		try {
			await navigator.clipboard.writeText(resultText);
			showRot13FileInfo(fileInfoElement, 'Wynik skopiowano do schowka.', 'success');
		} catch (error) {
			showRot13FileInfo(fileInfoElement, 'Nie udało się skopiować wyniku.', 'error');
		}
	};
	clearButton.onclick = () => {
		textInput.value = '';
		fileInput.value = '';
		resultElement.textContent = '-';
		loadedFileName = 'rot13-result.txt';
		showRot13FileInfo(fileInfoElement, 'Nie wybrano pliku.', 'info');
	};
}

/**
 *
 * @param file
 * @returns {boolean|boolean}
 */
function isTextFile(file) {
	return file.type === 'text/plain' || file.name.toLowerCase()
											 .endsWith('.txt');
}

/**
 *
 * @param inputFileName
 * @returns {string}
 */
function createOutputFileName(inputFileName) {
	const normalizedName = inputFileName.trim();
	if (!normalizedName) {
		return 'rot13-result.txt';
	}
	return normalizedName.replace(/\.txt$/i, '') + '-rot13.txt';
}

/**
 *
 * @param content
 * @param fileName
 */
function downloadTextFile(content, fileName) {
	const blob = new Blob([content], {
		type: 'text/plain;charset=utf-8'
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	link.click();
	URL.revokeObjectURL(url);
}

function showRot13FileInfo(element, message, type = 'info') {
	element.textContent = message;
	element.className = `message message-${type}`;
}

window.initRot13Page = initRot13Page;