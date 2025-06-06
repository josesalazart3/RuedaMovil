const db = require('../config/db');

const Usuario = {
  crear: async (nombre, correo, hash) => {
    const [rows] = await db.query(
      'INSERT INTO usuario (nombre, correo, contraseña, fecha_registro, estado) VALUES (?, ?, ?, NOW(), ?)',
      [nombre, correo, hash, 'activo']
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
    await db.query('UPDATE usuario SET estado = "verificado" WHERE correo = ?', [correo]);
  }
};

module.exports = Usuario;
