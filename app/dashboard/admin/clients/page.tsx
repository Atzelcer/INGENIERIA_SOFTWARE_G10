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
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Edit, Trash, Download, Upload, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

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
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClients, setSelectedClients] = useState<number[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false)
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

  // Cargar datos de clientes (simulado con más información)
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
        created_by: "Admin",
        total_purchases: 5,
        last_purchase: "2025-06-08",
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
        created_by: "Jefe de Ventas",
        total_purchases: 12,
        last_purchase: "2025-06-09",
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
        created_by: "Vendedor",
        total_purchases: 2,
        last_purchase: "2025-05-15",
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
        created_by: "Vendedor",
        total_purchases: 8,
        last_purchase: "2025-06-07",
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
      (filterStatus === "inactive" && !client.active)

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

  const handleSelectClient = (clientId: number, checked: boolean) => {
    setSelectedClients((prev) => (checked ? [...prev, clientId] : prev.filter((id) => id !== clientId)))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedClients(checked ? filteredClients.map((client) => client.id) : [])
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
      created_by: "Admin",
      total_purchases: 0,
    }

    setClients([...clients, newClient])
    resetForm()
    setIsAddDialogOpen(false)

    toast({
      title: "Cliente registrado",
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
      title: "Cliente actualizado",
      description: "Los datos del cliente han sido actualizados",
    })
  }

  const handleDeleteClient = () => {
    if (!currentClient) return

    const updatedClients = clients.filter((client) => client.id !== currentClient.id)
    setClients(updatedClients)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado del sistema",
    })
  }

  const handleBulkAction = (action: string) => {
    if (selectedClients.length === 0) {
      toast({
        title: "Error",
        description: "Seleccione al menos un cliente",
        variant: "destructive",
      })
      return
    }

    let updatedClients = [...clients]

    switch (action) {
      case "activate":
        updatedClients = clients.map((client) =>
          selectedClients.includes(client.id) ? { ...client, active: true } : client,
        )
        toast({
          title: "Clientes activados",
          description: `${selectedClients.length} clientes han sido activados`,
        })
        break
      case "deactivate":
        updatedClients = clients.map((client) =>
          selectedClients.includes(client.id) ? { ...client, active: false } : client,
        )
        toast({
          title: "Clientes desactivados",
          description: `${selectedClients.length} clientes han sido desactivados`,
        })
        break
      case "delete":
        updatedClients = clients.filter((client) => !selectedClients.includes(client.id))
        toast({
          title: "Clientes eliminados",
          description: `${selectedClients.length} clientes han sido eliminados`,
        })
        break
    }

    setClients(updatedClients)
    setSelectedClients([])
    setIsBulkActionDialogOpen(false)
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

  const exportClients = () => {
    // Simulación de exportación
    toast({
      title: "Exportando clientes",
      description: "Los datos de clientes se están descargando...",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Clientes (Admin)</h2>
          <p className="text-muted-foreground">Administración completa de clientes con herramientas avanzadas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportClients}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Complete la información del cliente para registrarlo en el sistema
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddClient}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="document_type" className="text-right">
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
                    <Label htmlFor="address" className="text-right">
                      Dirección <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Cliente</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Gestione la información de todos los clientes del sistema</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Buscar por nombre o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            {selectedClients.length > 0 && (
              <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Acciones ({selectedClients.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Acciones en Lote</DialogTitle>
                    <DialogDescription>
                      Seleccione la acción a realizar en {selectedClients.length} clientes seleccionados
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-2 py-4">
                    <Button onClick={() => handleBulkAction("activate")} className="w-full">
                      Activar Clientes
                    </Button>
                    <Button onClick={() => handleBulkAction("deactivate")} variant="outline" className="w-full">
                      Desactivar Clientes
                    </Button>
                    <Button onClick={() => handleBulkAction("delete")} variant="destructive" className="w-full">
                      Eliminar Clientes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead className="hidden md:table-cell">Dirección</TableHead>
                <TableHead className="hidden lg:table-cell">Compras</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Creado por</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      {client.document_type}: {client.document}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{client.address}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">
                        <div>{client.total_purchases} compras</div>
                        {client.last_purchase && (
                          <div className="text-muted-foreground">Última: {client.last_purchase}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.active ? "default" : "destructive"}>
                        {client.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {client.created_by}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(client)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No se encontraron clientes
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
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Actualice la información del cliente</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditClient}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
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
                <Label htmlFor="edit-document_type" className="text-right">
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
                <Label htmlFor="edit-address" className="text-right">
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
                <Label htmlFor="edit-phone" className="text-right">
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
                <Label htmlFor="edit-email" className="text-right">
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
              <Button type="submit">Actualizar Cliente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar al cliente {currentClient?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteClient}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
