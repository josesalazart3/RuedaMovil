const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');
const verifyToken = require('../middleware/verifyToken'); // ✅

router.post('/reservar', verifyToken, prestamoController.reservar); // ✅ protegida

module.exports = router;
