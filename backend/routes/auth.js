const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'ma_cle_secrete_2plus2egale5';

// -----------------------------
// FONCTION DE VALIDATION DU MOT DE PASSE
// -----------------------------
function validatePassword(password) {
    if (password.length < 12) {
        return "Le mot de passe doit contenir au moins 12 caractères";
    }

    // Vérifie présence minuscule, majuscule, chiffre, caractère spécial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
    if (!regex.test(password)) {
        return "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial";
    }

    // Vérifie les suites alphabétiques
    const lower = password.toLowerCase();
    for (let i = 0; i < lower.length - 2; i++) {
        if (lower.charCodeAt(i) + 1 === lower.charCodeAt(i + 1) &&
            lower.charCodeAt(i + 1) + 1 === lower.charCodeAt(i + 2)) {
            return "Le mot de passe ne peut pas contenir de suite de lettres comme abc";
        }
    }

    // Vérifie les suites numériques
    for (let i = 0; i < password.length - 2; i++) {
        const n1 = password[i].charCodeAt(0);
        const n2 = password[i+1].charCodeAt(0);
        const n3 = password[i+2].charCodeAt(0);
        if (/\d/.test(password[i]) && /\d/.test(password[i+1]) && /\d/.test(password[i+2])) {
            if (n1 + 1 === n2 && n2 + 1 === n3) {
                return "Le mot de passe ne peut pas contenir de suite de chiffres comme 123";
            }
        }
    }

    return null; // mot de passe valide
}

// -----------------------------
// ROUTE LOGIN (inchangée)
// -----------------------------
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.execute('SELECT * FROM Users WHERE Username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Utilisateur inconnu" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: user.idUsers, role: user.Role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Connexion réussie",
            token: token,
            user: { id: user.idUsers, username: user.Username, role: user.Role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

// -----------------------------
// ROUTE REGISTER (SECURISÉE + MOT DE PASSE FORT)
// -----------------------------
router.post('/register', async (req, res) => {
    const { username, password, teamName, sportId } = req.body;

    // Vérification obligatoire des champs
    if (!username || !password || !teamName || !sportId) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // Validation du mot de passe
    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ message: passwordError });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Hash du mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Création du user (leader)
        const [userResult] = await connection.execute(
            `INSERT INTO Users (Username, Password, Role) VALUES (?, ?, 'leader')`,
            [username, hashedPassword]
        );
        const userId = userResult.insertId;

        // Création de l'équipe
        const [teamResult] = await connection.execute(
            `INSERT INTO Teams (Name, Users_id) VALUES (?, ?)`,
            [teamName, userId]
        );
        const teamId = teamResult.insertId;

        // Lier l'équipe au sport
        await connection.execute(
            `INSERT INTO Sports_has_Teams (idSports, idTeams) VALUES (?, ?)`,
            [sportId, teamId]
        );

        await connection.commit();

        res.status(201).json({ message: "Inscription réussie", userId, teamId });

    } catch (error) {
        await connection.rollback();
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Nom d'utilisateur ou équipe déjà existant" });
        }

        res.status(500).json({ message: "Erreur lors de l'inscription" });
    } finally {
        connection.release();
    }
});

module.exports = router;