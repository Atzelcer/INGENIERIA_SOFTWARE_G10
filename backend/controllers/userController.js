// backend/controllers/userController.js

const userModel = require('../models/userModel');

// Inicializar la base de datos (si no existe, crea la tabla)
userModel.initModel();

// Obtener todos los usuarios
const getAllUsers = (req, res) => {
  userModel.getAllUsers((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener un usuario por ID
const getUserById = (req, res) => {
  const { id } = req.params;
  userModel.getUserById(id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(row);
  });
};

// Crear nuevo usuario
const createUser = (req, res) => {
  const data = req.body;
  userModel.createUser(data, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, ...data });
  });
};

// Actualizar usuario por ID
const updateUser = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  userModel.updateUser(id, data, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario actualizado' });
  });
};

// Eliminar usuario por ID
const deleteUser = (req, res) => {
  const { id } = req.params;
  userModel.deleteUser(id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario eliminado' });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
