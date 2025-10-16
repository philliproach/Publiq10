// Settings page theme switcher
document.addEventListener('DOMContentLoaded', function() {
	const lightBtn = document.getElementById('light-btn');
	const darkBtn = document.getElementById('dark-btn');
	
	// Get current theme
	const currentTheme = localStorage.getItem('theme') || 'light';
	
	// Set active button
	function updateActiveButton(theme) {
		lightBtn.classList.remove('active');
		darkBtn.classList.remove('active');
		
		if (theme === 'light') {
			lightBtn.classList.add('active');
		} else {
			darkBtn.classList.add('active');
		}
	}
	
	// Initialize active button
	updateActiveButton(currentTheme);
	
	// Add click handlers
	lightBtn.addEventListener('click', function() {
		toggleTheme('light');
		updateActiveButton('light');
	});
	
	darkBtn.addEventListener('click', function() {
		toggleTheme('dark');
		updateActiveButton('dark');
	});
});