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
import { Search, Plus, Edit, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { getProducts, addProduct, updateProduct, deleteProduct, type Product } from "@/lib/storage"

interface Category {
  id: number
  name: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
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

  // Cargar datos (simulado)
  useEffect(() => {
    const loadedProducts = getProducts()
    setProducts(loadedProducts)

    // Initialize categories
    const mockCategories: Category[] = [
      { id: 1, name: "Laptops" },
      { id: 2, name: "Monitores" },
      { id: 3, name: "Periféricos" },
      { id: 4, name: "Smartphones" },
      { id: 5, name: "Accesorios" },
    ]
    setCategories(mockCategories)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory

    return matchesSearch && matchesCategory
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
    }

    addProduct(newProduct)
    setProducts(getProducts())
    resetForm()
    setIsAddDialogOpen(false)

    toast({
      title: "Producto creado",
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

    const updatedProduct: Product = {
      id: currentProduct.id,
      name: formData.name,
      description: formData.description,
      price: price,
      stock: stock,
      category: category?.name || "",
      category_id: formData.category_id,
      image: formData.image || currentProduct.image,
      active: currentProduct.active,
      created_at: currentProduct.created_at,
    }

    updateProduct(updatedProduct)
    setProducts(getProducts())
    setIsEditDialogOpen(false)

    toast({
      title: "Producto actualizado",
      description: "Los datos del producto han sido actualizados",
    })
  }

  const handleDeleteProduct = () => {
    if (!currentProduct) return

    deleteProduct(currentProduct.id)
    setProducts(getProducts())
    setIsDeleteDialogOpen(false)

    toast({
      title: "Producto eliminado",
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
    updateProduct(updatedProducts.find((p) => p.id === productId)!)
    setProducts(getProducts())

    toast({
      title: "Estado actualizado",
      description: "El estado del producto ha sido actualizado",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Productos</h2>
          <p className="text-muted-foreground">Administre el catálogo de productos de la tienda</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Producto</DialogTitle>
              <DialogDescription>Complete la información del producto</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descripción <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
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
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
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
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category_id" className="text-right">
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
                  <Label htmlFor="image" className="text-right">
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
                <Button type="submit">Crear Producto</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos</CardTitle>
          <CardDescription>Gestione los productos disponibles en la tienda</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
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
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">{product.description}</TableCell>
                    <TableCell>Bs. {product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 5 ? "default" : product.stock > 0 ? "outline" : "destructive"}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleProductStatus(product.id)}>
                        <Badge variant={product.active ? "default" : "destructive"}>
                          {product.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(product)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No se encontraron productos
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
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>Actualice la información del producto</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
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
                <Label htmlFor="edit-description" className="text-right">
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
                <Label htmlFor="edit-price" className="text-right">
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
                <Label htmlFor="edit-stock" className="text-right">
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
                <Label htmlFor="edit-category_id" className="text-right">
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
                <Label htmlFor="edit-image" className="text-right">
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
              <Button type="submit">Actualizar Producto</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el producto {currentProduct?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteProduct}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
