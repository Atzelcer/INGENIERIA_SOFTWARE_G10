"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, Package, FileText, TrendingUp, Target, Award, Clock, BarChart3, ShoppingCart } from "lucide-react"

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    teamMembers: 0,
    monthlyTarget: 0,
    currentSales: 0,
    completedSales: 0,
    teamPerformance: 0,
    topSeller: "",
    pendingTasks: 0,
    clientsSatisfaction: 0,
  })

  useEffect(() => {
    setTimeout(() => {
      setStats({
        teamMembers: 8,
        monthlyTarget: 50000,
        currentSales: 32500,
        completedSales: 145,
        teamPerformance: 85,
        topSeller: "Carlos Mendoza",
        pendingTasks: 5,
        clientsSatisfaction: 92,
      })
    }, 1000)
  }, [])

  const teamMembers = [
    { name: "Carlos Mendoza", sales: 8500, target: 10000, performance: 85 },
    { name: "Ana López", sales: 7200, target: 8000, performance: 90 },
    { name: "Pedro Ruiz", sales: 6800, target: 8000, performance: 85 },
    { name: "María Silva", sales: 5900, target: 7000, performance: 84 },
  ]

  const quickActions = [
    { title: "Gestionar Vendedores", href: "/dashboard/manager/users", icon: Users, color: "bg-blue-500" },
    { title: "Supervisar Productos", href: "/dashboard/manager/products", icon: Package, color: "bg-green-500" },
    { title: "Revisar Facturas", href: "/dashboard/manager/invoices", icon: FileText, color: "bg-purple-500" },
    { title: "Ver Reportes", href: "/dashboard/manager/reports", icon: BarChart3, color: "bg-orange-500" },
  ]

  const progressPercentage = (stats.currentSales / stats.monthlyTarget) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Jefe de Ventas</h1>
          <p className="text-gray-600 mt-1">Supervisa y gestiona tu equipo de ventas</p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2">
          <Target className="w-4 h-4 mr-2" />
          Jefe de Ventas
        </Badge>
      </div>

      {/* Objetivo mensual */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Objetivo Mensual
          </CardTitle>
          <CardDescription>Progreso del equipo hacia la meta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">Bs. {stats.currentSales.toLocaleString()}</span>
              <span className="text-lg text-gray-600">/ Bs. {stats.monthlyTarget.toLocaleString()}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{progressPercentage.toFixed(1)}% completado</span>
              <span>Faltan Bs. {(stats.monthlyTarget - stats.currentSales).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas del equipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros del Equipo</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Todos activos</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Completadas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSales}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12% vs mes anterior</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendimiento Equipo</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamPerformance}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Excelente desempeño</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción Cliente</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clientsSatisfaction}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Muy satisfechos</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento del equipo y acciones rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendimiento individual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Rendimiento del Equipo
            </CardTitle>
            <CardDescription>Desempeño individual de cada vendedor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{member.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Bs. {member.sales.toLocaleString()} / {member.target.toLocaleString()}
                      </span>
                      <Badge
                        variant={
                          member.performance >= 90 ? "default" : member.performance >= 80 ? "secondary" : "outline"
                        }
                      >
                        {member.performance}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(member.sales / member.target) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Gestiona tu equipo eficientemente</CardDescription>
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
      </div>

      {/* Destacado del mes */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <Award className="h-5 w-5" />
            Vendedor Destacado del Mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
            <div className="p-3 bg-yellow-500 rounded-full">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{stats.topSeller}</h3>
              <p className="text-gray-600">Ha superado su objetivo mensual en un 15%</p>
              <p className="text-sm text-yellow-600 font-medium">¡Excelente trabajo!</p>
            </div>
            <Badge className="bg-yellow-500 text-white">Top Seller</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
