// Frontend helper for auth actions
const AUTH_API = window.AUTH_API_BASE;

async function registerUser({ username, email, password }) {
  const res = await fetch(`${AUTH_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return res.json();
}

async function loginUser({ email, password }) {
  const res = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

async function fetchMe(token) {
  const res = await fetch(`${AUTH_API}/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export { registerUser, loginUser, fetchMe };
