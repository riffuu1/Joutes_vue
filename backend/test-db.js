require('dotenv').config();
const pool = require('./config/db');

async function test() {
    try {
        const [rows] = await pool.execute('SELECT * FROM Sports');
        console.log(rows);
        process.exit(0);
    } catch (e) {
        console.error("Erreur DB :", e);
        process.exit(1);
    }
}

test();