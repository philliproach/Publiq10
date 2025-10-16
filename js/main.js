// Theme functionality
(function() {
	const savedTheme = localStorage.getItem('theme') || 'light';
	document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Set the current year in the footer
function setYear() {
	const yearElement = document.getElementById('year');
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear();
	}
}

function toggleTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
	setYear();
	showHeaderUser();
});

// Show logged-in user in the header (top-right)
function showHeaderUser() {
	const token = localStorage.getItem('auth_token');
	const header = document.getElementById('header');
	if (!header) return;

	// create container on the right if not present
	let userContainer = document.getElementById('header-user');
	if (!userContainer) {
		userContainer = document.createElement('div');
		userContainer.id = 'header-user';
		userContainer.className = 'header-user';
		header.querySelector('.innertube').appendChild(userContainer);
	}

	if (!token) {
		userContainer.innerHTML = `<a href="/login/" class="header-login-link">Login</a>`;
		return;
	}

	const API = window.AUTH_API_BASE || 'http://localhost:4000';
	fetch(`${API}/me`, { headers: { 'Authorization': `Bearer ${token}` } })
		.then(r => r.json())
		.then(data => {
			if (data && data.user) {
				const user = data.user;
				const avatar = user.avatar || '/media/logo.png';
				userContainer.innerHTML = `
					<a href="/user/${user.username}/" class="header-user-link">
						<img src="${avatar}" alt="${user.username}" class="header-user-avatar">
						<span class="header-user-name">${user.username}</span>
					</a>
				`;
			} else {
				userContainer.innerHTML = `<a href="/login/" class="header-login-link">Login</a>`;
			}
		})
		.catch(() => {
			userContainer.innerHTML = `<a href="/login/" class="header-login-link">Login</a>`;
		});
}