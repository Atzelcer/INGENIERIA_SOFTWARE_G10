-- Crear base de datos
CREATE DATABASE IF NOT EXISTS techstore_db;
USE techstore_db;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255)
);

-- Tabla de permisos
CREATE TABLE IF NOT EXISTS permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255)
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role_id INT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Tabla de relación usuarios-permisos
CREATE TABLE IF NOT EXISTS user_permissions (
  user_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (user_id, permission_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  document_type ENUM('CI', 'NIT') NOT NULL,
  document VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id),
  UNIQUE KEY (document_type, document)
);

-- Tabla de categorías de productos
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255)
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category_id INT,
  image VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  user_id INT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  cuf VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('emitida', 'anulada') DEFAULT 'emitida',
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de detalle de facturas
CREATE TABLE IF NOT EXISTS invoice_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insertar roles
INSERT INTO roles (name, description) VALUES 
('Administrador', 'Control total del sistema'),
('Jefe de Ventas', 'Gestión de vendedores y productos'),
('Vendedor', 'Emisión de facturas y registro de clientes');

-- Insertar permisos
INSERT INTO permissions (name, description) VALUES 
('crear_usuarios', 'Crear nuevos usuarios'),
('editar_usuarios', 'Editar usuarios existentes'),
('eliminar_usuarios', 'Eliminar usuarios'),
('ver_usuarios', 'Ver lista de usuarios'),
('crear_productos', 'Crear nuevos productos'),
('editar_productos', 'Editar productos existentes'),
('eliminar_productos', 'Eliminar productos'),
('ver_productos', 'Ver lista de productos'),
('registrar_clientes', 'Registrar nuevos clientes'),
('editar_clientes', 'Editar clientes existentes'),
('eliminar_clientes', 'Eliminar clientes'),
('ver_clientes', 'Ver lista de clientes'),
('emitir_facturas', 'Emitir nuevas facturas'),
('ver_facturas', 'Ver facturas emitidas'),
('anular_factura', 'Anular facturas'),
('generar_pdf_factura', 'Generar PDF de facturas'),
('ver_reportes', 'Ver reportes y estadísticas');

-- Insertar usuario administrador
INSERT INTO users (username, password, name, email, role_id) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin@techstore.com', 1);

-- Asignar todos los permisos al administrador
INSERT INTO user_permissions (user_id, permission_id)
SELECT 1, id FROM permissions;

-- Insertar categorías de productos
INSERT INTO categories (name, description) VALUES 
('Laptops', 'Computadoras portátiles'),
('Monitores', 'Pantallas y monitores'),
('Periféricos', 'Teclados, mouse y otros periféricos'),
('Smartphones', 'Teléfonos inteligentes'),
('Accesorios', 'Cables, adaptadores y otros accesorios');

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, stock, category_id, image) VALUES 
('Laptop HP Pavilion', 'Laptop HP Pavilion 15.6", Intel Core i5, 8GB RAM, 512GB SSD', 4999.99, 10, 1, '/images/laptop-hp.jpg'),
('Monitor Samsung 24"', 'Monitor Samsung 24" Full HD, 75Hz, HDMI', 1299.99, 15, 2, '/images/monitor-samsung.jpg'),
('Teclado Mecánico Logitech', 'Teclado Mecánico Logitech G Pro, RGB, Switches GX Blue', 799.99, 8, 3, '/images/teclado-logitech.jpg'),
('Mouse Gamer Razer', 'Mouse Gamer Razer DeathAdder V2, 20000 DPI, RGB', 349.99, 20, 3, '/images/mouse-razer.jpg'),
('Smartphone Samsung Galaxy S23', 'Smartphone Samsung Galaxy S23, 8GB RAM, 256GB, 5G', 5999.99, 5, 4, '/images/samsung-s23.jpg');
