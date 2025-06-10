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
import { Search, Plus, Edit, Trash, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface User {
  id: number
  username: string
  name: string
  email: string
  role_id: number
  role_name: string
  active: boolean
  permissions: string[]
  created_at: string
}

interface Permission {
  id: string
  name: string
  description: string
}

export default function ManagerUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    permissions: [] as string[],
  })
  const { toast } = useToast()

  // Permisos que un Jefe puede asignar (solo los que él tiene)
  const availablePermissions: Permission[] = [
    { id: "registrar_clientes", name: "Registrar Clientes", description: "Registrar nuevos clientes" },
    { id: "ver_clientes", name: "Ver Clientes", description: "Ver lista de clientes" },
    { id: "editar_clientes", name: "Editar Clientes", description: "Editar clientes existentes" },
    { id: "ver_productos", name: "Ver Productos", description: "Ver lista de productos" },
    { id: "emitir_facturas", name: "Emitir Facturas", description: "Emitir nuevas facturas" },
    { id: "ver_facturas", name: "Ver Facturas", description: "Ver facturas emitidas" },
    { id: "generar_pdf_factura", name: "Generar PDF", description: "Generar PDF de facturas" },
  ]

  // Cargar datos de vendedores (simulado)
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 3,
        username: "vendedor",
        name: "Vendedor Principal",
        email: "vendedor@techstore.com",
        role_id: 3,
        role_name: "Vendedor",
        active: true,
        permissions: ["registrar_clientes", "ver_clientes", "ver_productos", "emitir_facturas", "ver_facturas"],
        created_at: "2025-01-03",
      },
      {
        id: 4,
        username: "vendedor2",
        name: "María González",
        email: "maria@techstore.com",
        role_id: 3,
        role_name: "Vendedor",
        active: true,
        permissions: [
          "registrar_clientes",
          "ver_clientes",
          "editar_clientes",
          "ver_productos",
          "emitir_facturas",
          "ver_facturas",
          "generar_pdf_factura",
        ],
        created_at: "2025-01-04",
      },
      {
        id: 5,
        username: "vendedor3",
        name: "Carlos López",
        email: "carlos@techstore.com",
        role_id: 3,
        role_name: "Vendedor",
        active: false,
        permissions: ["registrar_clientes", "ver_clientes", "ver_productos", "emitir_facturas", "ver_facturas"],
        created_at: "2025-01-05",
      },
    ]
    setUsers(mockUsers)
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked ? [...prev.permissions, permissionId] : prev.permissions.filter((p) => p !== permissionId),
    }))
  }

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      email: "",
      password: "",
      permissions: [],
    })
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.name || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Verificar que el username no exista
    if (users.some((user) => user.username === formData.username)) {
      toast({
        title: "Error",
        description: "El nombre de usuario ya existe",
        variant: "destructive",
      })
      return
    }

    const newUser: User = {
      id: users.length + 10, // Evitar conflictos con IDs existentes
      username: formData.username,
      name: formData.name,
      email: formData.email,
      role_id: 3, // Solo puede crear vendedores
      role_name: "Vendedor",
      active: true,
      permissions: formData.permissions,
      created_at: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, newUser])
    resetForm()
    setIsAddDialogOpen(false)

    toast({
      title: "Vendedor creado",
      description: "El vendedor ha sido creado exitosamente",
    })
  }

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) return

    if (!formData.username || !formData.name) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? {
            ...user,
            username: formData.username,
            name: formData.name,
            email: formData.email,
            permissions: formData.permissions,
          }
        : user,
    )

    setUsers(updatedUsers)
    setIsEditDialogOpen(false)

    toast({
      title: "Vendedor actualizado",
      description: "Los datos del vendedor han sido actualizados",
    })
  }

  const handleDeleteUser = () => {
    if (!currentUser) return

    const updatedUsers = users.filter((user) => user.id !== currentUser.id)
    setUsers(updatedUsers)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Vendedor eliminado",
      description: "El vendedor ha sido eliminado del sistema",
    })
  }

  const openEditDialog = (user: User) => {
    setCurrentUser(user)
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: "",
      permissions: user.permissions,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const toggleUserStatus = (userId: number) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, active: !user.active } : user))
    setUsers(updatedUsers)

    toast({
      title: "Estado actualizado",
      description: "El estado del vendedor ha sido actualizado",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Vendedores</h2>
          <p className="text-muted-foreground">Administre el equipo de vendedores y sus permisos</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Vendedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Vendedor</DialogTitle>
              <DialogDescription>Complete la información del vendedor y asigne permisos</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Usuario <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Contraseña <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Permisos</Label>
                  <div className="col-span-3 space-y-2 max-h-40 overflow-y-auto">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                        />
                        <Label htmlFor={permission.id} className="text-sm">
                          {permission.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Vendedor</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendedores</CardTitle>
          <CardDescription>Gestione su equipo de vendedores</CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Buscar vendedores..."
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
                <TableHead>Usuario</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Permisos</TableHead>
                <TableHead className="hidden md:table-cell">Fecha Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleUserStatus(user.id)}>
                        <Badge variant={user.active ? "default" : "destructive"}>
                          {user.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <Shield className="mr-1 h-3 w-3" />
                        <span className="text-xs">{user.permissions.length} permisos</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.created_at}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(user)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No se encontraron vendedores
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Vendedor</DialogTitle>
            <DialogDescription>Actualice la información del vendedor</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-username" className="text-right">
                  Usuario <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Permisos</Label>
                <div className="col-span-3 space-y-2 max-h-40 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${permission.id}`}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                      />
                      <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                        {permission.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Actualizar Vendedor</Button>
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
              ¿Está seguro que desea eliminar al vendedor {currentUser?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteUser}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
