const db = require('../config/db');

const Usuario = {
  crear: async (nombre, correo, hash, rol = 'usuario') => {
    const [rows] = await db.query(
      `INSERT INTO usuario (nombre, correo, contraseña, fecha_registro, estado, rol)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [nombre, correo, hash, 'activo', rol]
    );
    return rows.insertId;
  },

  buscarPorCorreo: async (correo) => {
    const [rows] = await db.query(
      'SELECT * FROM usuario WHERE correo = ?',
      [correo]
    );
    return rows[0];
  },

  verificar: async (correo) => {
    await db.query(
      'UPDATE usuario SET estado = "verificado" WHERE correo = ?',
      [correo]
    );
  }
};

module.exports = Usuario;
