const db = require('../config/database');

class News {
  // Retorna todas as notícias (para página principal)
  static async findAll() {
    const [rows] = await db.query(`
      SELECT n.*, u.nome AS autor_nome
      FROM noticias n
      LEFT JOIN usuarios u ON u.id = n.id_autor
      ORDER BY n.data_criacao DESC
    `);
    return rows;
  }

  // Retorna apenas as 2 mais recentes (para home)
  static async findRecent(limit = 2) {
    const [rows] = await db.query(`
      SELECT id, titulo, conteudo, data_criacao
      FROM noticias
      ORDER BY data_criacao DESC
      LIMIT ?
    `, [limit]);
    return rows;
  }

  // Busca notícia por ID
  static async findById(id) {
    const [rows] = await db.query(`
      SELECT * FROM noticias WHERE id = ?
    `, [id]);
    return rows[0];
  }

  // Cria nova notícia
  static async create({ titulo, conteudo, imagem_url, id_autor }) {
    const [result] = await db.query(`
      INSERT INTO noticias (titulo, conteudo, imagem_url, id_autor)
      VALUES (?, ?, ?, ?)
    `, [titulo, conteudo, imagem_url || null, id_autor || null]);
    return result.insertId;
  }

  // Atualiza notícia existente
  static async update(id, { titulo, conteudo, imagem_url }) {
    await db.query(`
      UPDATE noticias
      SET titulo = ?, conteudo = ?, imagem_url = ?
      WHERE id = ?
    `, [titulo, conteudo, imagem_url || null, id]);
  }

  // Deleta notícia
  static async delete(id) {
    await db.query(`DELETE FROM noticias WHERE id = ?`, [id]);
  }
}

module.exports = News;
