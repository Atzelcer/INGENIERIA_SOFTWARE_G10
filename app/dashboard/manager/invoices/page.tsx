"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Download, Trash, Eye, Filter, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface Invoice {
  id: number
  client_id: number
  client_name: string
  client_document: string
  seller_name: string
  date: string
  total: number
  items: InvoiceItem[]
  cuf: string
  status: "emitida" | "anulada"
}

interface InvoiceItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export default function ManagerInvoicesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      client_id: 1,
      client_name: "Juan Pérez",
      client_document: "CI: 1234567",
      seller_name: "María González",
      date: "2025-06-09",
      total: 5299.99,
      items: [
        {
          id: 1,
          product_id: 1,
          product_name: "Laptop HP Pavilion",
          quantity: 1,
          unit_price: 4999.99,
          subtotal: 4999.99,
        },
        {
          id: 2,
          product_id: 4,
          product_name: "Mouse Gamer Razer",
          quantity: 1,
          unit_price: 349.99,
          subtotal: 349.99,
        },
      ],
      cuf: "123456789ABCDEF",
      status: "emitida",
    },
    {
      id: 2,
      client_id: 2,
      client_name: "Empresa XYZ",
      client_document: "NIT: 1023456789",
      seller_name: "Juan Pérez",
      date: "2025-06-08",
      total: 7999.92,
      items: [
        {
          id: 3,
          product_id: 2,
          product_name: 'Monitor Samsung 24"',
          quantity: 4,
          unit_price: 1299.99,
          subtotal: 5199.96,
        },
        {
          id: 4,
          product_id: 3,
          product_name: "Teclado Mecánico Logitech",
          quantity: 3,
          unit_price: 799.99,
          subtotal: 2399.97,
        },
      ],
      cuf: "987654321FEDCBA",
      status: "emitida",
    },
    {
      id: 3,
      client_id: 3,
      client_name: "María López",
      client_document: "CI: 7654321",
      seller_name: "Carlos López",
      date: "2025-06-07",
      total: 1299.99,
      items: [
        {
          id: 5,
          product_id: 2,
          product_name: 'Monitor Samsung 24"',
          quantity: 1,
          unit_price: 1299.99,
          subtotal: 1299.99,
        },
      ],
      cuf: "ABCDEF123456789",
      status: "anulada",
    },
    {
      id: 4,
      client_id: 4,
      client_name: "Comercial ABC",
      client_document: "NIT: 9876543210",
      seller_name: "Ana Martínez",
      date: "2025-06-06",
      total: 6999.95,
      items: [
        {
          id: 6,
          product_id: 5,
          product_name: "Smartphone Samsung Galaxy S23",
          quantity: 1,
          unit_price: 5999.99,
          subtotal: 5999.99,
        },
        {
          id: 7,
          product_id: 3,
          product_name: "Teclado Mecánico Logitech",
          quantity: 1,
          unit_price: 799.99,
          subtotal: 799.99,
        },
      ],
      cuf: "FEDCBA987654321",
      status: "emitida",
    },
    {
      id: 5,
      client_id: 1,
      client_name: "Juan Pérez",
      client_document: "CI: 1234567",
      seller_name: "María González",
      date: "2025-06-05",
      total: 2599.97,
      items: [
        {
          id: 8,
          product_id: 2,
          product_name: 'Monitor Samsung 24"',
          quantity: 2,
          unit_price: 1299.99,
          subtotal: 2599.98,
        },
      ],
      cuf: "MANAGER123456789",
      status: "emitida",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedSeller, setSelectedSeller] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isViewInvoiceDialogOpen, setIsViewInvoiceDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const { toast } = useToast()

  const sellers = ["María González", "Juan Pérez", "Carlos López", "Ana Martínez"]

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_document.includes(searchTerm) ||
      invoice.cuf.includes(searchTerm) ||
      invoice.seller_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDateFrom = !dateFrom || invoice.date >= dateFrom
    const matchesDateTo = !dateTo || invoice.date <= dateTo
    const matchesSeller = !selectedSeller || invoice.seller_name === selectedSeller
    const matchesStatus = !selectedStatus || invoice.status === selectedStatus

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && invoice.status === "emitida") ||
      (activeTab === "cancelled" && invoice.status === "anulada")

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesSeller && matchesStatus && matchesTab
  })

  const viewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewInvoiceDialogOpen(true)
  }

  const downloadInvoice = (invoice: Invoice) => {
    toast({
      title: "Descargando factura",
      description: `Factura #${invoice.id} descargada como PDF`,
    })
  }

  const cancelInvoice = (invoiceId: number) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === invoiceId ? { ...invoice, status: "anulada" as const } : invoice,
    )

    setInvoices(updatedInvoices)

    toast({
      title: "Factura anulada",
      description: `Factura #${invoiceId} anulada correctamente`,
    })
  }

  const exportInvoices = () => {
    toast({
      title: "Exportando facturas",
      description: "Los datos de facturas se están descargando...",
    })
  }

  // Calcular estadísticas
  const totalInvoices = invoices.length
  const activeInvoices = invoices.filter((inv) => inv.status === "emitida").length
  const cancelledInvoices = invoices.filter((inv) => inv.status === "anulada").length
  const totalRevenue = invoices.filter((inv) => inv.status === "emitida").reduce((sum, inv) => sum + inv.total, 0)
  const averageTicket = activeInvoices > 0 ? totalRevenue / activeInvoices : 0

  // Estadísticas por vendedor
  const sellerStats = sellers.map((seller) => {
    const sellerInvoices = invoices.filter((inv) => inv.seller_name === seller && inv.status === "emitida")
    const revenue = sellerInvoices.reduce((sum, inv) => sum + inv.total, 0)
    return {
      name: seller,
      invoices: sellerInvoices.length,
      revenue: revenue,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Facturas (Jefe)</h2>
          <p className="text-muted-foreground">Supervise facturas y analice el rendimiento del equipo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportInvoices}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">Todas las facturas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Activas</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInvoices}</div>
            <p className="text-xs text-muted-foreground">Facturas emitidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Solo facturas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {averageTicket.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Promedio por factura</p>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento por vendedor */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Vendedor</CardTitle>
          <CardDescription>Estadísticas de facturación por vendedor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sellerStats.map((seller) => (
              <div key={seller.name} className="p-4 border rounded-lg">
                <div className="font-medium">{seller.name}</div>
                <div className="text-2xl font-bold">{seller.invoices}</div>
                <div className="text-sm text-muted-foreground">facturas</div>
                <div className="text-sm font-medium">Bs. {seller.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                type="search"
                placeholder="Cliente, CUF, vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Fecha Desde</Label>
              <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Fecha Hasta</Label>
              <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller">Vendedor</Label>
              <select
                id="seller"
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Todos los vendedores</option>
                {sellers.map((seller) => (
                  <option key={seller} value={seller}>
                    {seller}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Todos los estados</option>
                <option value="emitida">Emitidas</option>
                <option value="anulada">Anuladas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas ({totalInvoices})</TabsTrigger>
          <TabsTrigger value="active">Activas ({activeInvoices})</TabsTrigger>
          <TabsTrigger value="cancelled">Anuladas ({cancelledInvoices})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Facturas</CardTitle>
              <CardDescription>
                {activeTab === "all" && "Todas las facturas del equipo"}
                {activeTab === "active" && "Facturas emitidas y activas"}
                {activeTab === "cancelled" && "Facturas anuladas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden md:table-cell">Vendedor</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.client_name}</div>
                            <div className="text-sm text-muted-foreground">{invoice.client_document}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{invoice.seller_name}</TableCell>
                        <TableCell>Bs. {invoice.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === "emitida" ? "default" : "destructive"}>
                            {invoice.status === "emitida" ? "Emitida" : "Anulada"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => viewInvoice(invoice)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadInvoice(invoice)}
                            disabled={invoice.status === "anulada"}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => cancelInvoice(invoice.id)}
                            disabled={invoice.status === "anulada"}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No se encontraron facturas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ver Factura Dialog */}
      <Dialog open={isViewInvoiceDialogOpen} onOpenChange={setIsViewInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detalle de Factura #{selectedInvoice?.id}</DialogTitle>
            <DialogDescription>Información completa de la factura</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Cliente:</p>
                  <p>{selectedInvoice.client_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Documento:</p>
                  <p>{selectedInvoice.client_document}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Vendedor:</p>
                  <p>{selectedInvoice.seller_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fecha:</p>
                  <p>{selectedInvoice.date}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">CUF:</p>
                  <p className="text-xs font-mono">{selectedInvoice.cuf}</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio Unit.</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>Bs. {item.unit_price.toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>Bs. {item.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total:
                    </TableCell>
                    <TableCell className="font-bold">Bs. {selectedInvoice.total.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Estado:</p>
                  <Badge variant={selectedInvoice.status === "emitida" ? "default" : "destructive"}>
                    {selectedInvoice.status === "emitida" ? "Emitida" : "Anulada"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => downloadInvoice(selectedInvoice)}
                    disabled={selectedInvoice.status === "anulada"}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      cancelInvoice(selectedInvoice.id)
                      setIsViewInvoiceDialogOpen(false)
                    }}
                    disabled={selectedInvoice.status === "anulada"}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Anular Factura
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
