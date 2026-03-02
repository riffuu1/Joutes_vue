require('dotenv').config();
const express = require('express');
const cors = require('cors');

const playersRoutes = require('./routes/players');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/players', playersRoutes);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});