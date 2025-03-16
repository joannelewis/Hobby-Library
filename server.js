const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { User } = require('./models/user'); // Changed to CommonJS require

// Database setup
const database = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Failed to connect to the database:', err);
});

// Create user instance
const user = new User(database);

const app = express();
const port = 5000;

let isAuthenticated = false;

// Mustache setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Proper layout middleware for mustache-express
app.use((req, res, next) => {
  const render = res.render;
  res.render = function (view, options) {
    const locals = options || {};
    render.call(this, view, locals, (err, html) => {
      if (err) return next(err);
      render.call(this, 'layout', { yield: html });
    });
  };
  next();
});

// Routes
app.get('/', (_, res) => {
  res.render('index', { message: 'Hello, Mustache!' });
});

app.get('/users', async (_, res) => {
  try {
    const users = await user.getAllUsers();
    res.render('users', { users: users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
});

app.get('/login', (_, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // TODO: Implement proper login logic
  // Example: const authenticated = await user.authenticateUser(username, password);

  const user = user.getUserByUsername(username)
  if (user.password === password) {
    isAuthenticated = true;
    res.redirect('/users')
  }
  isAuthenticated = false;
  res.redirect('/login')
});

app.get('/create-user', (_, res) => {
  res.render('create-user');
});

app.post('/create-user', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Username, email, and password are required.');
  }

  try {
    await user.createUser(username, email, password);
    res.redirect('/login');
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Failed to create user');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
