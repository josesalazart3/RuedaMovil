const db = require('../config/db');

const Bicicleta = {
  async obtenerDisponibleEnTerminal(id_terminal) {
    const [rows] = await db.query(
      'SELECT * FROM bicicleta WHERE estado = "disponible" AND ubicacion_actual = ? LIMIT 1',
      [id_terminal]
    );
    return rows[0];
  },

  async actualizarEstado(id_bicicleta, estado) {
    await db.query(
      'UPDATE bicicleta SET estado = ? WHERE id_bicicleta = ?',
      [estado, id_bicicleta]
    );
  }
};

module.exports = Bicicleta;
