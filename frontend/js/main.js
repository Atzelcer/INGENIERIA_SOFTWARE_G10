// frontend/js/main.js
const API_URL = 'http://localhost:3000/api/usuarios';

document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('tablaUsuarios').querySelector('tbody');

  async function cargarUsuarios() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('No se pudo obtener los usuarios');
      const usuarios = await res.json();
      tabla.innerHTML = '';

      usuarios.forEach((u, i) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${i + 1}</td>
          <td>${u.nombres} ${u.apellidos}</td>
          <td>${u.usuario}</td>
          <td>${u.rol}</td>
          <td>${u.estado}</td>
          <td>
            <button onclick="editarUsuario(${u.id})">Editar</button>
            <button onclick="eliminarUsuario(${u.id})">Eliminar</button>
          </td>
        `;

        fila.addEventListener('dblclick', () => {
          window.location.href = `ver_usuario.html?id=${u.id}`;
        });

        tabla.appendChild(fila);
      });
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  window.eliminarUsuario = async function (id) {
    if (!confirm("¿Deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Usuario eliminado');
        cargarUsuarios();
      } else {
        alert('No se pudo eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  window.editarUsuario = function (id) {
    window.location.href = `editar_usuario.html?id=${id}`;
  };

  cargarUsuarios();
});
