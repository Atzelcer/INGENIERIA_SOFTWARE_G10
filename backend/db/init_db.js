// backend/db/init_db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ruta absoluta al archivo de base de datos
const dbPath = path.join(__dirname, 'database.sqlite');

// Conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error('Error al conectar con la base de datos:', err.message);
  }
  console.log('Conexión con SQLite establecida.');
});

// Crear tabla usuarios si no existe
const createTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombres TEXT NOT NULL,
      apellidos TEXT NOT NULL,
      correo TEXT NOT NULL,
      usuario TEXT NOT NULL,
      contrasenia TEXT NOT NULL,
      rol TEXT NOT NULL,
      permisos TEXT,
      estado TEXT NOT NULL
    );
  `;

  db.run(query, (err) => {
    if (err) {
      return console.error('Error al crear la tabla "usuarios":', err.message);
    }
    console.log('Tabla "usuarios" creada o ya existente.');
  });
};

// Ejecutar creación
createTable();

module.exports = db;
