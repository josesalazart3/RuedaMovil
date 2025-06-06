const db = require('../config/db');

const Terminal = {
  async espacioDisponible(id_terminal) {
    const [rows] = await db.query(
      `SELECT * FROM terminal WHERE id_terminal = ? AND espacios_disponibles > 0`,
      [id_terminal]
    );
    return rows.length > 0;
  }
};

module.exports = Terminal;
