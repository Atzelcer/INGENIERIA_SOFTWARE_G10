"use client"

import type React from "react"
import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  LogOut,
  Menu,
  User,
  Package,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  Home,
  UserCheck,
  Package2,
  TrendingUp,
  Shield,
  Crown,
  Briefcase,
  Moon,
  Sun,
  HelpCircle,
  Activity,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  id: number
  name: string
  username: string
  role_id: number
  role_name: string
  permissions: string[]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(3)
  const [darkMode, setDarkMode] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser) as UserData
      setUser(userData)

      const currentPath = pathname
      const userRole = userData.role_id

      if (userRole === 1 && !currentPath.includes("/dashboard/admin")) {
        router.push("/dashboard/admin")
      } else if (userRole === 2 && !currentPath.includes("/dashboard/manager")) {
        router.push("/dashboard/manager")
      } else if (userRole === 3 && !currentPath.includes("/dashboard/seller")) {
        router.push("/dashboard/seller")
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      localStorage.removeItem("user")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [pathname, router])

  const handleLogout = () => {
    toast({
      title: "👋 Sesión cerrada",
      description: `Hasta luego, ${user?.name}. Has cerrado sesión exitosamente`,
    })
    localStorage.removeItem("user")
    setShowLogoutDialog(false)
    router.push("/login")
  }

  const confirmLogout = () => {
    setShowLogoutDialog(true)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-blue-100 opacity-20 mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Cargando TechStore</h3>
            <p className="text-gray-600">Preparando tu experiencia...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const hasPermission = (permission: string) => {
    return user.permissions.includes(permission)
  }

  const getRoleIcon = (roleId: number) => {
    switch (roleId) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Shield className="h-4 w-4 text-blue-500" />
      case 3:
        return <Briefcase className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (roleId: number) => {
    switch (roleId) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white shadow-lg"
      case 2:
        return "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white shadow-lg"
      case 3:
        return "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-lg"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getRoleDescription = (roleId: number) => {
    switch (roleId) {
      case 1:
        return "Control total del sistema"
      case 2:
        return "Gestión de equipo de ventas"
      case 3:
        return "Emisión de facturas y ventas"
      default:
        return "Usuario del sistema"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getOnlineStatus = () => {
    return "En línea"
  }

  const NavItems = () => (
    <>
      <Link
        href={user.role_id === 1 ? "/dashboard/admin" : user.role_id === 2 ? "/dashboard/manager" : "/dashboard/seller"}
        className="w-full"
      >
        <Button variant="ghost" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-all">
          <Home className="mr-3 h-4 w-4" />
          Dashboard
        </Button>
      </Link>

      {hasPermission("ver_usuarios") && (
        <Link href={user.role_id === 1 ? "/dashboard/admin/users" : "/dashboard/manager/users"} className="w-full">
          <Button variant="ghost" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-all">
            <Users className="mr-3 h-4 w-4" />
            {user.role_id === 1 ? "Usuarios" : "Vendedores"}
          </Button>
        </Link>
      )}

      {hasPermission("ver_clientes") && (
        <Link
          href={
            user.role_id === 1
              ? "/dashboard/admin/clients"
              : user.role_id === 2
                ? "/dashboard/manager/clients"
                : "/dashboard/seller/clients"
          }
          className="w-full"
        >
          <Button variant="ghost" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-all">
            <UserCheck className="mr-3 h-4 w-4" />
            Clientes
          </Button>
        </Link>
      )}

      {hasPermission("ver_productos") && (
        <Link
          href={
            user.role_id === 1
              ? "/dashboard/admin/products"
              : user.role_id === 2
                ? "/dashboard/manager/products"
                : "/dashboard/seller/products"
          }
          className="w-full"
        >
          <Button variant="ghost" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-all">
            <Package2 className="mr-3 h-4 w-4" />
            Productos
          </Button>
        </Link>
      )}

      {hasPermission("ver_facturas") && (
        <Link
          href={
            user.role_id === 1
              ? "/dashboard/admin/invoices"
              : user.role_id === 2
                ? "/dashboard/manager/invoices"
                : "/dashboard/seller/invoices"
          }
          className="w-full"
        >
          <Button variant="ghost" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-all">
            <FileText className="mr-3 h-4 w-4" />
            Facturas
          </Button>
        </Link>
      )}

      {hasPermission("ver_reportes") && (
        <Link href={user.role_id === 1 ? "/dashboard/admin/reports" : "/dashboard/manager/reports"} className="w-full">
          <Button variant="ghost" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-all">
            <TrendingUp className="mr-3 h-4 w-4" />
            Reportes
          </Button>
        </Link>
      )}
    </>
  )

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Premium - Layout Corregido */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-lg">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Lado Izquierdo: Logo + Menu Mobile */}
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 hover:bg-blue-50">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 sm:max-w-xs bg-gradient-to-b from-white to-blue-50">
                  <div className="flex flex-col gap-6 py-6">
                    <div className="px-2">
                      <h2 className="text-lg font-semibold text-gray-800">Navegación</h2>
                      <p className="text-sm text-gray-600">Accede a todas las funciones</p>
                    </div>
                    <nav className="flex flex-col gap-2">
                      <NavItems />
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  TechStore
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Sistema de Facturación Avanzado</p>
              </div>
            </div>
          </div>

          {/* Centro: Barra de búsqueda */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar clientes, productos, facturas..."
                className="pl-10 bg-gray-50/50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Lado Derecho: Notificaciones + Perfil */}
          <div className="flex items-center gap-4">
            {/* Notificaciones */}
            <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Información del usuario (solo desktop) */}
            <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2">
                  {getRoleIcon(user.role_id)}
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs px-2 py-1 ${getRoleBadgeColor(user.role_id)} border-0`}>
                    {user.role_name}
                  </Badge>
                  <span className="text-xs text-gray-500">{getOnlineStatus()}</span>
                </div>
              </div>
            </div>

            {/* Menú del usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-xl hover:bg-blue-50 transition-all">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-200 hover:ring-blue-400 transition-all">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-blue-700 text-white font-bold text-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role_id)}
                          <p className="text-base font-semibold leading-none">{user.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Badge className={`text-sm px-3 py-1 ${getRoleBadgeColor(user.role_id)} border-0`}>
                        {user.role_name}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{getRoleDescription(user.role_id)}</p>
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <Activity className="h-3 w-3" />
                        <span>{getOnlineStatus()}</span>
                        <span>• {user.permissions.length} permisos activos</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 hover:bg-blue-50">
                  <User className="mr-3 h-4 w-4 text-blue-600" />
                  <div>
                    <span className="font-medium">Mi Perfil</span>
                    <p className="text-xs text-gray-500">Configurar información personal</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-blue-50">
                  <Settings className="mr-3 h-4 w-4 text-gray-600" />
                  <div>
                    <span className="font-medium">Configuración</span>
                    <p className="text-xs text-gray-500">Preferencias del sistema</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-blue-50" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? (
                    <Sun className="mr-3 h-4 w-4 text-yellow-600" />
                  ) : (
                    <Moon className="mr-3 h-4 w-4 text-gray-600" />
                  )}
                  <div>
                    <span className="font-medium">{darkMode ? "Modo Claro" : "Modo Oscuro"}</span>
                    <p className="text-xs text-gray-500">Cambiar tema visual</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-blue-50">
                  <HelpCircle className="mr-3 h-4 w-4 text-blue-600" />
                  <div>
                    <span className="font-medium">Ayuda y Soporte</span>
                    <p className="text-xs text-gray-500">Documentación y contacto</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={confirmLogout} className="p-3 text-red-600 hover:bg-red-50 focus:bg-red-50">
                  <LogOut className="mr-3 h-4 w-4" />
                  <div>
                    <span className="font-medium">Cerrar Sesión</span>
                    <p className="text-xs text-red-500">Salir del sistema de forma segura</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar premium */}
        {!isMobile && (
          <aside className="w-72 border-r bg-white/50 backdrop-blur-sm shadow-lg">
            <div className="flex flex-col gap-6 p-6">
              <div className="px-2">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Navegación Principal</h2>
                <p className="text-xs text-gray-500 mt-1">Accede a todas las funciones del sistema</p>
              </div>
              <nav className="flex flex-col gap-2">
                <NavItems />
              </nav>

              {/* Información adicional premium */}
              <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="px-4 py-4 rounded-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    {getRoleIcon(user.role_id)}
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{user.role_name}</span>
                      <p className="text-xs text-gray-600">{getRoleDescription(user.role_id)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Permisos activos:</span>
                      <Badge variant="outline" className="text-xs">
                        {user.permissions.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">En línea</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <p className="text-gray-600">Cargando contenido...</p>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>

      {/* Dialog de confirmación de logout - CORREGIDO */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <LogOut className="h-5 w-5 text-red-600" />
              Confirmar Cierre de Sesión
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas cerrar tu sesión, {user.name}? Se cerrará tu sesión como {user.role_name} y
              tendrás que volver a iniciar sesión para acceder al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Cerrar Sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
