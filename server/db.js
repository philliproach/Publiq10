const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const USERS_PATH = path.join(__dirname, 'users.json');

async function init() {
  try {
    await fsp.access(USERS_PATH);
  } catch (e) {
    // create file with empty array
    await fsp.writeFile(USERS_PATH, JSON.stringify([] , null, 2), 'utf8');
  }
}

async function readUsers() {
  const raw = await fsp.readFile(USERS_PATH, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeUsers(users) {
  await fsp.writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf8');
}

async function createUser({ username, email, password, avatar = null }) {
  const users = await readUsers();
  if (users.find(u => u.username === username || u.email === email)) {
    const err = new Error('User exists');
    err.code = 'EXISTS';
    throw err;
  }
  const id = users.length ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
  const created_at = new Date().toISOString();
  const user = { id, username, email, password, avatar, created_at };
  users.push(user);
  await writeUsers(users);
  return user;
}

async function getUserByEmail(email) {
  const users = await readUsers();
  return users.find(u => u.email === email) || null;
}

async function getUserById(id) {
  const users = await readUsers();
  return users.find(u => u.id === id) || null;
}

module.exports = { init, createUser, getUserByEmail, getUserById };
