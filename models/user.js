/**
 * @import {require(sqlite3).Database} Database
 */

module.exports.User = class User {
  #db;
  #setUserSQL = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  #getUserByIdSQL = 'SELECT * FROM users WHERE user_id = ?';
  #getUserByUsernameSQL = 'SELECT * FROM users WHERE username = ?';
  #getUserByEmailSQL = 'SELECT * FROM users WHERE email = ?';
  #getUserByRoleSQL = 'SELECT * FROM users WHERE role = ?';
  #getUserByLocationSQL = 'SELECT * FROM users WHERE location = ?';
  #getAllUsersSQL = 'SELECT * FROM users';
  #createUserStatement
  #getUserByIdStatement
  #getUserByUsernameStatement
  #getUserByEmailStatement
  #getUserByRoleStatement
  #getUserByLocationStatement
  #getAllUsersStatement

  /**
  * @property {Database} database
  */
  constructor(database) {
    if (!database) {
      console.error(database);
      throw new Error('Database is required');
    }
    this.#db = database;

    this.#createUserStatement = this.#db.prepare(this.#setUserSQL);
    this.#getUserByIdStatement = this.#db.prepare(this.#getUserByIdSQL);
    this.#getUserByUsernameStatement = this.#db.prepare(this.#getUserByUsernameSQL);
    this.#getUserByEmailStatement = this.#db.prepare(this.#getUserByEmailSQL);
    this.#getUserByRoleStatement = this.#db.prepare(this.#getUserByRoleSQL);
    this.#getUserByLocationStatement = this.#db.prepare(this.#getUserByLocationSQL);
    this.#getAllUsersStatement = this.#db.prepare(this.#getAllUsersSQL);
  }

  createUser(username, email, password) {
    return new Promise((resolve, reject) => {
      this.#createUserStatement.reset();
      this.#createUserStatement.run(username, email, password, (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.#getUserByIdStatement.reset();
      this.#getUserByIdStatement.get(id, (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.#getUserByUsernameStatement.reset();
      this.#getUserByUsernameStatement.get(username, (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          console.log(row);
          resolve(row);
        }
      });
    });
  }

  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.#getUserByEmailStatement.reset();
      this.#getUserByEmailStatement.get(email, (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getUserByRole(role) {
    return new Promise((resolve, reject) => {
      this.#getUserByRoleStatement.reset();
      this.#getUserByRoleStatement.get(role, (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getUserByLocation(location) {
    return new Promise((resolve, reject) => {
      this.#getUserByLocationStatement.reset();
      this.#getUserByLocationStatement.get(location, (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.#getAllUsersStatement.reset();
      this.#getAllUsersStatement.all((err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(rows)
      });
    });
  }
}

