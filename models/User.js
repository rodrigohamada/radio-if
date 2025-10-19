const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({
    nome,
    email,
    senha,
    celular,
    telefone,
    cep,
    logradouro,
    numero,
    bairro,
    cidade,
    uf,
    administrador = 0
  }) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const [result] = await db.query(
      `INSERT INTO usuarios 
      (nome, email, senha, celular, telefone, cep, logradouro, numero, bairro, cidade, uf, administrador)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, email, hashedPassword, celular, telefone, cep, logradouro, numero, bairro, cidade, uf, administrador]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  }

  static async verifyPassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

module.exports = User;
