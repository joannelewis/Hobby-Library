export class Role {
  #db;
  #setRoleSQL = 'INSERT INTO roles (role_name) VALUES (?)';
  #getRoleByIdSQL = 'SELECT * FROM roles WHERE role_id = ?';
  #getRoleByNameSQL = 'SELECT * FROM roles WHERE role_name = ?';
  #getAllRolesSQL = 'SELECT * FROM roles';

  constructor(database) {
    this.#db = database;
    this.createRoleStatement = this.#db.prepare(this.#setRoleSQL);
    this.getRoleByIdStatement = this.#db.prepare(this.#getRoleByIdSQL);
    this.getRoleByNameStatement = this.#db.prepare(this.#getRoleByNameSQL);
    this.getAllRolesStatement = this.#db.prepare(this.#getAllRolesSQL);
  }

  async createRole(roleName) {
    return new Promise((resolve, reject) => {
      this.createRoleStatement.reset();
      this.createRoleStatement.run(roleName, (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve();
      });
    });
  }

  getRoleById(id) {
    let role;
    this.getRoleByIdStatement.reset();
    this.getRoleByIdStatement.get(id, (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      role = row;
    });
    return role;
  }

  getRoleByName(roleName) {
    let role;
    this.getRoleByNameStatement.reset();
    this.getRoleByNameStatement.get(roleName, (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      role = row;
    });
    return role;
  }

  async getAllRoles() {
    return new Promise((resolve, reject) => {
      this.getAllRolesStatement.reset();
      this.getAllRolesStatement.all((err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(rows);
      });
    });
  }
}
