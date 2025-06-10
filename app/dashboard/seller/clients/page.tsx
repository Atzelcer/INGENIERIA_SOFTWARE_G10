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
import { Search, Plus, Edit, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: number
  name: string
  document: string
  document_type: string
  address: string
  phone?: string
  email?: string
  created_at: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
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

  // Cargar datos de clientes (simulado)
  useEffect(() => {
    // En un caso real, esto sería una llamada a la API
    const mockClients: Client[] = [
      {
        id: 1,
        name: "Juan Pérez",
        document: "1234567",
        document_type: "CI",
        address: "Av. Siempre Viva 123",
        phone: "70123456",
        email: "juan@example.com",
        created_at: "2025-05-01",
      },
      {
        id: 2,
        name: "Empresa XYZ",
        document: "1023456789",
        document_type: "NIT",
        address: "Calle Comercio 456",
        phone: "71234567",
        email: "contacto@xyz.com",
        created_at: "2025-05-05",
      },
      {
        id: 3,
        name: "María López",
        document: "7654321",
        document_type: "CI",
        address: "Calle Los Pinos 789",
        phone: "72345678",
        email: "maria@example.com",
        created_at: "2025-05-10",
      },
    ]
    setClients(mockClients)
  }, [])

  const filteredClients = clients.filter(
    (client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.document.includes(searchTerm),
  )

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

    // Validación básica
    if (!formData.name || !formData.document || !formData.address) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Simulación de creación de cliente
    const newClient: Client = {
      id: clients.length + 1,
      name: formData.name,
      document: formData.document,
      document_type: formData.document_type,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      created_at: new Date().toISOString().split("T")[0],
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

    // Validación básica
    if (!formData.name || !formData.document || !formData.address) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Actualizar cliente
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

    // Eliminar cliente
    const updatedClients = clients.filter((client) => client.id !== currentClient.id)
    setClients(updatedClients)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Cliente eliminado",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Clientes</h2>
          <p className="text-muted-foreground">Registre y administre la información de sus clientes</p>
        </div>
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
              <DialogDescription>Complete la información del cliente para registrarlo en el sistema</DialogDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Gestione la información de sus clientes registrados</CardDescription>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead className="hidden md:table-cell">Dirección</TableHead>
                <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      {client.document_type}: {client.document}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{client.address}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.phone || "-"}</TableCell>
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
                  <TableCell colSpan={5} className="text-center">
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
