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
import { getUsers, addUser, updateUser, deleteUser, type User } from "@/lib/storage"

interface Role {
  id: number
  name: string
}

interface Permission {
  id: string
  name: string
  description: string
}

export default function UsersPage() {
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
    role_id: 2,
    permissions: [] as string[],
  })
  const { toast } = useToast()

  const roles: Role[] = [
    { id: 1, name: "Administrador" },
    { id: 2, name: "Jefe de Ventas" },
    { id: 3, name: "Vendedor" },
  ]

  const allPermissions: Permission[] = [
    { id: "crear_usuarios", name: "Crear Usuarios", description: "Crear nuevos usuarios" },
    { id: "editar_usuarios", name: "Editar Usuarios", description: "Editar usuarios existentes" },
    { id: "eliminar_usuarios", name: "Eliminar Usuarios", description: "Eliminar usuarios" },
    { id: "ver_usuarios", name: "Ver Usuarios", description: "Ver lista de usuarios" },
    { id: "crear_productos", name: "Crear Productos", description: "Crear nuevos productos" },
    { id: "editar_productos", name: "Editar Productos", description: "Editar productos existentes" },
    { id: "ver_productos", name: "Ver Productos", description: "Ver lista de productos" },
    { id: "registrar_clientes", name: "Registrar Clientes", description: "Registrar nuevos clientes" },
    { id: "ver_clientes", name: "Ver Clientes", description: "Ver lista de clientes" },
    { id: "editar_clientes", name: "Editar Clientes", description: "Editar clientes existentes" },
    { id: "emitir_facturas", name: "Emitir Facturas", description: "Emitir nuevas facturas" },
    { id: "ver_facturas", name: "Ver Facturas", description: "Ver facturas emitidas" },
    { id: "anular_factura", name: "Anular Facturas", description: "Anular facturas" },
    { id: "generar_pdf_factura", name: "Generar PDF", description: "Generar PDF de facturas" },
    { id: "ver_reportes", name: "Ver Reportes", description: "Ver reportes y estadísticas" },
  ]

  // Cargar datos de usuarios (simulado)
  useEffect(() => {
    const loadedUsers = getUsers()
    setUsers(loadedUsers)
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) }))
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
      role_id: 2,
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

    const existingUsers = getUsers()
    if (existingUsers.some((user) => user.username === formData.username)) {
      toast({
        title: "Error",
        description: "El nombre de usuario ya existe",
        variant: "destructive",
      })
      return
    }

    const role = roles.find((r) => r.id === formData.role_id)

    const newUser = addUser({
      username: formData.username,
      name: formData.name,
      email: formData.email,
      role_id: formData.role_id,
      role_name: role?.name || "",
      active: true,
      permissions: formData.permissions,
    })

    setUsers(getUsers())
    resetForm()
    setIsAddDialogOpen(false)

    toast({
      title: "✅ Usuario creado",
      description: `${newUser.name} ha sido creado exitosamente`,
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

    const role = roles.find((r) => r.id === formData.role_id)

    updateUser(currentUser.id, {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      role_id: formData.role_id,
      role_name: role?.name || "",
      permissions: formData.permissions,
    })

    setUsers(getUsers())
    setIsEditDialogOpen(false)

    toast({
      title: "✅ Usuario actualizado",
      description: "Los datos del usuario han sido actualizados",
    })
  }

  const handleDeleteUser = () => {
    if (!currentUser) return

    deleteUser(currentUser.id)
    setUsers(getUsers())
    setIsDeleteDialogOpen(false)

    toast({
      title: "✅ Usuario eliminado",
      description: "El usuario ha sido eliminado del sistema",
    })
  }

  const openEditDialog = (user: User) => {
    setCurrentUser(user)
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: "",
      role_id: user.role_id,
      permissions: user.permissions,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const toggleUserStatus = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    updateUser(userId, { active: !user.active })
    setUsers(getUsers())

    toast({
      title: "✅ Estado actualizado",
      description: "El estado del usuario ha sido actualizado",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">Administre usuarios, roles y permisos del sistema</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>Complete la información del usuario y asigne permisos</DialogDescription>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role_id" className="text-right">
                    Rol <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="role_id"
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleSelectChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {roles.slice(1).map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Permisos</Label>
                  <div className="col-span-3 space-y-2 max-h-40 overflow-y-auto">
                    {allPermissions.map((permission) => (
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
                <Button type="submit">Crear Usuario</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Gestione los usuarios del sistema</CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Buscar usuarios..."
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
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Permisos</TableHead>
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
                      <Badge variant={user.role_id === 1 ? "default" : user.role_id === 2 ? "secondary" : "outline"}>
                        {user.role_name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
                        disabled={user.role_id === 1}
                      >
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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(user)}
                        disabled={user.role_id === 1}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(user)}
                        disabled={user.role_id === 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No se encontraron usuarios
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
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Actualice la información del usuario</DialogDescription>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role_id" className="text-right">
                  Rol <span className="text-red-500">*</span>
                </Label>
                <select
                  id="edit-role_id"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleSelectChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {roles.slice(1).map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Permisos</Label>
                <div className="col-span-3 space-y-2 max-h-40 overflow-y-auto">
                  {allPermissions.map((permission) => (
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
              <Button type="submit">Actualizar Usuario</Button>
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
              ¿Está seguro que desea eliminar al usuario {currentUser?.name}? Esta acción no se puede deshacer.
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
