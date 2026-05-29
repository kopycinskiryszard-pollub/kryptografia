// ELEMENTY DOM
const crcData = document.getElementById('crc-data');
const crcDivisorLength = document.getElementById('crc-divisor-length');
const crcRandomDivisorButton = document.getElementById('crc-random-divisor');
const crcDivisor = document.getElementById('crc-divisor');
const crcChecksum = document.getElementById('crc-checksum');
const crcCalculateButton = document.getElementById('crc-calculate');
const crcVerifyButton = document.getElementById('crc-verify');
const crcExtended = document.getElementById('crc-extended');
const crcResult = document.getElementById('crc-result');
const crcFrame = document.getElementById('crc-frame');
const crcVerification = document.getElementById('crc-verification');

/* FUNKCJE */
function isBinary(value) {
	// Sprawdzenie, czy wartość jest binarna
	return /^[01]+$/.test(value);
}

function calculateCRC(data, divisor, checksum = null) {
	// Obliczenie CRC
	const crcLength = divisor.length - 1;
	const appendedData = checksum === null ? data + '0'.repeat(crcLength) : data + checksum;
	const bits = appendedData.split('');
	for (let i = 0; i <= bits.length - divisor.length; i++) {
		if (bits[i] === '1') {
			for (let j = 0; j < divisor.length; j++) {
				bits[i + j] = bits[i + j] === divisor[j] ? '0' : '1';
			}
		}
	}
	return bits
	.slice(bits.length - crcLength)
	.join('');
}

function generateRandomDivisor(length) {
	// Generowanie losowego dzielnika
	let divisor = '1';
	for (let i = 1; i < length - 1; i++) {
		divisor += Math.random() < 0.5 ? '0' : '1';
	}
	divisor += '1';
	return divisor;
}

/* LOSOWANIE DZIELNIKA */
crcRandomDivisorButton.addEventListener('click', () => {
	const length = Number(crcDivisorLength.value);
	if (length < 2) {
		alert('Długość dzielnika musi być większa od 1.');
		return;
	}
	crcDivisor.value = generateRandomDivisor(length);
});
/* OBLICZANIE CRC */
crcCalculateButton.addEventListener('click', () => {
	const data = crcData.value.trim();
	const divisor = crcDivisor.value.trim();
	if (!isBinary(data) || !isBinary(divisor)) {
		alert('Dane i dzielnik muszą być binarne.');
		return;
	}
	if (divisor.length < 2 || divisor[0] !== '1') {
		alert('Niepoprawny dzielnik.');
		return;
	}
	const crc = calculateCRC(data, divisor);
	const extendedData = data + '0'.repeat(divisor.length - 1);
	const frame = data + crc;
	crcExtended.textContent = extendedData;
	crcResult.textContent = crc;
	crcFrame.textContent = frame;
	crcVerification.textContent = '-';
});
/* WERYFIKACJA CRC */
crcVerifyButton.addEventListener('click', () => {
	const data = crcData.value.trim();
	const divisor = crcDivisor.value.trim();
	const checksum = crcChecksum.value.trim();
	if (!isBinary(data) || !isBinary(divisor) || !isBinary(checksum)) {
		alert('Dane muszą być binarne.');
		return;
	}
	if (checksum.length !== divisor.length - 1) {
		alert('Niepoprawna długość CRC.');
		return;
	}
	const remainder = calculateCRC(data, divisor, checksum);
	const valid = /^0+$/.test(remainder);
	crcExtended.textContent = data + checksum;
	crcResult.textContent = remainder;
	crcFrame.textContent = data + checksum;
	crcVerification.textContent = valid ? 'Transmisja poprawna' : 'Wykryto błąd';
});