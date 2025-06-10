import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <h1 className="text-lg font-semibold">TechStore</h1>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Sistema de Facturación TechStore
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Gestión de usuarios, clientes, productos y facturación electrónica
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button>Acceder al Sistema</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Administración de roles y permisos para el personal</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Creación y gestión de usuarios con diferentes niveles de acceso: Administrador, Jefe de Ventas y
                    Vendedor.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Clientes</CardTitle>
                  <CardDescription>Gestión completa de la información de clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Registro de datos personales, documentos de identidad y direcciones para la emisión de facturas.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Facturación Electrónica</CardTitle>
                  <CardDescription>Emisión de facturas según normativa del SIN</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Generación de facturas con código CUF, cálculo automático de impuestos y exportación a PDF.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-100">
        <div className="container flex flex-col gap-2 py-6 px-4 text-center sm:flex-row sm:py-8 sm:px-6">
          <p className="text-xs text-gray-500">© 2025 TechStore. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
