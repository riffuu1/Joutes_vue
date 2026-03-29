require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const playersRoutes = require('./routes/players');
const sportsRoutes = require('./routes/sports');


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200
}


const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/sports', sportsRoutes);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});