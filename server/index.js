const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { init, createUser, getUserByEmail, getUserById } = require('./db');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';

// initialize storage (creates users.json if missing)
init().catch(err => console.error('Failed to initialize storage:', err));

app.use(cors());
app.use(bodyParser.json());

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ username, email, password: hashed, avatar: null });
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    if (err.code === 'EXISTS') return res.status(400).json({ error: 'User already exists' });
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const row = await getUserByEmail(email);
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Me - requires token
app.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const row = await getUserById(payload.id);
    if (!row) return res.status(404).json({ error: 'User not found' });
    // don't include password in response
    const { password, ...rest } = row;
    res.json({ user: rest });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Root route - helpful message for browsers
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Publiq Auth API</title></head>
      <body style="font-family: Arial, Helvetica, sans-serif;line-height:1.6;padding:2rem;">
        <h1>Publiq Auth API</h1>
        <p>The authentication API is running.</p>
        <ul>
          <li>POST /register — register new user (json: username, email, password)</li>
          <li>POST /login — login (json: email, password)</li>
          <li>GET /me — get current user (Authorization: Bearer &lt;token&gt;)</li>
        </ul>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Auth API listening on http://localhost:${PORT}`);
});
