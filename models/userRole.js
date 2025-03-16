export class UserRole {
  #db;
  #setUserRoleSQL = 'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)';
  #getUserRoleByIdSQL = 'SELECT * FROM user_roles WHERE user_id = ?';
  #getAllUserRolesSQL = 'SELECT * FROM user_roles';

  constructor(database) {
    this.#db = database;
    this.createUserRoleStatement = this.#db.prepare(this.#setUserRoleSQL);
    this.getUserRoleByIdStatement = this.#db.prepare(this.#getUserRoleByIdSQL);
    this.getAllUserRolesStatement = this.#db.prepare(this.#getAllUserRolesSQL);
  }

  async createUserRole(userId, roleId) {
    return new Promise((resolve, reject) => {
      this.createUserRoleStatement.reset();
      this.createUserRoleStatement.run(userId, roleId, (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve();
      });
    });
  }

  getUserRoleById(userId) {
    let userRole;
    this.getUserRoleByIdStatement.reset();
    this.getUserRoleByIdStatement.get(userId, (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      userRole = row;
    });
    return userRole;
  }

  async getAllUserRoles() {
    return new Promise((resolve, reject) => {
      this.getAllUserRolesStatement.reset();
      this.getAllUserRolesStatement.all((err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(rows);
      });
    });
  }
}
