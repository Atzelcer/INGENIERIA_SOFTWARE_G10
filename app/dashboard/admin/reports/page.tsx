"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, TrendingUp, Users, FileText, Download, Calendar } from "lucide-react"

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState("2025-06-01")
  const [dateTo, setDateTo] = useState("2025-06-10")

  // Datos simulados para reportes
  const salesData = [
    { date: "2025-06-01", sales: 15, amount: 12500.0, seller: "Juan Pérez" },
    { date: "2025-06-02", sales: 8, amount: 6800.0, seller: "María González" },
    { date: "2025-06-03", sales: 12, amount: 9200.0, seller: "Juan Pérez" },
    { date: "2025-06-04", sales: 20, amount: 18500.0, seller: "María González" },
    { date: "2025-06-05", sales: 6, amount: 4200.0, seller: "Juan Pérez" },
  ]

  const topProducts = [
    { name: "Laptop HP Pavilion", sold: 25, revenue: 124999.75 },
    { name: "Smartphone Samsung Galaxy S23", sold: 15, revenue: 89999.85 },
    { name: 'Monitor Samsung 24"', sold: 30, revenue: 38999.7 },
    { name: "Mouse Gamer Razer", sold: 45, revenue: 15749.55 },
    { name: "Teclado Mecánico Logitech", sold: 20, revenue: 15999.8 },
  ]

  const sellerPerformance = [
    { name: "Juan Pérez", sales: 45, revenue: 85000.0, clients: 28 },
    { name: "María González", sales: 38, revenue: 72000.0, clients: 22 },
    { name: "Carlos López", sales: 32, revenue: 58000.0, clients: 18 },
    { name: "Ana Martínez", sales: 28, revenue: 45000.0, clients: 15 },
  ]

  const clientActivity = [
    { name: "Empresa XYZ", purchases: 8, total: 45000.0, lastPurchase: "2025-06-09" },
    { name: "Juan Pérez", purchases: 5, total: 28000.0, lastPurchase: "2025-06-08" },
    { name: "María López", purchases: 12, total: 35000.0, lastPurchase: "2025-06-07" },
    { name: "Comercial ABC", purchases: 6, total: 22000.0, lastPurchase: "2025-06-06" },
  ]

  const totalSales = salesData.reduce((sum, item) => sum + item.amount, 0)
  const totalTransactions = salesData.reduce((sum, item) => sum + item.sales, 0)
  const averageTicket = totalSales / totalTransactions

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reportes y Estadísticas</h2>
        <p className="text-muted-foreground">Análisis detallado de ventas, productos y rendimiento</p>
      </div>

      {/* Filtros de fecha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros de Fecha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Fecha Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Fecha Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
            <Button>Aplicar Filtros</Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {averageTicket.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83</div>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      {/* Reportes detallados */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Ventas Diarias</TabsTrigger>
          <TabsTrigger value="products">Productos Top</TabsTrigger>
          <TabsTrigger value="sellers">Vendedores</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Ventas Diarias</CardTitle>
              <CardDescription>Ventas realizadas por día y vendedor</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Nº Ventas</TableHead>
                    <TableHead className="text-right">Monto Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell>{item.seller}</TableCell>
                      <TableCell>{item.sales}</TableCell>
                      <TableCell className="text-right">Bs. {item.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={2} className="font-bold">
                      TOTAL
                    </TableCell>
                    <TableCell className="font-bold">{totalTransactions}</TableCell>
                    <TableCell className="text-right font-bold">Bs. {totalSales.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>Ranking de productos por cantidad vendida y ingresos generados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posición</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad Vendida</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sold} unidades</TableCell>
                      <TableCell className="text-right">Bs. {product.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sellers">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Vendedores</CardTitle>
              <CardDescription>Estadísticas de ventas por vendedor</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Nº Ventas</TableHead>
                    <TableHead>Ingresos</TableHead>
                    <TableHead className="text-right">Clientes Atendidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellerPerformance.map((seller, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{seller.name}</TableCell>
                      <TableCell>{seller.sales}</TableCell>
                      <TableCell>Bs. {seller.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{seller.clients}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Actividad de Clientes</CardTitle>
              <CardDescription>Clientes más activos y sus compras</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Nº Compras</TableHead>
                    <TableHead>Total Gastado</TableHead>
                    <TableHead className="text-right">Última Compra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientActivity.map((client, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.purchases}</TableCell>
                      <TableCell>Bs. {client.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{client.lastPurchase}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
