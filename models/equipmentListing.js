module.exports.EquipmentListing = class EquipmentListing {
  #db;
  #setEquipmentListingSQL = 'INSERT INTO equipment_listings (equipment_id, name, quantity, deposit_amount, lender_id, lender_username, location) VALUES (?, ?, ?, ?, ?, ?, ?)';
  #getEquipmentListingByIdSQL = 'SELECT * FROM equipment_listings WHERE listing_id = ?';
  getEquipmentListingByEquipmentIdSQL = 'SELECT * FROM equipment WHERE equipment_id = ?';
  #getAllEquipmentListingsSQL = 'SELECT * FROM equipment_listings';
  #getEquipmentByCategorySQL = 'SELECT * FROM equipment WHERE category = ?';

  constructor(database) {
    this.#db = database;
    this.createEquipmentListingStatement = this.#db.prepare(this.#setEquipmentListingSQL);
    this.getEquipmentListingByIdStatement = this.#db.prepare(this.#getEquipmentListingByIdSQL);
    this.getEquipmentListingByEquipmentIdStatement = this.#db.prepare(this.getEquipmentListingByEquipmentIdSQL);
    this.getAllEquipmentListingsStatement = this.#db.prepare(this.#getAllEquipmentListingsSQL);
    this.getEquipmentByCategoryStatement = this.#db.prepare(this.#getEquipmentByCategorySQL);
  }

  async createEquipmentListing(equipmentId, name, quantity, depositAmount, lenderId, lenderUsername, location) {
    return new Promise((resolve, reject) => {
      this.createEquipmentListingStatement.reset();
      this.createEquipmentListingStatement.run(equipmentId, name, quantity, depositAmount, lenderId, lenderUsername, location, (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve();
      });
    });
  }

  getEquipmentListingById(id) {
    let equipmentListing;
    this.getEquipmentListingByIdStatement.reset();
    this.getEquipmentListingByIdStatement.get(id, (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      equipmentListing = row;
    });
    return equipmentListing;
  }

  getEquipmentListingByEquipmentId(id) {
    let equipmentListing;
    this.getEquipmentListingByEquipmentIdStatement.reset();
    this.getEquipmentListingByEquipmentIdStatement.get(id, (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      equipmentListing = row;
    });
    return equipmentListing;
  }

  async getAllEquipmentListings() {
    return new Promise((resolve, reject) => {
      this.getAllEquipmentListingsStatement.reset();
      this.getAllEquipmentListingsStatement.all((err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  async getEquipmentListingsByCategory(category) {
    return new Promise((resolve, reject) => {
      this.getEquipmentByCategoryStatement.reset();
      this.getEquipmentByCategoryStatement.all(category, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        const equipmentListings = rows
        resolve(equipmentListings);
      });
    });
  }
}
