const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const { User } = require('./models/user'); // Changed to CommonJS require
const { EquipmentListing } = require('./models/equipmentListing'); // Changed to CommonJS require
const { Equipment } = require('./models/equipment'); // Changed to CommonJS require

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
const equipment = new Equipment(database);

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
  equipment.forEach(e => {
    e.availability = e.quantity > 0
  });

  console.log(equipment);

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

// Admin Routes - Equipment Management
app.get('/create-equipment', (req, res) => {
  // Fetch categories and locations from database if needed
  const categories = [];
  const locations = [];

  res.render('create-equipment', {
    categories,
    locations,
    isAdmin: true
  });
});

app.post('/create-equipment', async (req, res) => {
  try {
    // Extract form data
    const {
      name, category, description, quantity, equipment_id, user_id, deposit_amount
    } = req.body;

    // Redirect to equipment management page
    res.redirect('/admin/manage-equipment');
  } catch (err) {
    console.error('Error creating equipment:', err);
    res.status(500).send('Failed to create equipment');
  }
});

// Equipment details route
app.get('/equipment/:id', async (req, res) => {
  // if (req.params && req.params.id) return res.status(400).send('Invalid equipment ID');
  let equipmentResults = await equipment.getEquipmentById(req.params.id);
  equipmentResults.availability = equipmentResults.quantity > 0;
  res.render('equipment-details', { equipment: equipmentResults });
});

// Request to borrow route
app.post('/equipment/:id/request', async (req, res) => {
  const equipmentId = req.params.id;
  const equipmentResults = await equipment.getEquipmentById(equipmentId);
  console.log("Equipment details:", equipmentResults);
  res.render("loan-request", { equipment: equipmentResults });

  // Redirect to loan request form
  // res.redirect('/loan-request');
  // console.error('Error processing loan request:', err);
  // res.status(500).send('Error processing loan request');
}
);

// Show loan request form
app.get('/loan-request', async (req, res) => {
  try {
    // Get the requested equipment ID from session
    const equipmentId = req.session.requestedEquipmentId;
    if (!equipmentId) {
      return res.redirect('/');
    }

    // Fetch equipment details
    // In a real app, you'd get this from your database
    const equipment = {
      id: equipmentId,
      name: "Bamboo Knitting Needles Set",
      category: "Knitting",
      loanPeriod: 14,
      depositAmount: 20,
      location: "Mississauga Valley Library",
      //imageUrl: "/images/knitting-needles.jpg"
    };

    // Calculate min/max dates for the form
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);

    const formatDate = (date) => {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    res.render('loan-request', {
      equipment,
      minDate: formatDate(tomorrow),
      maxDate: formatDate(maxDate),
      minReturnDate: formatDate(tomorrow)
    });
  } catch (err) {
    console.error('Error showing loan request form:', err);
    res.status(500).send('Error showing loan request form');
  }
});

// Process loan request
app.post('/loan-request', async (req, res) => {
  try {

    const {
      equipmentId,
      pickupDate,
      returnDate,
      depositAmount,
      agreeToTerms
    } = req.body;

    // Validate submission
    if (!equipmentId || !pickupDate || !returnDate || !depositAmount || !agreeToTerms) {
      return res.status(400).send('All fields are required');
    }

    const loanId = "L" + Math.floor(100000 + Math.random() * 900000); // For demo

    // Clear the session data
    req.session.requestedEquipmentId = null;

    // Redirect to the loan confirmation page
    res.redirect(`/loans/${loanId}`);
  } catch (err) {
    console.error('Error processing loan request:', err);
    res.status(500).send('Error processing loan request');
  }
});

// Show loan details
app.get('/loans/:id', async (req, res) => {
  try {
    const loanId = req.params.id;

    const loan = {
      id: loanId,
      referenceNumber: loanId,
      pickupDate: "May 15, 2024",
      returnDate: "May 29, 2024",
      pickupLocation: "Mississauga Valley Library",
      depositAmount: 20,
      equipment: {
        id: "1",
        name: "Bamboo Knitting Needles Set",
        category: "Knitting",
        skillLevel: "All Levels",
        //imageUrl: "/images/knitting-needles.jpg"
      }
    };

    res.render('loan-confirmation', { loan });
  } catch (err) {
    console.error(`Error fetching loan details:`, err);
    res.status(500).send('Error fetching loan details');
  }
});

// View all user loans
app.get('/my-loans', async (req, res) => {
  try {
    const loans = [
      {
        id: "L123456",
        referenceNumber: "L123456",
        pickupDate: "May 15, 2024",
        returnDate: "May 29, 2024",
        status: "Active",
        equipment: {
          id: "1",
          name: "Bamboo Knitting Needles Set",
          //imageUrl: "/images/knitting-needles.jpg"
        }
      }
    ];

    res.render('my-loans', { loans });
  } catch (err) {
    console.error('Error fetching user loans:', err);
    res.status(500).send('Error fetching user loans');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
