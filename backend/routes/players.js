const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Players');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la lecture de la BD')
    }
})



router.get(':id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Players WHERE id = ?', [req.params.id]);
        res.json(rows[0] || {message: "Non trouvé"});
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router