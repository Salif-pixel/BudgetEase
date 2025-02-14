"use client";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { GradientHeading } from "@/src/components/cult/gradientheading";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {Request} from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {MoreHorizontal, Trash, Pencil, Download} from "lucide-react";
import { User } from "@prisma/client";
import {Avatar, AvatarFallback, AvatarImage} from "@/src/components/ui/avatar";
import {UserForm, UserFormValues,} from "@/app/(protected)/settings/users/UserForm";
import {DeleteUsers, UpdateOrCreateuser} from "@/src/actions/users.action";
import {useCustomToast} from "@/src/components/spectrum/alert";
import {exportToCSV, exportUsersToExcel} from "@/src/components/csv/export-csv";
import {exportToExcel} from "@/app/(protected)/needs/new/component/sortableListComponent";

// Définition des enums et leur traduction/coloration
const ROLES = ["PERSONAL", "DEPARTMENT_HEAD", "DIRECTOR", "ADMIN"];
const DEPARTMENTS = [
    "INFORMATIQUE",
    "CIVIL",
    "ELECTRICITE",
    "MECANIQUE",
    "GESTION",
    "NO",
];

// Mapping pour traduire et colorer les rôles
const roleMapping: Record<string, { label: string; color: string }> = {
    PERSONAL: { label: "Personnel", color: "blue" },
    DEPARTMENT_HEAD: { label: "Chef de département", color: "green" },
    DIRECTOR: { label: "Directeur", color: "red" },
    ADMIN: { label: "Administrateur", color: "purple" },
};

// Mapping pour traduire et colorer les départements
const departmentMapping: Record<string, { label: string; color: string }> = {
    INFORMATIQUE: { label: "Informatique", color: "blue" },
    CIVIL: { label: "Civil", color: "green" },
    ELECTRICITE: { label: "Électricité", color: "yellow" },
    MECANIQUE: { label: "Mécanique", color: "red" },
    GESTION: { label: "Gestion", color: "orange" },
    NO: { label: "Aucun", color: "gray" },
};

export default function UsersDatatable({ users }: { users: (User & { Request: Request[] })[]}) {
    // Sélection des utilisateurs dans le tableau
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    // États pour les filtres multiples (tableaux de chaînes)
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const {showToast} = useCustomToast();
    // Simulation des actions côté serveur
    const deleteUser = async (userId: string) => {
        try {
            showToast("Suppression de l'utilisateur", "Suppression de l'utilisateur en cours...", "info")
            const result = await DeleteUsers([userId]);
            if(result && result.error){
                showToast("Erreur lors de la suppression de l'utilisateur", result.error, "error")
            }else {
                showToast("Utilisateur supprimé", "L'utilisateur a été supprimé avec succès", "success")
            }
        }catch {
            showToast("Erreur lors de la suppression de l'utilisateur", "Une erreur s'est produite lors de la suppression de l'utilisateur", "error")
        }
        setIsDeleteDialogOpen(false);
    };

    const deleteMultipleUsers = async () => {
        try {
            showToast("Suppression des utilisateurs", "Suppression des utilisateur en cours...", "info")
            const result = await DeleteUsers(selectedUsers);
            if(result && result.error){
                showToast("Erreur lors de la suppression des utilisateurs", result.error, "error")
            }else {
                showToast("Utilisateurs supprimés", "Les utilisateur ont été supprimés avec succès", "success")
            }
        }catch {
            showToast("Erreur lors de la suppression des utilisateurs", "Une erreur s'est produite lors de la suppression des utilisateurs", "error")
        }
        setSelectedUsers([]);
        setIsDeleteDialogOpen(false);
    };

    const editUser = async (user: UserFormValues) => {
        try {
            showToast("Modification de l'utilisateur", "Modification de l'utilisateur en cours...", "info")
           const result = await  UpdateOrCreateuser(user);
           if(result && result.error){
                showToast("Erreur lors de la modification de l'utilisateur", result.error, "error")
           }else {
                showToast("Utilisateur modifié", "L'utilisateur a été modifié avec succès", "success")
           }
        }catch {
            showToast("Erreur lors de la modification de l'utilisateur", "Une erreur s'est produite lors de la modification de l'utilisateur", "error")
        }
        setIsEditDialogOpen(false);
        setEditingUser(null);
    };

    const addUser = async (userData: UserFormValues) => {
        try {
            showToast("Ajout de l'utilisateur", "Ajout de l'utilisateur en cours...", "info")
            const result = await  UpdateOrCreateuser(userData);
            if(result && result.error){
                showToast("Erreur lors de l'ajout de l'utilisateur", result.error, "error")
            }else {
                showToast("Utilisateur ajouté", "L'utilisateur a été ajouté avec succès", "success")
            }
        }catch {
            showToast("Erreur lors de l'ajout de l'utilisateur", "Une erreur s'est produite lors de l'ajout de l'utilisateur", "error")
        }
        setIsAddDialogOpen(false);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(users.map((user) => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: string) => {
        setSelectedUsers((prev) => {
            if (prev.includes(userId)) {
                return prev.filter((id) => id !== userId);
            }
            return [...prev, userId];
        });
    };

    // Filtrage en fonction du texte de recherche et des filtres sélectionnés
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole =
            selectedRoles.length === 0 ||
            selectedRoles.includes(user.role as string);
        const matchesDepartment =
            selectedDepartments.length === 0 ||
            selectedDepartments.includes(user.department as string);
        return matchesSearch && matchesRole && matchesDepartment;
    });

    // Formulaire utilisateur (utilisé dans les dialogues)

    return (
        <div className="h-full w-full gap-4 p-8 space-y-8 lg:p-16">

            <div className={"hidden bg-blue-100 "}></div>
            <div className={"hidden text-blue-800 bg-blue-800 "}></div>
            <div className={"hidden bg-purple-100 "}></div>
            <div className={"hidden text-purple-800 bg-purple-800 "}></div>
            <div className={"hidden bg-green-100 "}></div>
            <div className={"hidden text-green-800 bg-green-800 "}></div>
            <div className={"hidden bg-yellow-100 "}></div>
            <div className={"hidden text-yellow-800 bg-yellow-800 "}></div>
            <div className={"hidden bg-orange-100 "}></div>
            <div className={"hidden text-orange-800 bg-orange-800 "}></div>
            <div className={"hidden bg-red-100 "}></div>
            <div className={"hidden text-red-800 bg-red-800 "}></div>
            <div className={"hidden bg-gray-100 "}></div>
            <div className={"hidden text-gray-800 bg-gray-800 "}></div>
            {/* Header */}
            <div className="flex w-full justify-between">
                <div className="flex flex-row items-center">
                    <div>
                        <GradientHeading variant="default" size="sm">
                            Utilisateurs
                        </GradientHeading>
                        <p className="text-sm text-muted-foreground">
                            voici la liste des utilisateurs
                        </p>
                    </div>
                    <Badge className="ml-4 bg-primary h-8 rounded-full">
                        {filteredUsers.length} utilisateurs
                    </Badge>
                </div>
                <div>
                    <Input
                        type="text"
                        placeholder="Rechercher un utilisateur"
                        className="w-full min-w-80 py-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Actions et filtres */}
            <div className="flex w-full justify-between items-start">
                {/* Bloc gauche : Filtres et affichage des sélections */}
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-4 items-center">
                        {/* Filtre multi-roles */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-32">
                                    Rôles
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {ROLES.map((role) => (
                                    <DropdownMenuItem
                                        key={role}
                                        onClick={(e) => e.preventDefault()}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            checked={selectedRoles.includes(role)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedRoles((prev) => [...prev, role]);
                                                } else {
                                                    setSelectedRoles((prev) =>
                                                        prev.filter((r) => r !== role)
                                                    );
                                                }
                                            }}
                                        />
                                        {roleMapping[role].label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Filtre multi-départements */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-32">
                                    Départements
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {DEPARTMENTS.map((department) => (
                                    <DropdownMenuItem
                                        key={department}
                                        onClick={(e) => e.preventDefault()}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            checked={selectedDepartments.includes(department)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedDepartments((prev) => [
                                                        ...prev,
                                                        department,
                                                    ]);
                                                } else {
                                                    setSelectedDepartments((prev) =>
                                                        prev.filter((d) => d !== department)
                                                    );
                                                }
                                            }}
                                        />
                                        {departmentMapping[department].label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Bouton d'effacement des filtres */}
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedRoles([]);
                                setSelectedDepartments([]);
                                setSearchQuery("");
                            }}
                        >
                            Effacer les filtres
                        </Button>
                    </div>

                    {/* Bloc d'affichage des filtres sélectionnés */}
                    <div className="flex flex-col gap-2">
                        {selectedRoles.length > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="font-bold">Rôles :</span>
                                {selectedRoles.slice(0, 2).map((role, index) => (
                                    <Badge key={index} variant="outline">
                                        {roleMapping[role].label}
                                    </Badge>
                                ))}
                                {selectedRoles.length > 2 && (
                                    <Badge variant="outline">
                                        +{selectedRoles.length - 2}
                                    </Badge>
                                )}
                            </div>
                        )}
                        {selectedDepartments.length > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="font-bold">Départements :</span>
                                {selectedDepartments.slice(0, 2).map((dep, index) => (
                                    <Badge key={index} variant="outline">
                                        {departmentMapping[dep].label}
                                    </Badge>
                                ))}
                                {selectedDepartments.length > 2 && (
                                    <Badge variant="outline">
                                        +{selectedDepartments.length - 2}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Boutons d'actions (suppression, export, ajout) */}
                <div className="flex flex-row justify-evenly gap-4">
                    {selectedUsers.length > 0 && (
                        <AlertDialog
                            open={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                        >
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="flex items-center gap-2">
                                    <Trash size={16} />
                                    Supprimer ({selectedUsers.length})
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Confirmer la suppression
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir supprimer{" "}
                                        {selectedUsers.length} utilisateurs ? Cette action est
                                        irréversible.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={deleteMultipleUsers}>
                                        Supprimer
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button onClick={()=>{exportUsersToExcel(users)}} variant="outline" className="flex-1 sm:flex-none gap-2">
                            <Download className="w-4 h-4" />
                            Exporter
                        </Button>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default">Ajouter un utilisateur</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Ajouter un utilisateur</DialogTitle>
                                <DialogDescription>
                                    Remplissez les informations pour créer un nouvel utilisateur
                                </DialogDescription>
                            </DialogHeader>
                            <UserForm mode="add" onSubmit={addUser} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="overflow-hidden w-full rounded-lg border border-border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-600">
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedUsers.length === users.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Avatar</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Département</TableHead>
                            <TableHead className="w-12">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedUsers.includes(user.id)}
                                        onCheckedChange={() => handleSelectUser(user.id)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium"><Avatar className="h-10 w-10 rounded-full">
                                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                                    <AvatarFallback className="rounded-lg bg-primary text-background">{user.email[0].toUpperCase()}{user.email[1].toUpperCase()}</AvatarFallback>
                                </Avatar></TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell className="font-medium">
                                    {user.role && roleMapping[user.role] ? (
                                        <Badge
                                            variant="outline"
                                            className={` gap-2 bg-${roleMapping[user.role].color}-100 text-${roleMapping[user.role].color}-800`}
                                        >
                                            <span className={`h-2 w-2 rounded-full bg-${roleMapping[user.role].color}-800`}></span>
                                            {roleMapping[user.role].label}
                                        </Badge>
                                    ) : (
                                        "N/A"
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell className="font-medium">
                                    {user.department && departmentMapping[user.department] ? (
                                        <Badge
                                            variant="outline"
                                            className={` bg-${departmentMapping[user.department].color}-100 text-${departmentMapping[user.department].color}-800`}
                                        >
                                            {departmentMapping[user.department].label}
                                        </Badge>
                                    ) : (
                                        "N/A"
                                    )}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <Dialog
                                                open={isEditDialogOpen}
                                                onOpenChange={setIsEditDialogOpen}
                                            >
                                                <DialogTrigger asChild>
                                                    <DropdownMenuItem
                                                        onClick={() => setEditingUser(user)}
                                                        onSelect={(event) => event.preventDefault()}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Pencil size={16} />
                                                        Modifier
                                                    </DropdownMenuItem>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Modifier l&apos;utilisateur
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Modifiez les informations de l&apos;utilisateur
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <UserForm
                                                        initialData={editingUser || user}
                                                        mode="edit"
                                                        onSubmit={editUser}
                                                    />

                                                </DialogContent>
                                            </Dialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem
                                                        onSelect={(event) => event.preventDefault()}
                                                        className="flex items-center gap-2 text-red-600"
                                                    >
                                                        <Trash size={16} />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Confirmer la suppression
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
                                                            {user.name} ? Cette action est irréversible.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => deleteUser(user.id)}
                                                        >
                                                            Supprimer
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
