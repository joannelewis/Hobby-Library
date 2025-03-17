// models/loan.js
class Loan {
  constructor(db) {
    this.db = db;
  }
  
  async create(loanData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO loans (
          user_id, equipment_id, pickup_date, return_date,
          deposit_amount, status, reference_number, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `;
      
      // Generate a unique reference number
      const referenceNumber = "L" + Math.floor(100000 + Math.random() * 900000);
      
      this.db.run(
        sql,
        [
          loanData.userId,
          loanData.equipmentId,
          loanData.pickupDate,
          loanData.returnDate,
          loanData.depositAmount,
          'confirmed', // Initial status
          referenceNumber
        ],
        function(err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, referenceNumber });
        }
      );
    });
  }
  
  async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT l.*, e.name as equipment_name, e.image_path, 
               c.name as category_name, loc.name as location_name,
               u.username
        FROM loans l
        JOIN equipment e ON l.equipment_id = e.id
        JOIN categories c ON e.category_id = c.id
        JOIN locations loc ON e.location_id = loc.id
        JOIN users u ON l.user_id = u.id
        WHERE l.id = ?
      `;
      
      this.db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
  
  async getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT l.*, e.name as equipment_name, e.image_path 
        FROM loans l
        JOIN equipment e ON l.equipment_id = e.id
        WHERE l.user_id = ?
        ORDER BY l.created_at DESC
      `;
      
      this.db.all(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  
  // Method to update loan status
  async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE loans SET status = ? WHERE id = ?`;
      
      this.db.run(sql, [status, id], function(err) {
        if (err) return reject(err);
        resolve({ id, changes: this.changes });
      });
    });
  }
}

module.exports = { Loan };
