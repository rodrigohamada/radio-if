const db4 = require('../config/database');


class MusicRequest {
    static async create({ user_id, artist, title, note }) {
        try {
            const [r] = await db4.query(
                'INSERT INTO music_requests (user_id, artist, title, note) VALUES (?, ?, ?, ?)',
                [user_id, artist, title, note]
            );
            return r.insertId;
        } catch (e) {
            if (process.env.DEBUG_DB_FALLBACK === 'true') {
                console.warn('[MusicRequest] DB indisponível. Pedido não persistido (fallback).');
                return 0;
            }
            throw e;
        }
    }


    static async findAll(limit = 50) {
        try {
            const [rows] = await db4.query(
                `SELECT mr.*, u.name as user_name, u.email as user_email
FROM music_requests mr
LEFT JOIN users u ON u.id = mr.user_id
ORDER BY mr.created_at DESC
LIMIT ?`,
                [limit]
            );
            return rows;
        } catch (e) {
            if (process.env.DEBUG_DB_FALLBACK === 'true') {
                return [
                    { id: 1, user_id: 0, user_name: 'Convidado', artist: 'Coldplay', title: 'Yellow', note: 'Dedicada à turma', created_at: new Date() }
                ];
            }
            throw e;
        }
    }
}


module.exports = MusicRequest;