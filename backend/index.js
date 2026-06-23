const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Conexão com o banco de dados
const db = new sqlite3.Database(path.join(__dirname, 'cs2_tutorials.db'), (err) => {
    if (err) {
        console.error("Erro ao abrir o banco de dados", err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite (CS2).');
    }
});

// API - Buscar tutoriais de um mapa do CS2
app.get('/api/tutorials/cs2/:map', (req, res) => {
    const map = req.params.map;
    const sql = `SELECT * FROM tutorials WHERE map = ? AND category = 'cs2'`;

    db.all(sql, [map], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});