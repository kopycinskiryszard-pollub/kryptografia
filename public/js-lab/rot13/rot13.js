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
	initRot13TextSection();
	initRot13FileSection();
}

/**
 *
 */
function initRot13TextSection() {
	const textInput = document.getElementById('rot13-text');
	const transformButton = document.getElementById('rot13-transform');
	const copyButton = document.getElementById('rot13-copy-result');
	const clearButton = document.getElementById('rot13-clear');
	const resultElement = document.getElementById('rot13-result');
	const decodedResultElement = document.getElementById('rot13-decoded-result');
	if (!textInput || !transformButton || !copyButton || !clearButton || !resultElement || !decodedResultElement) {
		return;
	}
	transformButton.onclick = () => {
		transformTextInput({
			textInput,
			resultElement,
			decodedResultElement
		});
	};
	copyButton.onclick = async () => {
		await copyRot13Result(resultElement);
	};
	clearButton.onclick = () => {
		clearTextSection({
			textInput,
			resultElement,
			decodedResultElement
		});
	};
}

/**
 *
 */
function initRot13FileSection() {
	const fileInput = document.getElementById('rot13-file');
	const loadFileButton = document.getElementById('rot13-load-file');
	const downloadButton = document.getElementById('rot13-download-result');
	const fileInfoElement = document.getElementById('rot13-file-info');
	const textInput = document.getElementById('rot13-text');
	const resultElement = document.getElementById('rot13-result');
	const decodedResultElement = document.getElementById('rot13-decoded-result');
	if (!fileInput || !loadFileButton || !downloadButton || !fileInfoElement || !textInput || !resultElement || !decodedResultElement) {
		return;
	}
	let outputFileName = 'rot13-result.txt';
	loadFileButton.onclick = () => {
		handleRot13FileLoad({
			fileInput,
			fileInfoElement,
			textInput,
			resultElement,
			decodedResultElement,
			setOutputFileName: (fileName) => {
				outputFileName = fileName;
			}
		});
	};
	downloadButton.onclick = () => {
		handleRot13FileDownload({
			resultElement,
			fileInfoElement,
			outputFileName
		});
	};
}

/**
 *
 * @param textInput
 * @param resultElement
 * @param decodedResultElement
 */
function transformTextInput({
	textInput,
	resultElement,
	decodedResultElement
}) {
	const inputText = textInput.value;
	const transformedText = rot13(inputText);
	const decodedText = rot13(transformedText);
	resultElement.textContent = transformedText || '-';
	decodedResultElement.textContent = decodedText || '-';
}

/**
 *
 * @param textInput
 * @param resultElement
 * @param decodedResultElement
 */
function clearTextSection({
	textInput,
	resultElement,
	decodedResultElement
}) {
	textInput.value = '';
	resultElement.textContent = '-';
	decodedResultElement.textContent = '-';
}

/**
 *
 * @param resultElement
 * @returns {Promise<void>}
 */
async function copyRot13Result(resultElement) {
	const resultText = resultElement.textContent;
	if (!resultText || resultText === '-') {
		return;
	}
	try {
		await navigator.clipboard.writeText(resultText);
	} catch (error) {
		console.error('Nie udało się skopiować wyniku ROT13.', error);
	}
}

/**
 *
 * @param fileInput
 * @param fileInfoElement
 * @param textInput
 * @param resultElement
 * @param decodedResultElement
 * @param setOutputFileName
 */
function handleRot13FileLoad({
	fileInput,
	fileInfoElement,
	textInput,
	resultElement,
	decodedResultElement,
	setOutputFileName
}) {
	const file = fileInput.files[0];
	if (!file) {
		showRot13FileInfo(fileInfoElement, 'Nie wybrano pliku.', 'error');
		return;
	}
	if (!isTextFile(file)) {
		showRot13FileInfo(fileInfoElement, 'Nieprawidłowy typ pliku. Wybierz plik .txt.', 'error');
		return;
	}
	setOutputFileName(createOutputFileName(file.name));
	const reader = new FileReader();
	reader.onload = () => {
		const fileContent = String(reader.result || '');
		const transformedText = rot13(fileContent);
		const decodedText = rot13(transformedText);
		textInput.value = fileContent;
		resultElement.textContent = transformedText || '-';
		decodedResultElement.textContent = decodedText || '-';
		showRot13FileInfo(fileInfoElement, `Wczytano plik: ${file.name}`, 'success');
	};
	reader.onerror = () => {
		showRot13FileInfo(fileInfoElement, 'Nie udało się odczytać pliku.', 'error');
	};
	reader.readAsText(file, 'UTF-8');
}

/**
 *
 * @param resultElement
 * @param fileInfoElement
 * @param outputFileName
 */
function handleRot13FileDownload({
	resultElement,
	fileInfoElement,
	outputFileName
}) {
	const resultText = resultElement.textContent;
	if (!resultText || resultText === '-') {
		showRot13FileInfo(fileInfoElement, 'Brak wyniku do zapisania.', 'error');
		return;
	}
	downloadTextFile(resultText, outputFileName);
	showRot13FileInfo(fileInfoElement, `Zapisano wynik jako: ${outputFileName}`, 'success');
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

/**
 *
 * @param element
 * @param message
 * @param type
 */
function showRot13FileInfo(element, message, type = 'info') {
	element.textContent = message;
	element.className = `message message-${type}`;
}

window.initRot13Page = initRot13Page;