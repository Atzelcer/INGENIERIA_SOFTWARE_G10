"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, FileText, Trash, Download, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: number
  name: string
  document: string
  document_type: string
  address: string
}

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface InvoiceItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface Invoice {
  id: number
  client_id: number
  client_name: string
  client_document: string
  date: string
  total: number
  items: InvoiceItem[]
  cuf: string
  status: "emitida" | "anulada"
}

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState("new")
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      client_id: 1,
      client_name: "Juan Pérez",
      client_document: "CI: 1234567",
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
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isViewInvoiceDialogOpen, setIsViewInvoiceDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const { toast } = useToast()

  // Datos simulados
  const clients: Client[] = [
    {
      id: 1,
      name: "Juan Pérez",
      document: "1234567",
      document_type: "CI",
      address: "Av. Siempre Viva 123",
    },
    {
      id: 2,
      name: "Empresa XYZ",
      document: "1023456789",
      document_type: "NIT",
      address: "Calle Comercio 456",
    },
    {
      id: 3,
      name: "María López",
      document: "7654321",
      document_type: "CI",
      address: "Calle Los Pinos 789",
    },
  ]

  const products: Product[] = [
    {
      id: 1,
      name: "Laptop HP Pavilion",
      price: 4999.99,
      stock: 10,
    },
    {
      id: 2,
      name: 'Monitor Samsung 24"',
      price: 1299.99,
      stock: 15,
    },
    {
      id: 3,
      name: "Teclado Mecánico Logitech",
      price: 799.99,
      stock: 8,
    },
    {
      id: 4,
      name: "Mouse Gamer Razer",
      price: 349.99,
      stock: 20,
    },
    {
      id: 5,
      name: "Smartphone Samsung Galaxy S23",
      price: 5999.99,
      stock: 5,
    },
  ]

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_document.includes(searchTerm) ||
      invoice.cuf.includes(searchTerm),
  )

  const selectClient = (client: Client) => {
    setSelectedClient(client)
    setIsClientDialogOpen(false)
  }

  const addProductToInvoice = (product: Product) => {
    // Verificar si el producto ya está en la factura
    const existingItem = invoiceItems.find((item) => item.product_id === product.id)

    if (existingItem) {
      // Actualizar cantidad si ya existe
      const updatedItems = invoiceItems.map((item) =>
        item.product_id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.unit_price,
            }
          : item,
      )
      setInvoiceItems(updatedItems)
    } else {
      // Agregar nuevo item
      const newItem: InvoiceItem = {
        id: invoiceItems.length + 1,
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        subtotal: product.price,
      }
      setInvoiceItems([...invoiceItems, newItem])
    }

    setIsProductDialogOpen(false)
  }

  const removeItemFromInvoice = (itemId: number) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== itemId))
  }

  const updateItemQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return

    setInvoiceItems(
      invoiceItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.unit_price,
            }
          : item,
      ),
    )
  }

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => total + item.subtotal, 0)
  }

  const generateCUF = () => {
    // Simulación de generación de CUF
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const createInvoice = () => {
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Debe seleccionar un cliente",
        variant: "destructive",
      })
      return
    }

    if (invoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un producto",
        variant: "destructive",
      })
      return
    }

    // Crear nueva factura
    const newInvoice: Invoice = {
      id: invoices.length + 1,
      client_id: selectedClient.id,
      client_name: selectedClient.name,
      client_document: `${selectedClient.document_type}: ${selectedClient.document}`,
      date: new Date().toISOString().split("T")[0],
      total: calculateTotal(),
      items: [...invoiceItems],
      cuf: generateCUF(),
      status: "emitida",
    }

    setInvoices([...invoices, newInvoice])

    // Resetear formulario
    setSelectedClient(null)
    setInvoiceItems([])

    toast({
      title: "Factura emitida",
      description: `Factura #${newInvoice.id} emitida correctamente`,
    })

    // Cambiar a la pestaña de historial
    setActiveTab("history")
  }

  const viewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewInvoiceDialogOpen(true)
  }

  const downloadInvoice = (invoice: Invoice) => {
    // Simulación de descarga de factura
    toast({
      title: "Descargando factura",
      description: `Factura #${invoice.id} descargada como PDF`,
    })
  }

  const cancelInvoice = (invoiceId: number) => {
    // Simulación de anulación de factura
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === invoiceId ? { ...invoice, status: "anulada" } : invoice,
    )

    setInvoices(updatedInvoices)

    toast({
      title: "Factura anulada",
      description: `Factura #${invoiceId} anulada correctamente`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Facturación</h2>
        <p className="text-muted-foreground">Emita facturas y consulte el historial de facturación</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">Nueva Factura</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emisión de Factura</CardTitle>
              <CardDescription>Complete los datos para emitir una nueva factura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selección de Cliente */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Datos del Cliente</h3>
                  <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <User className="mr-2 h-4 w-4" />
                        Seleccionar Cliente
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Seleccionar Cliente</DialogTitle>
                        <DialogDescription>Seleccione un cliente para la factura</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Documento</TableHead>
                              <TableHead className="text-right">Acción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clients.map((client) => (
                              <TableRow key={client.id}>
                                <TableCell className="font-medium">{client.name}</TableCell>
                                <TableCell>
                                  {client.document_type}: {client.document}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="outline" size="sm" onClick={() => selectClient(client)}>
                                    Seleccionar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {selectedClient ? (
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Cliente:</p>
                          <p>{selectedClient.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Documento:</p>
                          <p>
                            {selectedClient.document_type}: {selectedClient.document}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm font-medium">Dirección:</p>
                          <p>{selectedClient.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">No hay cliente seleccionado</p>
                  </div>
                )}
              </div>

              {/* Selección de Productos */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Detalle de Productos</h3>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Producto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Agregar Producto</DialogTitle>
                        <DialogDescription>Seleccione un producto para agregar a la factura</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Producto</TableHead>
                              <TableHead>Precio</TableHead>
                              <TableHead>Stock</TableHead>
                              <TableHead className="text-right">Acción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {products.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>Bs. {product.price.toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addProductToInvoice(product)}
                                    disabled={product.stock <= 0}
                                  >
                                    Agregar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {invoiceItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoiceItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product_name}</TableCell>
                          <TableCell>Bs. {item.unit_price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <span>{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Bs. {item.subtotal.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeItemFromInvoice(item.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total:
                        </TableCell>
                        <TableCell className="font-bold">Bs. {calculateTotal().toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">No hay productos agregados</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={createInvoice} disabled={!selectedClient || invoiceItems.length === 0}>
                  Emitir Factura
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Facturas</CardTitle>
              <CardDescription>Consulte las facturas emitidas</CardDescription>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Buscar por cliente o CUF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
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
                        <TableCell>{invoice.client_name}</TableCell>
                        <TableCell>Bs. {invoice.total.toFixed(2)}</TableCell>
                        <TableCell>
                          {invoice.status === "emitida" ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Emitida
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Anulada
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => viewInvoice(invoice)}>
                            <FileText className="h-4 w-4" />
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
                      <TableCell colSpan={6} className="text-center">
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
                  <p className="text-sm font-medium">Fecha:</p>
                  <p>{selectedInvoice.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">CUF:</p>
                  <p className="text-xs">{selectedInvoice.cuf}</p>
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
                  {selectedInvoice.status === "emitida" ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Emitida
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Anulada
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => downloadInvoice(selectedInvoice)}
                  disabled={selectedInvoice.status === "anulada"}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
