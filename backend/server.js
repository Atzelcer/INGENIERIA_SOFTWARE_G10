// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
const userRoutes = require('./routes/userRoutes');
app.use('/api/usuarios', userRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
