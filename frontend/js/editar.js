// frontend/js/editar.js

import { obtenerPermisosPorRol, generarCheckboxes } from './ui.js';

const API_URL = 'http://localhost:3000/api/usuarios';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');
  if (!userId) return alert('ID de usuario no proporcionado.');

  const form = document.getElementById('usuarioForm');
  const permisosContainer = document.getElementById('permisosContainer');
  const rolSelect = document.getElementById('rol');

  // Cargar datos del usuario
  try {
    const res = await fetch(`${API_URL}/${userId}`);
    if (!res.ok) throw new Error('No se pudo obtener el usuario');

    const usuario = await res.json();

    form.nombres.value = usuario.nombres;
    form.apellidos.value = usuario.apellidos;
    form.correo.value = usuario.correo;
    form.usuario.value = usuario.usuario;
    form.contrasenia.value = usuario.contrasenia;
    form.rol.value = usuario.rol;
    form.estado.value = usuario.estado;

    const permisos = obtenerPermisosPorRol(usuario.rol);
    const seleccionados = JSON.parse(usuario.permisos);
    permisosContainer.innerHTML = generarCheckboxes(permisos, seleccionados);
  } catch (error) {
    console.error('Error cargando usuario:', error);
    alert('No se pudo cargar el usuario');
  }

  rolSelect.addEventListener('change', () => {
    const nuevoRol = rolSelect.value;
    const nuevosPermisos = obtenerPermisosPorRol(nuevoRol);
    permisosContainer.innerHTML = generarCheckboxes(nuevosPermisos, []);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const permisos = Array.from(
      permisosContainer.querySelectorAll('input[name="permisos"]:checked')
    ).map(input => input.value);

    const data = {
      nombres: form.nombres.value,
      apellidos: form.apellidos.value,
      correo: form.correo.value,
      usuario: form.usuario.value,
      contrasenia: form.contrasenia.value,
      rol: form.rol.value,
      permisos: JSON.stringify(permisos),
      estado: form.estado.value
    };

    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert('Usuario actualizado con éxito');
        window.location.href = '../index.html';
      } else {
        const err = await res.json();
        alert('Error al actualizar usuario: ' + err.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión al actualizar usuario');
    }
  });
});
