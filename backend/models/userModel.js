// backend/models/userModel.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta absoluta hacia la base de datos SQLite
const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Crear tabla si no existe
const initModel = () => {
  db.run(`
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
    )
  `);
};

// Obtener todos los usuarios
const getAllUsers = (callback) => {
  db.all('SELECT * FROM usuarios', callback);
};

// Obtener un usuario por ID
const getUserById = (id, callback) => {
  db.get('SELECT * FROM usuarios WHERE id = ?', [id], callback);
};

// Crear nuevo usuario
const createUser = (data, callback) => {
  const { nombres, apellidos, correo, usuario, contrasenia, rol, permisos, estado } = data;
  db.run(
    `INSERT INTO usuarios (nombres, apellidos, correo, usuario, contrasenia, rol, permisos, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombres, apellidos, correo, usuario, contrasenia, rol, permisos, estado],
    callback
  );
};

// Actualizar usuario por ID
const updateUser = (id, data, callback) => {
  const { nombres, apellidos, correo, usuario, contrasenia, rol, permisos, estado } = data;
  db.run(
    `UPDATE usuarios
     SET nombres = ?, apellidos = ?, correo = ?, usuario = ?, contrasenia = ?, rol = ?, permisos = ?, estado = ?
     WHERE id = ?`,
    [nombres, apellidos, correo, usuario, contrasenia, rol, permisos, estado, id],
    callback
  );
};

// Eliminar usuario por ID
const deleteUser = (id, callback) => {
  db.run('DELETE FROM usuarios WHERE id = ?', [id], callback);
};

module.exports = {
  initModel,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
