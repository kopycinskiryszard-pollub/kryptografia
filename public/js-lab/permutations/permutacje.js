/* ELEMENTY DOM */
const permSize = document.getElementById('perm-size');
const permGenerateButton = document.getElementById('perm-generate');
const permResult = document.getElementById('perm-result');
const permInverse = document.getElementById('perm-inverse');

/* FUNKCJE */
function generatePermutation(size) {
	// Generowanie permutacji o podanej liczbie elementów
	const permutation = [];
	for (let i = 1; i <= size; i++) {
		permutation.push(i);
	}
	// Losowanie zamian
	for (let i = permutation.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (
			i + 1
		));
		[permutation[i], permutation[randomIndex]] = [permutation[randomIndex], permutation[i]];
	}
	return permutation;
}

function inversePermutation(permutation) {
	// Wyliczanie permutacji odwrotnej: indeksy kolejnych elementów tablicy wejściowej są wpisywane do nowej tablicy
	// na miejscu odpowiadającym wartości w tabeli wejściowej
	const inverse = new Array(permutation.length);
	for (let i = 0; i < permutation.length; i++) {
		inverse[permutation[i] - 1] = i + 1;
	}
	return inverse;
}

/* OBSŁUGA */
permGenerateButton.addEventListener('click', () => {
	const size = Number(permSize.value);
	if (size < 2) {
		alert('Liczba elementów musi być większa od 1.');
		return;
	}
	const permutation = generatePermutation(size);
	const inverse = inversePermutation(permutation);
	permResult.textContent = permutation.join(' ');
	permInverse.textContent = inverse.join(' ');
});