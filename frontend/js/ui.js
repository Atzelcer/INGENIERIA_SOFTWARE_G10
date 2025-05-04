// js/ui.js
export function obtenerPermisosPorRol(rol) {
    if (rol === 'Jefe de Ventas') {
      return ['crear usuarios', 'eliminar usuarios', 'ver estado de vendedores', 'añadir producto', 'eliminar producto'];
    } else if (rol === 'Vendedor') {
      return ['seleccionar productos', 'ingresar datos del cliente', 'emitir factura', 'mostrar clientes', 'mostrar ventas'];
    }
    return [];
  }
  
  export function generarCheckboxes(permisos, seleccionados = []) {
    return `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
        ${permisos.map((permiso, i) => `
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="checkbox" name="permisos" value="${permiso}" id="permiso_${i}" ${seleccionados.includes(permiso) ? 'checked' : ''}>
            ${permiso}
          </label>
        `).join('')}
      </div>
    `;
  }
  