// frontend/js/ver.js

const API_URL = 'http://localhost:3000/api/usuarios';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    alert('ID de usuario no especificado');
    return;
  }

  const detalle = document.getElementById('detalleUsuario');

  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Error al obtener usuario');
    
    const usuario = await res.json();

    const permisos = JSON.parse(usuario.permisos || '[]');
    const listaPermisos = permisos.map(p => `<li>${p}</li>`).join('');

    detalle.innerHTML = `
      <p><strong>Nombre:</strong> ${usuario.nombres} ${usuario.apellidos}</p>
      <p><strong>Correo:</strong> ${usuario.correo}</p>
      <p><strong>Usuario:</strong> ${usuario.usuario}</p>
      <p><strong>Rol:</strong> ${usuario.rol}</p>
      <p><strong>Estado:</strong> ${usuario.estado}</p>
      <p><strong>Permisos:</strong></p>
      <ul>${listaPermisos}</ul>
      <br />
      <a href="index.html" style="color:#3399ff;">← Volver a la lista</a>
    `;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    detalle.innerHTML = '<p style="color: red;">No se pudo cargar el usuario.</p>';
  }
});
