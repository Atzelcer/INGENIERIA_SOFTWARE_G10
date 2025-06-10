"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  image: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])

  // Cargar datos de productos (simulado)
  useEffect(() => {
    // En un caso real, esto sería una llamada a la API
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Laptop HP Pavilion",
        description: 'Laptop HP Pavilion 15.6", Intel Core i5, 8GB RAM, 512GB SSD',
        price: 4999.99,
        stock: 10,
        category: "Laptops",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        name: 'Monitor Samsung 24"',
        description: 'Monitor Samsung 24" Full HD, 75Hz, HDMI',
        price: 1299.99,
        stock: 15,
        category: "Monitores",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        name: "Teclado Mecánico Logitech",
        description: "Teclado Mecánico Logitech G Pro, RGB, Switches GX Blue",
        price: 799.99,
        stock: 8,
        category: "Periféricos",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 4,
        name: "Mouse Gamer Razer",
        description: "Mouse Gamer Razer DeathAdder V2, 20000 DPI, RGB",
        price: 349.99,
        stock: 20,
        category: "Periféricos",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        name: "Smartphone Samsung Galaxy S23",
        description: "Smartphone Samsung Galaxy S23, 8GB RAM, 256GB, 5G",
        price: 5999.99,
        stock: 5,
        category: "Smartphones",
        image: "/placeholder.svg?height=100&width=100",
      },
    ]
    setProducts(mockProducts)

    // Extraer categorías únicas
    const uniqueCategories = Array.from(new Set(mockProducts.map((product) => product.category)))
    setCategories(uniqueCategories)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Catálogo de Productos</h2>
        <p className="text-muted-foreground">Consulte los productos disponibles para la venta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Productos disponibles en inventario</CardDescription>
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
                <option key={category} value={category}>
                  {category}
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
                <TableHead className="hidden md:table-cell">Categoría</TableHead>
                <TableHead className="text-right">Acción</TableHead>
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
                      {product.stock > 0 ? (
                        <Badge variant={product.stock > 5 ? "default" : "outline"}>{product.stock}</Badge>
                      ) : (
                        <Badge variant="destructive">Agotado</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={product.stock <= 0}
                        onClick={() => {
                          // Aquí iría la lógica para agregar a la factura
                          // Por ahora solo mostramos un mensaje
                          alert(`Producto ${product.name} seleccionado para facturación`)
                        }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
