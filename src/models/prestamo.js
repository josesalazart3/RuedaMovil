const db = require('../config/db');

const Prestamo = {
  // ✅ Crear un nuevo préstamo
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

  // ✅ Modificar terminal destino mientras está en ruta
  async modificarDestino(id_prestamo, nueva_terminal) {
    await db.query(
      `UPDATE prestamo 
       SET id_terminal_destino_modificado = ?, estado_modificacion = 'sí' 
       WHERE id_prestamo = ?`,
      [nueva_terminal, id_prestamo]
    );
  },

  // ✅ Finalizar préstamo (al devolver la bicicleta)
  async finalizar(id_prestamo, id_terminal_destino, fecha_fin) {
    await db.query(
      `UPDATE prestamo 
       SET estado = 'finalizado', fecha_fin = ?, id_terminal_destino_modificado = ? 
       WHERE id_prestamo = ?`,
      [fecha_fin, id_terminal_destino, id_prestamo]
    );
  },

  // ✅ Registrar penalización si se excede el tiempo
  async aplicarPenalizacion(id_usuario) {
    await db.query(
      `INSERT INTO penalizacion (id_usuario, cantidad_faltas, fecha_ultima_falta, estado)
       VALUES (?, 1, NOW(), 'activa')
       ON DUPLICATE KEY UPDATE 
         cantidad_faltas = cantidad_faltas + 1, 
         fecha_ultima_falta = NOW();`,
      [id_usuario]
    );
  }
};

module.exports = Prestamo;
