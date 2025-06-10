"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash, Package, AlertTriangle, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Product {
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
  sold_quantity: number
  revenue: number
}

interface Category {
  id: number
  name: string
}

export default function ManagerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: 1,
    image: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const mockCategoriesData: Category[] = [
      { id: 1, name: "Laptops" },
      { id: 2, name: "Monitores" },
      { id: 3, name: "Periféricos" },
      { id: 4, name: "Smartphones" },
      { id: 5, name: "Accesorios" },
    ]

    const mockProducts: Product[] = [
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
        sold_quantity: 25,
        revenue: 124999.75,
      },
      {
        id: 2,
        name: 'Monitor Samsung 24"',
        description: 'Monitor Samsung 24" Full HD, 75Hz, HDMI',
        price: 1299.99,
        stock: 3,
        category: "Monitores",
        category_id: 2,
        image: "/placeholder.svg?height=100&width=100",
        active: true,
        created_at: "2025-05-02",
        sold_quantity: 30,
        revenue: 38999.7,
      },
      {
        id: 3,
        name: "Teclado Mecánico Logitech",
        description: "Teclado Mecánico Logitech G Pro, RGB, Switches GX Blue",
        price: 799.99,
        stock: 0,
        category: "Periféricos",
        category_id: 3,
        image: "/placeholder.svg?height=100&width=100",
        active: true,
        created_at: "2025-05-03",
        sold_quantity: 20,
        revenue: 15999.8,
      },
      {
        id: 4,
        name: "Mouse Gamer Razer",
        description: "Mouse Gamer Razer DeathAdder V2, 20000 DPI, RGB",
        price: 349.99,
        stock: 20,
        category: "Periféricos",
        category_id: 3,
        image: "/placeholder.svg?height=100&width=100",
        active: true,
        created_at: "2025-05-04",
        sold_quantity: 45,
        revenue: 15749.55,
      },
      {
        id: 5,
        name: "Smartphone Samsung Galaxy S23",
        description: "Smartphone Samsung Galaxy S23, 8GB RAM, 256GB, 5G",
        price: 5999.99,
        stock: 5,
        category: "Smartphones",
        category_id: 4,
        image: "/placeholder.svg?height=100&width=100",
        active: false,
        created_at: "2025-05-05",
        sold_quantity: 15,
        revenue: 89999.85,
      },
      {
        id: 6,
        name: "Cable HDMI 4K",
        description: "Cable HDMI 4K Ultra HD, 2 metros, alta velocidad",
        price: 89.99,
        stock: 50,
        category: "Accesorios",
        category_id: 5,
        image: "/placeholder.svg?height=100&width=100",
        active: true,
        created_at: "2025-05-06",
        sold_quantity: 80,
        revenue: 7199.2,
      },
    ]

    setProducts(mockProducts)

    // Initialize categories
    setCategories(mockCategoriesData)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && product.stock > 0 && product.stock <= 5) ||
      (stockFilter === "out" && product.stock === 0) ||
      (stockFilter === "available" && product.stock > 5)

    return matchesSearch && matchesCategory && matchesStock
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: 1,
      image: "",
    })
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(formData.price)
    const stock = Number.parseInt(formData.stock)

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "El precio debe ser un número válido mayor a 0",
        variant: "destructive",
      })
      return
    }

    if (isNaN(stock) || stock < 0) {
      toast({
        title: "Error",
        description: "El stock debe ser un número válido mayor o igual a 0",
        variant: "destructive",
      })
      return
    }

    const category = categories.find((c) => c.id === formData.category_id)

    const newProduct: Product = {
      id: products.length + 1,
      name: formData.name,
      description: formData.description,
      price: price,
      stock: stock,
      category: category?.name || "",
      category_id: formData.category_id,
      image: formData.image || "/placeholder.svg?height=100&width=100",
      active: true,
      created_at: new Date().toISOString().split("T")[0],
      sold_quantity: 0,
      revenue: 0,
    }

    setProducts([...products, newProduct])
    resetForm()
    setIsAddDialogOpen(false)

    toast({
      title: "✅ Producto creado",
      description: "El producto ha sido creado exitosamente",
    })
  }

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentProduct) return

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(formData.price)
    const stock = Number.parseInt(formData.stock)

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "El precio debe ser un número válido mayor a 0",
        variant: "destructive",
      })
      return
    }

    if (isNaN(stock) || stock < 0) {
      toast({
        title: "Error",
        description: "El stock debe ser un número válido mayor o igual a 0",
        variant: "destructive",
      })
      return
    }

    const category = categories.find((c) => c.id === formData.category_id)

    const updatedProducts = products.map((product) =>
      product.id === currentProduct.id
        ? {
            ...product,
            name: formData.name,
            description: formData.description,
            price: price,
            stock: stock,
            category: category?.name || "",
            category_id: formData.category_id,
            image: formData.image || product.image,
          }
        : product,
    )

    setProducts(updatedProducts)
    setIsEditDialogOpen(false)

    toast({
      title: "✅ Producto actualizado",
      description: "Los datos del producto han sido actualizados",
    })
  }

  const handleDeleteProduct = () => {
    if (!currentProduct) return

    const updatedProducts = products.filter((product) => product.id !== currentProduct.id)
    setProducts(updatedProducts)
    setIsDeleteDialogOpen(false)

    toast({
      title: "🗑️ Producto eliminado",
      description: "El producto ha sido eliminado del sistema",
    })
  }

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id,
      image: product.image,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const toggleProductStatus = (productId: number) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, active: !product.active } : product,
    )
    setProducts(updatedProducts)

    toast({
      title: "🔄 Estado actualizado",
      description: "El estado del producto ha sido actualizado",
    })
  }

  // Calcular estadísticas
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.active).length
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const outOfStockProducts = products.filter((p) => p.stock === 0).length
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)

  return (
    <div className="space-y-8">
      {/* Header mejorado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Gestión de Productos
          </h1>
          <p className="text-gray-600">
            Administre el catálogo y analice el rendimiento de productos como Jefe de Ventas
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Crear Nuevo Producto</DialogTitle>
              <DialogDescription>Complete la información del producto</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right font-medium">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Nombre del producto"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right font-medium">
                    Descripción <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                    placeholder="Descripción detallada del producto"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right font-medium">
                    Precio (Bs.) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right font-medium">
                    Stock <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Cantidad en inventario"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category_id" className="text-right font-medium">
                    Categoría <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleSelectChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right font-medium">
                    URL Imagen
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="URL de la imagen del producto"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700">
                  Crear Producto
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas mejoradas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Productos</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{totalProducts}</div>
            <p className="text-xs text-blue-600 mt-1">Productos registrados</p>
            <Progress value={(activeProducts / totalProducts) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Productos Activos</CardTitle>
            <Package className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{activeProducts}</div>
            <p className="text-xs text-green-600 mt-1">Productos disponibles</p>
            <Progress value={(activeProducts / totalProducts) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Stock Bajo</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">{lowStockProducts}</div>
            <p className="text-xs text-yellow-600 mt-1">Stock &le; 5 unidades</p>
            <Progress value={(lowStockProducts / totalProducts) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Agotados</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">{outOfStockProducts}</div>
            <p className="text-xs text-red-600 mt-1">Sin stock</p>
            <Progress value={(outOfStockProducts / totalProducts) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Ingresos</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">Bs. {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-purple-600 mt-1">Ingresos por ventas</p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabla de productos mejorada */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="text-xl">Catálogo de Productos</CardTitle>
          <CardDescription>Gestione productos con análisis de ventas y control de inventario</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">Todo el stock</option>
              <option value="available">Disponible (&gt;5)</option>
              <option value="low">Stock bajo (&le;5)</option>
              <option value="out">Agotado (0)</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Producto</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Descripción</TableHead>
                <TableHead className="font-semibold">Precio</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="hidden lg:table-cell font-semibold">Vendidos</TableHead>
                <TableHead className="hidden lg:table-cell font-semibold">Ingresos</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.category}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs">
                      <div className="text-sm text-gray-600 line-clamp-2">{product.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-green-600">Bs. {product.price.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.stock === 0
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                            : product.stock <= 5
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                              : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        }
                      >
                        {product.stock}
                        {product.stock === 0 && " (Agotado)"}
                        {product.stock > 0 && product.stock <= 5 && " (Bajo)"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm font-medium">{product.sold_quantity} unidades</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm font-bold text-blue-600">Bs. {product.revenue.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleProductStatus(product.id)}>
                        <Badge
                          className={
                            product.active
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                          }
                        >
                          {product.active ? "✅ Activo" : "❌ Inactivo"}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(product)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      No se encontraron productos
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar Producto</DialogTitle>
            <DialogDescription>Actualice la información del producto</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right font-medium">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right font-medium">
                  Descripción <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right font-medium">
                  Precio (Bs.) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock" className="text-right font-medium">
                  Stock <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category_id" className="text-right font-medium">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <select
                  id="edit-category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleSelectChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right font-medium">
                  URL Imagen
                </Label>
                <Input
                  id="edit-image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="URL de la imagen del producto"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700">
                Actualizar Producto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">⚠️ Confirmar Eliminación</DialogTitle>
            <DialogDescription className="text-base">
              ¿Está seguro que desea eliminar el producto <strong>{currentProduct?.name}</strong>? Esta acción no se
              puede deshacer y se perderán todos los datos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteProduct}
              className="bg-gradient-to-r from-red-600 to-red-700"
            >
              Eliminar Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
