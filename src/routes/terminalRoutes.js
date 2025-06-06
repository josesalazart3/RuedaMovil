const express = require('express');
const router = express.Router();
const terminalController = require('../controllers/terminalController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post('/', verifyToken, verifyAdmin, terminalController.agregar);
router.put('/:id/estado', verifyToken, verifyAdmin, terminalController.cambiarEstado);
router.get('/estado', verifyToken, terminalController.estadoTerminales)

router.put('/:id/mantenimiento', verifyToken, verifyAdmin, terminalController.asignarMantenimiento);

module.exports = router;
