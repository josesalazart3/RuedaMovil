const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

router.post('/reservar', prestamoController.reservar);

module.exports = router;
