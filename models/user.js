const sqlite3 = require('sqlite3').verbose();

// Database setup

const GetUserClass = () => {
  let db;
  const setUserSQL = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  const getUserByIdSQL = 'SELECT username FROM users WHERE user_id = ?';
  const getUserByUsernameSQL = 'SELECT username FROM users WHERE username = ?';
  const getUserByEmailSQL = 'SELECT username FROM users WHERE email = ?';
  const getUserByRoleSQL = 'SELECT username FROM users WHERE role = ?';
  const getUserByLocationSQL = 'SELECT username FROM users WHERE location = ?';

  class User {
    constructor() {
      db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the SQLite database.');
      });

      this.setUser = db.prepare(setUserSQL);
      this.getUserById = db.prepare(getUserByIdSQL);
      this.getUserByUsername = db.prepare(getUserByUsernameSQL);
      this.getUserByEmail = db.prepare(getUserByEmailSQL);
      this.getUserByRole = db.prepare(getUserByRoleSQL);
      this.getUserByLocation = db.prepare(getUserByLocationSQL);
    }


    createUser(username, email, password) {
      let user;
      this.createUser.reset();
      this.setUser.run(username, email, password, (err) => {
        if (err) console.error(err.message);
        user = row;
      });
      return user;
    };

    getUserById(id) {
      let user;
      this.getUserById.reset();
      this.getUserById.get(id, (err, row) => {
        if (err) console.error(err.message);
        user = row;
      });
      return user;
    }

    getUserByUsername(username) {
      let user;
      this.getUserByUsername.reset();
      this.getUserByUsername.get(username, (err, row) => {
        if (err) console.error(err.message);
        user = row;
      });
      return user;
    }

    getUserByEmail(email) {
      let user;
      this.getUserByEmail.reset();
      this.getUserByEmail.get(email, (err, row) => {
        if (err) console.error(err.message);
        user = row;
      });
      return user;
    }

    getUserByRole(role) {
      let user;
      this.getUserByRole.reset();
      this.getUserByRole.get(role, (err, row) => {
        if (err) console.error(err.message);
        user = row;
      });
      return user;
    }

    getUserByLocation(location) {
      let user;
      this.getUserByLocation.reset();
      this.getUserByLocation.get(location, (err, row) => {
        if (err) console.error(err.message);
        user = row;
      });
      return user;
    }
  }
};


module.exports = GetUserClass;
