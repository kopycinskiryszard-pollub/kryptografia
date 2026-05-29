// script.js
const buttons = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');
buttons.forEach(button => {
	button.addEventListener('click', () => {
		// Usunięcie aktywnej klasy z przycisków
		buttons.forEach(btn => {
			btn.classList.remove('active');
		});
		// Ukrycie wszystkich sekcji
		contents.forEach(content => {
			content.classList.remove('active');
		});
		// Aktywacja klikniętego przycisku
		button.classList.add('active');
		// Wyświetlenie odpowiedniej sekcji
		const target = button.getAttribute('data-tab');
		document.getElementById(target).classList.add('active');
	});
});