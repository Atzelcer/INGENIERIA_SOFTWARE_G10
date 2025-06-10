"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulación de autenticación
    setTimeout(() => {
      // Datos de usuario de prueba
      if (username === "admin" && password === "admin123") {
        // Admin
        const userData = {
          id: 1,
          name: "Administrador",
          username: "admin",
          role_id: 1,
          role_name: "Administrador",
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
        }
        localStorage.setItem("user", JSON.stringify(userData))
        router.push("/dashboard/admin")
      } else if (username === "jefe" && password === "jefe123") {
        // Jefe de Ventas
        const userData = {
          id: 2,
          name: "Jefe de Ventas",
          username: "jefe",
          role_id: 2,
          role_name: "Jefe de Ventas",
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
        }
        localStorage.setItem("user", JSON.stringify(userData))
        router.push("/dashboard/manager")
      } else if (username === "vendedor" && password === "vendedor123") {
        // Vendedor
        const userData = {
          id: 3,
          name: "Vendedor",
          username: "vendedor",
          role_id: 3,
          role_name: "Vendedor",
          permissions: ["registrar_clientes", "ver_clientes", "ver_productos", "emitir_facturas", "ver_facturas"],
        }
        localStorage.setItem("user", JSON.stringify(userData))
        router.push("/dashboard/seller")
      } else {
        toast({
          title: "Error de autenticación",
          description: "Usuario o contraseña incorrectos",
          variant: "destructive",
        })
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
