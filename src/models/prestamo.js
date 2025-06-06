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
  }
};

module.exports = Prestamo;
