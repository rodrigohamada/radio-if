const db = require('../config/database');

class Contact {
  static async create({ user_id, name, email, subject, subject_type, message }) {
    const [r] = await db.query(
      `INSERT INTO contatos (user_id, nome, email, assunto, tipo_assunto, mensagem)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, name, email, subject, subject_type, message]
    );
    return r.insertId;
  }

  static async findAll(limit = 100) {
    const [rows] = await db.query(
      `SELECT c.*, u.nome AS usuario_nome, u.email AS usuario_email
       FROM contatos c
       LEFT JOIN usuarios u ON u.id = c.user_id
       ORDER BY c.data_envio DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }
}

module.exports = Contact;
