const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const mustacheExpress = require('mustache-express');
const path = require('path');

const app = express();
const port = 5000;

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Mustache setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { message: 'Hello, Mustache!' });
});

app.get('/users', (req, res) => {
  db.all('SELECT user_id, username FROM users', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Server error');
      return;
    }
    res.render('users', { users: rows });
  });
});

app.get('/create-user', (req, res) => {
  res.render('create-user'); // Render the create-user form
});

app.post('/create-user', (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).send('Username and email are required.');
  }

  db.run(
    'INSERT INTO users (username, email) VALUES (?, ?)',
    [username, email],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Failed to create user.');
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      res.redirect('/users'); // Redirect to the users list
    },
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
