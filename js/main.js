// Set the current year in the footer
function setYear() {
	const yearElement = document.getElementById('year');
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear();
	}
}

// Theme functionality
function initTheme() {
	const savedTheme = localStorage.getItem('theme') || 'light';
	document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
	setYear();
	initTheme();
});