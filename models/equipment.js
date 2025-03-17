class Equipment {
    constructor(db) {
      this.db = db;
    }
    
    async create(equipmentData) {
      return new Promise((resolve, reject) => {
        const sql = `
          INSERT INTO equipment (
            equipment_id, user_id, name, quantity, description, category, 
            deposit_amount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `;
        
        this.db.run(
          sql,
          [
            equipmentData.equipment_id,
            equipmentData.user_id,
            equipmentData.name,
            equipmentData.quantity,
            equipmentData.description,
            equipmentData.category,
            equipmentData.deposit_amount
          ],
          function(err) {
            if (err) return reject(err);
            resolve(this.lastID);
          }
        );
      });
    }

// Get equipment by ID
async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT e.*, c.name as category_name, l.name as location_name
        FROM equipment e
        JOIN categories c ON e.category_id = c.id
        JOIN locations l ON e.location_id = l.id
        WHERE e.id = ?
      `;
      
      this.db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
  
  // Get related equipment
  async getRelated(id, categoryId, limit = 3) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT e.*, c.name as category_name
        FROM equipment e
        JOIN categories c ON e.category_id = c.id
        WHERE e.category_id = ? AND e.id != ?
        LIMIT ?
      `;
      
      this.db.all(sql, [categoryId, id, limit], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  
  }
  
  module.exports = { Equipment };
  