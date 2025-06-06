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

// 🔄 devolver bicicleta UC-5
exports.devolver = async (req, res) => {
  const id_usuario = req.usuario.id;
  const { id_terminal_destino } = req.body;

  try {
    const prestamo = await Prestamo.obtenerPrestamoActivo(id_usuario);

    if (!prestamo) {
      return res.status(404).json({ mensaje: 'No tienes un préstamo activo' });
    }

    const terminal = await Terminal.obtener(id_terminal_destino);

    if (!terminal || terminal.espacios_disponibles <= 0) {
      return res.status(400).json({ mensaje: 'No hay espacio disponible en esta terminal' });
    }

    const fecha_fin = new Date();
    const fecha_inicio = new Date(prestamo.fecha_inicio);
    const minutosUsados = Math.floor((fecha_fin - fecha_inicio) / 60000);

    await Prestamo.finalizar(prestamo.id_prestamo, id_terminal_destino, fecha_fin);

    await Bicicleta.actualizarEstado(prestamo.id_bicicleta, 'disponible', id_terminal_destino);

    await Terminal.actualizarEspacios(id_terminal_destino, -1); // ocupamos 1 espacio

    let mensaje = 'Bicicleta devuelta correctamente';
    if (minutosUsados > 60) {
      await Prestamo.aplicarPenalizacion(id_usuario); // opcional
      mensaje += ' (⚠️ tiempo excedido, penalización aplicada)';
    }

    res.status(200).json({ mensaje });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al devolver bicicleta', error });
  }
};

