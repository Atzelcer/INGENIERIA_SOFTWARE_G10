// Sistema de almacenamiento local para persistencia de datos

export interface User {
  id: number
  username: string
  name: string
  email: string
  role_id: number
  role_name: string
  active: boolean
  permissions: string[]
  created_at: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  category_id: number
  image: string
  active: boolean
  created_at: string
}

export interface Client {
  id: number
  name: string
  document: string
  email: string
  phone: string
  address: string
  type: string
  created_at: string
}

// Funciones para usuarios
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("techstore_users")
  return users ? JSON.parse(users) : getDefaultUsers()
}

export const saveUsers = (users: User[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("techstore_users", JSON.stringify(users))
}

export const addUser = (user: Omit<User, "id" | "created_at">): User => {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    created_at: new Date().toISOString().split("T")[0],
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export const updateUser = (id: number, userData: Partial<User>): User | null => {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null

  users[index] = { ...users[index], ...userData }
  saveUsers(users)
  return users[index]
}

export const deleteUser = (id: number): boolean => {
  const users = getUsers()
  const filteredUsers = users.filter((u) => u.id !== id)
  if (filteredUsers.length === users.length) return false

  saveUsers(filteredUsers)
  return true
}

// Funciones para productos
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []
  const products = localStorage.getItem("techstore_products")
  return products ? JSON.parse(products) : getDefaultProducts()
}

export const saveProducts = (products: Product[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("techstore_products", JSON.stringify(products))
}

export const addProduct = (product: Omit<Product, "id" | "created_at">): Product => {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    id: Math.max(...products.map((p) => p.id), 0) + 1,
    created_at: new Date().toISOString().split("T")[0],
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

export const updateProduct = (id: number, productData: Partial<Product>): Product | null => {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null

  products[index] = { ...products[index], ...productData }
  saveProducts(products)
  return products[index]
}

export const deleteProduct = (id: number): boolean => {
  const products = getProducts()
  const filteredProducts = products.filter((p) => p.id !== id)
  if (filteredProducts.length === products.length) return false

  saveProducts(filteredProducts)
  return true
}

// Funciones para clientes
export const getClients = (): Client[] => {
  if (typeof window === "undefined") return []
  const clients = localStorage.getItem("techstore_clients")
  return clients ? JSON.parse(clients) : getDefaultClients()
}

export const saveClients = (clients: Client[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("techstore_clients", JSON.stringify(clients))
}

export const addClient = (client: Omit<Client, "id" | "created_at">): Client => {
  const clients = getClients()
  const newClient: Client = {
    ...client,
    id: Math.max(...clients.map((c) => c.id), 0) + 1,
    created_at: new Date().toISOString().split("T")[0],
  }
  clients.push(newClient)
  saveClients(clients)
  return newClient
}

export const updateClient = (id: number, clientData: Partial<Client>): Client | null => {
  const clients = getClients()
  const index = clients.findIndex((c) => c.id === id)
  if (index === -1) return null

  clients[index] = { ...clients[index], ...clientData }
  saveClients(clients)
  return clients[index]
}

export const deleteClient = (id: number): boolean => {
  const clients = getClients()
  const filteredClients = clients.filter((c) => c.id !== id)
  if (filteredClients.length === clients.length) return false

  saveClients(filteredClients)
  return true
}

// Datos por defecto
const getDefaultUsers = (): User[] => [
  {
    id: 1,
    username: "admin",
    name: "Administrador",
    email: "admin@techstore.com",
    role_id: 1,
    role_name: "Administrador",
    active: true,
    permissions: [
      "crear_usuarios",
      "editar_usuarios",
      "eliminar_usuarios",
      "ver_usuarios",
      "crear_productos",
      "editar_productos",
      "ver_productos",
      "registrar_clientes",
      "ver_clientes",
      "editar_clientes",
      "emitir_facturas",
      "ver_facturas",
      "anular_factura",
      "generar_pdf_factura",
      "ver_reportes",
    ],
    created_at: "2025-01-01",
  },
  {
    id: 2,
    username: "jefe",
    name: "Jefe de Ventas",
    email: "jefe@techstore.com",
    role_id: 2,
    role_name: "Jefe de Ventas",
    active: true,
    permissions: [
      "crear_usuarios",
      "ver_usuarios",
      "crear_productos",
      "editar_productos",
      "ver_productos",
      "registrar_clientes",
      "ver_clientes",
      "editar_clientes",
      "emitir_facturas",
      "ver_facturas",
      "ver_reportes",
    ],
    created_at: "2025-01-02",
  },
  {
    id: 3,
    username: "vendedor",
    name: "Vendedor",
    email: "vendedor@techstore.com",
    role_id: 3,
    role_name: "Vendedor",
    active: true,
    permissions: ["registrar_clientes", "ver_clientes", "ver_productos", "emitir_facturas", "ver_facturas"],
    created_at: "2025-01-03",
  },
]

const getDefaultProducts = (): Product[] => [
  {
    id: 1,
    name: "Laptop HP Pavilion",
    description: 'Laptop HP Pavilion 15.6", Intel Core i5, 8GB RAM, 512GB SSD',
    price: 4999.99,
    stock: 10,
    category: "Laptops",
    category_id: 1,
    image: "/placeholder.svg?height=100&width=100",
    active: true,
    created_at: "2025-05-01",
  },
  {
    id: 2,
    name: 'Monitor Samsung 24"',
    description: 'Monitor Samsung 24" Full HD, 75Hz, HDMI',
    price: 1299.99,
    stock: 15,
    category: "Monitores",
    category_id: 2,
    image: "/placeholder.svg?height=100&width=100",
    active: true,
    created_at: "2025-05-02",
  },
]

const getDefaultClients = (): Client[] => [
  {
    id: 1,
    name: "Juan Pérez",
    document: "12345678",
    email: "juan@email.com",
    phone: "70123456",
    address: "Av. Principal 123",
    type: "regular",
    created_at: "2025-01-01",
  },
  {
    id: 2,
    name: "María González",
    document: "87654321",
    email: "maria@email.com",
    phone: "70654321",
    address: "Calle Secundaria 456",
    type: "vip",
    created_at: "2025-01-02",
  },
]
