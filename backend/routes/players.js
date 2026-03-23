const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ma_cle_secrete_2plus2egale5';

// MIDDLEWARE de vérification du rôle
const isAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) return res.status(401).json({ message: "Token manquant" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token invalide ou expiré" });

        // On vérifie si le rôle dans le token est 'admin'
        if (decoded.role === 'admin') {
            req.user = decoded;
            next();
        } else {
            res.status(403).json({ message: "Accès interdit : Réservé aux administrateurs" });
        }
    });
};

// Route publique : Tout le monde peut voir
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Players');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la lecture de la BD');
    }
});

// Route publique
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Players WHERE idPlayers = ?', [req.params.id]);
        res.json(rows[0] || { message: "Non trouvé" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

// Route PROTÉGÉE : Seul l'admin peut créer
router.post('/', isAdmin, async (req, res) => {
    const { Firstname, Lastname, Email, Classname, Teams_id } = req.body;
    try {
        const sql = `INSERT INTO Players (Firstname, Lastname, Email, Classname, Teams_id) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(sql, [Firstname, Lastname, Email, Classname, Teams_id]);
        res.status(201).json({ message: "Joueur créé !", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la création");
    }
});

module.exports = router;