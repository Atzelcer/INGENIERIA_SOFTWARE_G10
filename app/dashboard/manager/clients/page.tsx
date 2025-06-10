"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash, Download, Users, DollarSign, Star, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Client {
  id: number
  name: string
  document: string
  document_type: string
  address: string
  phone?: string
  email?: string
  active: boolean
  created_at: string
  created_by: string
  total_purchases: number
  last_purchase?: string
  total_spent: number
}

export default function ManagerClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    document: "",
    document_type: "CI",
    address: "",
    phone: "",
    email: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: 1,
        name: "Juan Pérez",
        document: "1234567",
        document_type: "CI",
        address: "Av. Siempre Viva 123",
        phone: "70123456",
        email: "juan@example.com",
        active: true,
        created_at: "2025-05-01",
        created_by: "María González",
        total_purchases: 5,
        last_purchase: "2025-06-08",
        total_spent: 28500.5,
      },
      {
        id: 2,
        name: "Empresa XYZ",
        document: "1023456789",
        document_type: "NIT",
        address: "Calle Comercio 456",
        phone: "71234567",
        email: "contacto@xyz.com",
        active: true,
        created_at: "2025-05-05",
        created_by: "Juan Pérez",
        total_purchases: 12,
        last_purchase: "2025-06-09",
        total_spent: 85200.75,
      },
      {
        id: 3,
        name: "María López",
        document: "7654321",
        document_type: "CI",
        address: "Calle Los Pinos 789",
        phone: "72345678",
        email: "maria@example.com",
        active: false,
        created_at: "2025-05-10",
        created_by: "Carlos López",
        total_purchases: 2,
        last_purchase: "2025-05-15",
        total_spent: 3200.0,
      },
      {
        id: 4,
        name: "Comercial ABC",
        document: "9876543210",
        document_type: "NIT",
        address: "Zona Central 321",
        phone: "73456789",
        email: "ventas@abc.com",
        active: true,
        created_at: "2025-05-15",
        created_by: "Ana Martínez",
        total_purchases: 8,
        last_purchase: "2025-06-07",
        total_spent: 45600.25,
      },
      {
        id: 5,
        name: "Pedro Ramírez",
        document: "5555555",
        document_type: "CI",
        address: "Barrio Norte 456",
        phone: "74567890",
        email: "pedro@example.com",
        active: true,
        created_at: "2025-05-20",
        created_by: "María González",
        total_purchases: 3,
        last_purchase: "2025-06-05",
        total_spent: 12800.0,
      },
    ]
    setClients(mockClients)
  }, [])

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.document.includes(searchTerm)
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && client.active) ||
      (filterStatus === "inactive" && !client.active) ||
      (filterStatus === "vip" && client.total_spent > 50000)

    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      document: "",
      document_type: "CI",
      address: "",
      phone: "",
      email: "",
    })
  }

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.document || !formData.address) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const newClient: Client = {
      id: clients.length + 1,
      name: formData.name,
      document: formData.document,
      document_type: formData.document_type,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      active: true,
      created_at: new Date().toISOString().split("T")[0],
      created_by: "Jefe de Ventas",
      total_purchases: 0,
      total_spent: 0,
    }

    setClients([...clients, newClient])
    resetForm()
    setIsAddDialogOpen(false)

    toast({
      title: "✅ Cliente registrado",
      description: "El cliente ha sido registrado exitosamente",
    })
  }

  const handleEditClient = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentClient) return

    if (!formData.name || !formData.document || !formData.address) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const updatedClients = clients.map((client) =>
      client.id === currentClient.id
        ? {
            ...client,
            name: formData.name,
            document: formData.document,
            document_type: formData.document_type,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
          }
        : client,
    )

    setClients(updatedClients)
    setIsEditDialogOpen(false)

    toast({
      title: "✅ Cliente actualizado",
      description: "Los datos del cliente han sido actualizados",
    })
  }

  const handleDeleteClient = () => {
    if (!currentClient) return

    const updatedClients = clients.filter((client) => client.id !== currentClient.id)
    setClients(updatedClients)
    setIsDeleteDialogOpen(false)

    toast({
      title: "🗑️ Cliente eliminado",
      description: "El cliente ha sido eliminado del sistema",
    })
  }

  const openEditDialog = (client: Client) => {
    setCurrentClient(client)
    setFormData({
      name: client.name,
      document: client.document,
      document_type: client.document_type,
      address: client.address,
      phone: client.phone || "",
      email: client.email || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (client: Client) => {
    setCurrentClient(client)
    setIsDeleteDialogOpen(true)
  }

  const toggleClientStatus = (clientId: number) => {
    const updatedClients = clients.map((client) =>
      client.id === clientId ? { ...client, active: !client.active } : client,
    )
    setClients(updatedClients)

    toast({
      title: "🔄 Estado actualizado",
      description: "El estado del cliente ha sido actualizado",
    })
  }

  const exportClients = () => {
    toast({
      title: "📊 Exportando clientes",
      description: "Los datos de clientes se están descargando...",
    })
  }

  // Calcular estadísticas
  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.active).length
  const vipClients = clients.filter((c) => c.total_spent > 50000).length
  const totalRevenue = clients.reduce((sum, c) => sum + c.total_spent, 0)
  const avgSpending = totalRevenue / totalClients || 0

  return (
    <div className="space-y-8">
      {/* Header mejorado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestión de Clientes
          </h1>
          <p className="text-gray-600">Administre clientes y analice su rendimiento comercial como Jefe de Ventas</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportClients} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Datos
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Registrar Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Complete la información del cliente para registrarlo en el sistema
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddClient}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right font-medium">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Nombre completo del cliente"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="document_type" className="text-right font-medium">
                      Tipo <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="document_type"
                      name="document_type"
                      value={formData.document_type}
                      onChange={handleSelectChange}
                      className="col-span-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="CI">CI</option>
                      <option value="NIT">NIT</option>
                    </select>
                    <Input
                      id="document"
                      name="document"
                      value={formData.document}
                      onChange={handleInputChange}
                      className="col-span-2"
                      placeholder="Número de documento"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right font-medium">
                      Dirección <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Dirección completa"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right font-medium">
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Número de teléfono"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700">
                    Guardar Cliente
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas mejoradas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Clientes</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{totalClients}</div>
            <p className="text-xs text-blue-600 mt-1">Clientes registrados</p>
            <Progress value={(activeClients / totalClients) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Clientes Activos</CardTitle>
            <Activity className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{activeClients}</div>
            <p className="text-xs text-green-600 mt-1">
              {((activeClients / totalClients) * 100).toFixed(1)}% del total
            </p>
            <Progress value={(activeClients / totalClients) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Clientes VIP</CardTitle>
            <Star className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">{vipClients}</div>
            <p className="text-xs text-yellow-600 mt-1">Compras mayores a Bs. 50,000</p>
            <Progress value={(vipClients / totalClients) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Ingresos Totales</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">Bs. {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-purple-600 mt-1">Promedio: Bs. {avgSpending.toLocaleString()}</p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabla de clientes mejorada */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="text-xl">Lista de Clientes</CardTitle>
          <CardDescription>Gestione la información de clientes con análisis de ventas detallado</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre o documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">Todos los clientes</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="vip">VIP (&gt;Bs. 50,000)</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Documento</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Contacto</TableHead>
                <TableHead className="hidden lg:table-cell font-semibold">Historial</TableHead>
                <TableHead className="hidden lg:table-cell font-semibold">Total Gastado</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Creado por</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span>{client.name}</span>
                          {client.total_spent > 50000 && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              VIP
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{client.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {client.document_type}: {client.document}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm space-y-1">
                        {client.phone && <div>📞 {client.phone}</div>}
                        {client.email && <div>📧 {client.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm space-y-1">
                        <div className="font-medium">{client.total_purchases} compras</div>
                        {client.last_purchase && <div className="text-gray-500">Última: {client.last_purchase}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm font-bold text-green-600">Bs. {client.total_spent.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleClientStatus(client.id)}>
                        <Badge
                          className={
                            client.active
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                          }
                        >
                          {client.active ? "✅ Activo" : "❌ Inactivo"}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-600">{client.created_by}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(client)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      No se encontraron clientes
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar Cliente</DialogTitle>
            <DialogDescription>Actualice la información del cliente</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditClient}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right font-medium">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-document_type" className="text-right font-medium">
                  Tipo <span className="text-red-500">*</span>
                </Label>
                <select
                  id="edit-document_type"
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleSelectChange}
                  className="col-span-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="CI">CI</option>
                  <option value="NIT">NIT</option>
                </select>
                <Input
                  id="edit-document"
                  name="document"
                  value={formData.document}
                  onChange={handleInputChange}
                  className="col-span-2"
                  placeholder="Número de documento"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right font-medium">
                  Dirección <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right font-medium">
                  Teléfono
                </Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right font-medium">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700">
                Actualizar Cliente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">⚠️ Confirmar Eliminación</DialogTitle>
            <DialogDescription className="text-base">
              ¿Está seguro que desea eliminar al cliente <strong>{currentClient?.name}</strong>? Esta acción no se puede
              deshacer y se perderán todos los datos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteClient}
              className="bg-gradient-to-r from-red-600 to-red-700"
            >
              Eliminar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
