export class User {
  #db;
  #setUserSQL = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  #getUserByIdSQL = 'SELECT * FROM users WHERE user_id = ?';
  #getUserByUsernameSQL = 'SELECT * FROM users WHERE username = ?';
  #getUserByEmailSQL = 'SELECT * FROM users WHERE email = ?';
  #getUserByRoleSQL = 'SELECT * FROM users WHERE role = ?';
  #getUserByLocationSQL = 'SELECT * FROM users WHERE location = ?';
  #getAllUsersSQL = 'SELECT * FROM users';

  constructor(database) {
    this.#db = database;

    this.createUserStatement = this.#db.prepare(this.#setUserSQL);
    this.getUserByIdStatement = this.#db.prepare(this.#getUserByIdSQL);
    this.getUserByUsernameStatement = this.#db.prepare(this.#getUserByUsernameSQL);
    this.getUserByEmailStatement = this.#db.prepare(this.#getUserByEmailSQL);
    this.getUserByRoleStatement = this.#db.prepare(this.#getUserByRoleSQL);
    this.getUserByLocationStatement = this.#db.prepare(this.#getUserByLocationSQL);
    this.getAllUsersStatement = this.#db.prepare(this.#getAllUsersSQL);
  }

  async createUser(username, email, password) {
    return new Promise((resolve, reject) => {
      this.createUserStatement.reset();
      this.createUserStatement.run(username, email, password, (err) => {
        console.log("started Create")
        if (err) {
          console.error(err.message);
          console.log("started Create e")
          reject(err);
        }
        console.log("started Create s")
        resolve()
      });
    });
  };

  getUserById(id) {
    let user;
    this.getUserByIdStatement.reset();
    this.getUserById.get(id, (err, row) => {
      if (err) {
        console.error(err.message);
        return
      }
      user = row;
    });
    return user;
  }

  getUserByUsername(username) {
    let user;
    this.getUserByUsernameStatement.reset();
    this.getUserByUsername.get(username, (err, row) => {
      if (err) {
        console.error(err.message);
        return
      }
      user = row;
    });
    return user;
  }

  getUserByEmail(email) {
    let user;
    this.getUserByEmailStatement.reset();
    this.getUserByEmail.get(email, (err, row) => {
      if (err) {
        console.error(err.message);
        return
      }
      user = row;
    });
    return user;
  }

  getUserByRole(role) {
    let user;
    this.getUserByRoleStatement.reset();
    this.getUserByRole.get(role, (err, row) => {
      if (err) {
        console.error(err.message);
        return
      }
      user = row;
    });
    return user;
  }

  getUserByLocation(location) {
    let user;
    this.getUserByLocationStatement.reset();
    this.getUserByLocation.get(location, (err, row) => {
      if (err) {
        console.error(err.message);
        return
      }
      user = row;
    });
    return user;
  }

  async getAllUsers() {
    return new Promise((resolve, reject) => {
      this.getAllUsersStatement.reset();
      this.getAllUsersStatement.all((err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(rows)
      });
    });
  }
}

