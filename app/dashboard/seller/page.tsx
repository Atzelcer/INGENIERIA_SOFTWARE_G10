import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, User, Package } from "lucide-react"

export default function SellerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Panel de Vendedor</h2>
        <p className="text-muted-foreground">Bienvenido al panel de control para vendedores</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Gestión de Clientes</div>
            <p className="text-xs text-muted-foreground">Registrar y administrar clientes</p>
            <Link href="/dashboard/seller/clients">
              <Button className="mt-4 w-full">Acceder</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Catálogo</div>
            <p className="text-xs text-muted-foreground">Ver productos disponibles</p>
            <Link href="/dashboard/seller/products">
              <Button className="mt-4 w-full">Acceder</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturación</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Emisión de Facturas</div>
            <p className="text-xs text-muted-foreground">Crear y consultar facturas</p>
            <Link href="/dashboard/seller/invoices">
              <Button className="mt-4 w-full">Acceder</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
