const Bicicleta = require('../models/bicicleta');
const Prestamo = require('../models/prestamo');
const Terminal = require('../models/terminal');
const crypto = require('crypto');

// 🚲 UC-2: Reservar bicicleta
exports.reservar = async (req, res) => {
  const { id_terminal_origen, id_terminal_destino } = req.body;
  const id_usuario = req.usuario.id;

  try {
    const bicicleta = await Bicicleta.obtenerDisponibleEnTerminal(id_terminal_origen);

    if (!bicicleta) {
      return res.status(404).json({ mensaje: 'No hay bicicletas disponibles en esta terminal' });
    }

    const codigo = crypto.randomBytes(4).toString('hex');

    const id_prestamo = await Prestamo.crear({
      id_usuario,
      id_bicicleta: bicicleta.id_bicicleta,
      id_terminal_origen,
      id_terminal_destino,
      codigo
    });

    await Bicicleta.actualizarEstado(bicicleta.id_bicicleta, 'en uso');

    res.status(201).json({
      mensaje: 'Reserva confirmada',
      id_prestamo,
      codigo_desbloqueo: codigo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al reservar bicicleta', error });
  }
};

// 🔄 UC-3: Modificar destino durante el viaje
exports.modificarDestino = async (req, res) => {
  const id_usuario = req.usuario.id;
  const { nuevo_destino } = req.body;

  try {
    const prestamo = await Prestamo.obtenerPrestamoActivo(id_usuario);

    if (!prestamo) {
      return res.status(404).json({ mensaje: 'No hay un préstamo activo' });
    }

    const disponible = await Terminal.espacioDisponible(nuevo_destino);
    if (!disponible) {
      return res.status(400).json({ mensaje: 'La terminal no tiene espacio disponible' });
    }

    await Prestamo.modificarDestino(prestamo.id_prestamo, nuevo_destino);

    res.status(200).json({ mensaje: 'Destino modificado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al modificar destino', error });
  }
};
