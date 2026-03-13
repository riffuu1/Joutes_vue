const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'ma_cle_secrete_2plus2egale5';

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.execute('SELECT * FROM Users WHERE Username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Utilisateur inconnu" });
        }

        const user = users[0];

        // LOGIQUE SÉCURISÉE : Verification du hash
        // On compare le mot de passe reçu avec le hash stocké en base
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // On génère un TOKEN qui contient les infos de l'utilisateur
        const token = jwt.sign(
            { id: user.idUsers, role: user.Role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Connexion réussie",
            token: token,
            user: {
                username: user.Username,
                role: user.Role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;