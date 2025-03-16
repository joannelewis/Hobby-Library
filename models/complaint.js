export class Complaint {
  #db;
  #setComplaintSQL = 'INSERT INTO complaints (loan_id, lender_id, complaint_date, description, image_url, status) VALUES (?, ?, ?, ?, ?, ?)';
  #getComplaintByIdSQL = 'SELECT * FROM complaints WHERE complaint_id = ?';
  #getAllComplaintsSQL = 'SELECT * FROM complaints';

  constructor(database) {
    this.#db = database;
    this.createComplaintStatement = this.#db.prepare(this.#setComplaintSQL);
    this.getComplaintByIdStatement = this.#db.prepare(this.#getComplaintByIdSQL);
    this.getAllComplaintsStatement = this.#db.prepare(this.#getAllComplaintsSQL);
  }

  async createComplaint(loanId, lenderId, complaintDate, description, imageUrl, status) {
    return new Promise((resolve, reject) => {
      this.createComplaintStatement.reset();
      this.createComplaintStatement.run(loanId, lenderId, complaintDate, description, imageUrl, status, (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve();
      });
    });
  }

  getComplaintById(id) {
    let complaint;
    this.getComplaintByIdStatement.reset();
    this.getComplaintByIdStatement.get(id, (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      complaint = row;
    });
    return complaint;
  }

  async getAllComplaints() {
    return new Promise((resolve, reject) => {
      this.getAllComplaintsStatement.reset();
      this.getAllComplaintsStatement.all((err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(rows);
      });
    });
  }
}
