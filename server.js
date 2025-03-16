const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const userObj = require('./models/user.js');
const User = userObj.GetUserClass();

const app = express();
const port = 5000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Mustache setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Routes


app.get('/', (req, res) => {
  User.createUser("beepboop", "penis@penis.cum", "i<3cum")
  res.render('index', { message: 'Hello, Mustache!' });
});

// app.get('/users', (req, res) => {
//   db.all('SELECT user_id, username FROM users ORDER BY 1', [], (err, rows) => {
//     if (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//       return;
//     }
//     res.render('users', { users: rows });
//   });
// });
//
// app.get('/create-user', (req, res) => {
//   res.render('create-user'); // Render the create-user form
// });
// const { username, email } = req.body;
// let user_id = 0;
//
// if (!username || !email) {
//   return res.status(400).send('Username and email are required.');
// }
//
// db.exec('SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1', [], (err, rows) => {
//   if (err) {
//     console.error(err.message);
//     return res.status(500).send('Failed to create user.');
//   }
//   user_id = rows[0].user_id + 1;
// });
//
// db.run(
//   'INSERT INTO users (user_id, username, email) VALUES (?, ?, ?)',
//   [user_id, username, email],
//   function (err) {
//     if (err) {
//       console.error(err.message);
//       return res.status(500).send('Failed to create user.');
//     }
//     console.log(`A row has been inserted with rowid ${this.lastID}`);
//     res.redirect('/users'); // Redirect to the users list
//   },
// );
//


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
