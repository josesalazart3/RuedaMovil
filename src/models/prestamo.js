const db = require('../config/db');

const Prestamo = {
  async crear({ id_usuario, id_bicicleta, id_terminal_origen, id_terminal_destino, codigo }) {
    const [result] = await db.query(
      `INSERT INTO prestamo 
      (id_usuario, id_bicicleta, id_terminal_origen, id_terminal_destino, fecha_inicio, estado, codigo_desbloqueo, estado_modificacion) 
      VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)`,
      [id_usuario, id_bicicleta, id_terminal_origen, id_terminal_destino, 'activo', codigo, 'no']
    );
    return result.insertId;
  },

  // ✅ Obtener préstamo activo del usuario
  async obtenerPrestamoActivo(id_usuario) {
    const [rows] = await db.query(
      `SELECT * FROM prestamo 
       WHERE id_usuario = ? AND estado = 'activo' 
       ORDER BY fecha_inicio DESC LIMIT 1`,
      [id_usuario]
    );
    return rows[0];
  },

  // ✅ Actualizar terminal de destino
  async modificarDestino(id_prestamo, nueva_terminal) {
    await db.query(
      `UPDATE prestamo 
       SET id_terminal_destino_modificado = ?, estado_modificacion = 'sí' 
       WHERE id_prestamo = ?`,
      [nueva_terminal, id_prestamo]
    );
  }
};

module.exports = Prestamo;
