const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const { User } = require('./models/user'); // Changed to CommonJS require
const { EquipmentListing } = require('./models/equipmentListing'); // Changed to CommonJS require

// Database setup
/**
 * @type {sqlite3.Database}
 */
const database = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Failed to connect to the database:', err);
  console.log("Connected to the database")
});

// Create user instance
const user = new User(database);
const equipmentListing = new EquipmentListing(database);

const app = express();
const port = 5000;

// Mustache setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

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
app.get('/', async (req, res) => {
  let isAuthenticated, userObj;
  if (req.cookies && req.cookies.loggedIn) {
    console.log("User is authenticated");
    isAuthenticated = req.cookies.loggedIn === 'true';
    const userId = req.cookies.user;
    userObj = await user.getUserById(userId);
    console.log("User object:", userObj);
  } else {
    console.log("User is not authenticated");
    isAuthenticated = false;
  }

  res.render('index', { message: 'Hello, Mustache!', isAuthenticated: isAuthenticated ? "Logout, " + userObj.username : "Login", authRoute: isAuthenticated ? "/logout" : "/login" });
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

app.get('/knitting', async (req, res) => {
  let equipment = await equipmentListing.getEquipmentListingsByCategory("knitting");
  // let equipmentListings = []
  // equipment = equipment.forEach(e => {
  //   equipmentListings.push(equipmentListing.getEquipmentListingByEquipmentId(e.equipment_id))
  // })

  res.render('equipment-listings', { equipment });
});

app.get('/login', (_, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(`Attempting login for username: ${email}`);

  try {
    const userResult = await user.getUserByEmail(email);
    console.log("User lookup result:", userResult);

    if (userResult && userResult.password === password) {
      console.log("Login successful");
      return res.cookie("loggedIn", 'true')
        .cookie("user", userResult.user_id)
        .redirect('/');
    } else {
      console.log("Login failed - invalid credentials");
      return res.redirect('/login');
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.redirect('/login');
  }
});

app.get('/logout', (_, res) => {
  return res.clearCookie("loggedIn").redirect('/');
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
