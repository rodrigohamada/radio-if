const db = require('../config/database');

class Slide {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM slides ORDER BY ordem ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM slides WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { titulo, descricao, imagem_url, badge, ordem } = data;
    await db.query(
      `INSERT INTO slides (titulo, descricao, imagem_url, badge, ordem)
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, descricao, imagem_url, badge, ordem]
    );
  }

  static async update(id, data) {
    const { titulo, descricao, imagem_url, badge, ordem } = data;
    await db.query(
      `UPDATE slides SET titulo=?, descricao=?, imagem_url=?, badge=?, ordem=? WHERE id=?`,
      [titulo, descricao, imagem_url, badge, ordem, id]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM slides WHERE id = ?', [id]);
  }
}

module.exports = Slide;
