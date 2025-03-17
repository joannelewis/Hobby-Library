/**
 * @import {require(sqlite3).Database} Database
 */

module.exports.Equipment = class Equipment {
  #db;
  #addEquipmentSQL = 'INSERT INTO equipment (user_id, name, quantity, deposit_amount, description, category) VALUES (?, ?, ?, ?, ?, ?)';
  #getEquipmentByIdSQL = 'SELECT * FROM equipment WHERE equipment_id = ?';
  #getEquipmentByUserIdSQL = 'SELECT * FROM equipment WHERE user_id = ?';
  #getEquipmentByCategorySQL = 'SELECT * FROM equipment WHERE category = ?';
  #getAllEquipmentSQL = 'SELECT * FROM equipment';
  #updateEquipmentSQL = 'UPDATE equipment SET user_id = ?, name = ?, quantity = ?, deposit_amount = ?, description = ?, category = ? WHERE equipment_id = ?';
  #deleteEquipmentSQL = 'DELETE FROM equipment WHERE equipment_id = ?';

  #addEquipmentStatement;
  #getEquipmentByIdStatement;
  #getEquipmentByUserIdStatement;
  #getEquipmentByCategoryStatement;
  #getAllEquipmentStatement;
  #updateEquipmentStatement;
  #deleteEquipmentStatement;

  /**
   * @property {Database} database
   */
  constructor(database) {
    if (!database) {
      console.error(database);
      throw new Error('Database is required');
    }
    this.#db = database;

    this.#addEquipmentStatement = this.#db.prepare(this.#addEquipmentSQL);
    this.#getEquipmentByIdStatement = this.#db.prepare(this.#getEquipmentByIdSQL);
    this.#getEquipmentByUserIdStatement = this.#db.prepare(this.#getEquipmentByUserIdSQL);
    this.#getEquipmentByCategoryStatement = this.#db.prepare(this.#getEquipmentByCategorySQL);
    this.#getAllEquipmentStatement = this.#db.prepare(this.#getAllEquipmentSQL);
    this.#updateEquipmentStatement = this.#db.prepare(this.#updateEquipmentSQL);
    this.#deleteEquipmentStatement = this.#db.prepare(this.#deleteEquipmentSQL);
  }

  addEquipment(userId, name, quantity, depositAmount, description, category) {
    return new Promise((resolve, reject) => {
      this.#addEquipmentStatement.reset();
      this.#addEquipmentStatement.run(
        userId,
        name,
        quantity,
        depositAmount,
        description,
        category,
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  getEquipmentById(id) {
    return new Promise((resolve, reject) => {
      this.#getEquipmentByIdStatement.reset();
      this.#getEquipmentByIdStatement.get(id, (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getEquipmentByUserId(userId) {
    return new Promise((resolve, reject) => {
      this.#getEquipmentByUserIdStatement.reset();
      this.#getEquipmentByUserIdStatement.all(userId, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getEquipmentByCategory(category) {
    return new Promise((resolve, reject) => {
      this.#getEquipmentByCategoryStatement.reset();
      this.#getEquipmentByCategoryStatement.all(category, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getAllEquipment() {
    return new Promise((resolve, reject) => {
      this.#getAllEquipmentStatement.reset();
      this.#getAllEquipmentStatement.all((err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  updateEquipment(equipmentId, userId, name, quantity, depositAmount, description, category) {
    return new Promise((resolve, reject) => {
      this.#updateEquipmentStatement.reset();
      this.#updateEquipmentStatement.run(
        userId,
        name,
        quantity,
        depositAmount,
        description,
        category,
        equipmentId,
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  deleteEquipment(equipmentId) {
    return new Promise((resolve, reject) => {
      this.#deleteEquipmentStatement.reset();
      this.#deleteEquipmentStatement.run(equipmentId, (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};
