"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, TrendingUp, Users, FileText, Download, Calendar, Target } from "lucide-react"

export default function ManagerReportsPage() {
  const [dateFrom, setDateFrom] = useState("2025-06-01")
  const [dateTo, setDateTo] = useState("2025-06-10")

  // Datos simulados para reportes del jefe de ventas
  const salesData = [
    { date: "2025-06-01", sales: 15, amount: 12500.0, seller: "María González" },
    { date: "2025-06-02", sales: 8, amount: 6800.0, seller: "Juan Pérez" },
    { date: "2025-06-03", sales: 12, amount: 9200.0, seller: "Carlos López" },
    { date: "2025-06-04", sales: 20, amount: 18500.0, seller: "María González" },
    { date: "2025-06-05", sales: 6, amount: 4200.0, seller: "Ana Martínez" },
    { date: "2025-06-06", sales: 18, amount: 15800.0, seller: "Juan Pérez" },
    { date: "2025-06-07", sales: 14, amount: 11200.0, seller: "Carlos López" },
    { date: "2025-06-08", sales: 22, amount: 19600.0, seller: "María González" },
    { date: "2025-06-09", sales: 10, amount: 8500.0, seller: "Ana Martínez" },
    { date: "2025-06-10", sales: 16, amount: 13400.0, seller: "Juan Pérez" },
  ]

  const topProducts = [
    { name: "Laptop HP Pavilion", sold: 25, revenue: 124999.75, margin: 15.5 },
    { name: "Smartphone Samsung Galaxy S23", sold: 15, revenue: 89999.85, margin: 18.2 },
    { name: 'Monitor Samsung 24"', sold: 30, revenue: 38999.7, margin: 12.8 },
    { name: "Mouse Gamer Razer", sold: 45, revenue: 15749.55, margin: 22.1 },
    { name: "Teclado Mecánico Logitech", sold: 20, revenue: 15999.8, margin: 19.3 },
  ]

  const sellerPerformance = [
    {
      name: "María González",
      sales: 55,
      revenue: 95000.0,
      clients: 28,
      target: 80000.0,
      achievement: 118.8,
      avgTicket: 1727.27,
    },
    {
      name: "Juan Pérez",
      sales: 42,
      revenue: 72000.0,
      clients: 22,
      target: 70000.0,
      achievement: 102.9,
      avgTicket: 1714.29,
    },
    {
      name: "Carlos López",
      sales: 38,
      revenue: 58000.0,
      clients: 18,
      target: 60000.0,
      achievement: 96.7,
      avgTicket: 1526.32,
    },
    {
      name: "Ana Martínez",
      sales: 28,
      revenue: 45000.0,
      clients: 15,
      target: 50000.0,
      achievement: 90.0,
      avgTicket: 1607.14,
    },
  ]

  const clientActivity = [
    { name: "Empresa XYZ", purchases: 8, total: 45000.0, lastPurchase: "2025-06-09", seller: "María González" },
    { name: "Juan Pérez", purchases: 5, total: 28000.0, lastPurchase: "2025-06-08", seller: "Juan Pérez" },
    { name: "María López", purchases: 12, total: 35000.0, lastPurchase: "2025-06-07", seller: "Carlos López" },
    { name: "Comercial ABC", purchases: 6, total: 22000.0, lastPurchase: "2025-06-06", seller: "Ana Martínez" },
  ]

  const teamGoals = [
    { metric: "Ventas Mensuales", target: 260000, current: 270000, unit: "Bs." },
    { metric: "Número de Facturas", target: 150, current: 163, unit: "" },
    { metric: "Nuevos Clientes", target: 25, current: 28, unit: "" },
    { metric: "Ticket Promedio", target: 1500, current: 1656, unit: "Bs." },
  ]

  const totalSales = salesData.reduce((sum, item) => sum + item.amount, 0)
  const totalTransactions = salesData.reduce((sum, item) => sum + item.sales, 0)
  const averageTicket = totalSales / totalTransactions
  const teamRevenue = sellerPerformance.reduce((sum, seller) => sum + seller.revenue, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reportes y Estadísticas (Jefe)</h2>
        <p className="text-muted-foreground">Análisis del rendimiento del equipo de ventas y objetivos</p>
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
            <CardTitle className="text-sm font-medium">Ventas del Equipo</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {teamRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Emitidas</CardTitle>
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
            <CardTitle className="text-sm font-medium">Vendedores Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerPerformance.length}</div>
            <p className="text-xs text-muted-foreground">Equipo completo</p>
          </CardContent>
        </Card>
      </div>

      {/* Objetivos del equipo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objetivos del Equipo
          </CardTitle>
          <CardDescription>Progreso hacia las metas mensuales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teamGoals.map((goal, index) => {
              const percentage = (goal.current / goal.target) * 100
              const isAchieved = percentage >= 100

              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium">{goal.metric}</div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${isAchieved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {goal.unit}
                    {goal.current.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Meta: {goal.unit}
                    {goal.target.toLocaleString()}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${isAchieved ? "bg-green-600" : "bg-blue-600"}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reportes detallados */}
      <Tabs defaultValue="sellers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sellers">Vendedores</TabsTrigger>
          <TabsTrigger value="sales">Ventas Diarias</TabsTrigger>
          <TabsTrigger value="products">Productos Top</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="sellers">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Vendedores</CardTitle>
              <CardDescription>Estadísticas detalladas del equipo de ventas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Nº Ventas</TableHead>
                    <TableHead>Ingresos</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead>Cumplimiento</TableHead>
                    <TableHead>Ticket Promedio</TableHead>
                    <TableHead className="text-right">Clientes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellerPerformance.map((seller, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{seller.name}</TableCell>
                      <TableCell>{seller.sales}</TableCell>
                      <TableCell>Bs. {seller.revenue.toLocaleString()}</TableCell>
                      <TableCell>Bs. {seller.target.toLocaleString()}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            seller.achievement >= 100
                              ? "bg-green-100 text-green-800"
                              : seller.achievement >= 90
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {seller.achievement.toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>Bs. {seller.avgTicket.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{seller.clients}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

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
              <CardDescription>Ranking de productos por cantidad vendida, ingresos y margen</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posición</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad Vendida</TableHead>
                    <TableHead>Ingresos</TableHead>
                    <TableHead className="text-right">Margen %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sold} unidades</TableCell>
                      <TableCell>Bs. {product.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.margin >= 20
                              ? "bg-green-100 text-green-800"
                              : product.margin >= 15
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.margin}%
                        </div>
                      </TableCell>
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
              <CardDescription>Clientes más activos y vendedor asignado</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Nº Compras</TableHead>
                    <TableHead>Total Gastado</TableHead>
                    <TableHead>Vendedor Asignado</TableHead>
                    <TableHead className="text-right">Última Compra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientActivity.map((client, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.purchases}</TableCell>
                      <TableCell>Bs. {client.total.toLocaleString()}</TableCell>
                      <TableCell>{client.seller}</TableCell>
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
