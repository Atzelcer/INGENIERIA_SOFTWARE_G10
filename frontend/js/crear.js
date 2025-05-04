// frontend/js/crear.js

const API_URL = 'http://localhost:3000/api/usuarios';

import { obtenerPermisosPorRol, generarCheckboxes } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('usuarioForm');
  const permisosContainer = document.getElementById('permisosContainer');
  const rolSelect = document.getElementById('rol');

  // Mostrar los permisos cuando se cambia el rol
  rolSelect.addEventListener('change', () => {
    const rol = rolSelect.value;
    const permisos = obtenerPermisosPorRol(rol);
    permisosContainer.innerHTML = '';
    permisosContainer.innerHTML = generarCheckboxes(permisos);
  });

  // Manejo del envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const permisos = Array.from(
      permisosContainer.querySelectorAll('input[name="permisos"]:checked')
    ).map((c) => c.value);

    const data = {
      nombres: form.nombres.value,
      apellidos: form.apellidos.value,
      correo: form.correo.value,
      usuario: form.usuario.value,
      contrasenia: form.contrasenia.value,
      rol: form.rol.value,
      permisos: JSON.stringify(permisos),
      estado: form.estado.value,
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Usuario creado con éxito');
        window.location.href = '../index.html';
      } else {
        const err = await res.json();
        alert('Error al crear usuario: ' + err.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  });

  // Cargar permisos si ya hay un valor preseleccionado al cargar
  if (rolSelect.value) {
    const permisos = obtenerPermisosPorRol(rolSelect.value);
    permisosContainer.innerHTML = generarCheckboxes(permisos);
  }
});
