const Terminal = require('../models/terminal');

exports.agregar = async (req, res) => {
  const { nombre, ubicacion } = req.body;
  try {
    const id = await Terminal.agregar(nombre, ubicacion);
    res.status(201).json({ mensaje: 'Terminal agregada', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al agregar terminal', error });
  }
};

exports.cambiarEstado = async (req, res) => {
  const id_terminal = req.params.id;
  const { estado } = req.body; // "activa" o "inactiva"

  try {
    await Terminal.actualizarEstado(id_terminal, estado);
    res.status(200).json({ mensaje: `Terminal ${estado}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cambiar estado de terminal', error });
  }
};
