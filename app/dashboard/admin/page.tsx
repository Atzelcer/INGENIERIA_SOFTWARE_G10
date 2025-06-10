"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Package,
  FileText,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    activeUsers: 0,
    lowStockProducts: 0,
    pendingInvoices: 0,
    monthlyGrowth: 0,
  })

  useEffect(() => {
    // Simular carga de estadísticas
    setTimeout(() => {
      setStats({
        totalUsers: 45,
        totalProducts: 1250,
        totalInvoices: 3420,
        totalRevenue: 125000,
        activeUsers: 38,
        lowStockProducts: 23,
        pendingInvoices: 12,
        monthlyGrowth: 15.2,
      })
    }, 1000)
  }, [])

  const quickActions = [
    { title: "Crear Usuario", href: "/dashboard/admin/users", icon: Users, color: "bg-blue-500" },
    { title: "Agregar Producto", href: "/dashboard/admin/products", icon: Package, color: "bg-green-500" },
    { title: "Nueva Factura", href: "/dashboard/admin/invoices", icon: FileText, color: "bg-purple-500" },
    { title: "Ver Reportes", href: "/dashboard/admin/reports", icon: BarChart3, color: "bg-orange-500" },
  ]

  const recentActivity = [
    { action: "Usuario creado", user: "Juan Pérez", time: "Hace 5 min", type: "user" },
    { action: "Producto agregado", user: "Sistema", time: "Hace 15 min", type: "product" },
    { action: "Factura emitida", user: "María García", time: "Hace 30 min", type: "invoice" },
    { action: "Reporte generado", user: "Admin", time: "Hace 1 hora", type: "report" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">Bienvenido al panel de control principal</p>
        </div>
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2">
          <Users className="w-4 h-4 mr-2" />
          Administrador
        </Badge>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.activeUsers} activos</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">{stats.lowStockProducts} con stock bajo</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{stats.pendingInvoices} pendientes</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.monthlyGrowth}% este mes</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas y actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
                  onClick={() => (window.location.href = action.href)}
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "user"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "product"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "invoice"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {activity.type === "user" && <Users className="h-4 w-4" />}
                    {activity.type === "product" && <Package className="h-4 w-4" />}
                    {activity.type === "invoice" && <FileText className="h-4 w-4" />}
                    {activity.type === "report" && <BarChart3 className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-600">por {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas del sistema */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Alertas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Stock bajo en productos</p>
                <p className="text-xs text-red-600">{stats.lowStockProducts} productos necesitan reposición</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Facturas pendientes</p>
                <p className="text-xs text-yellow-600">{stats.pendingInvoices} facturas requieren atención</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Sistema funcionando correctamente</p>
                <p className="text-xs text-green-600">Todos los servicios están operativos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
