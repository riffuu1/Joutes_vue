const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/sports -> renvoie tous les sports
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT idSports, Name FROM Sports');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;