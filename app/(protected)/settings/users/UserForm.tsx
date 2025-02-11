// UserForm.tsx
"use client";

import React from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";


import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/src/components/ui/form";
import {Input} from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import {Button} from "@/src/components/ui/button";
import {User} from "@prisma/client";

// Définition des enums
export const ROLES = ["PERSONAL", "DEPARTMENT_HEAD", "DIRECTOR", "ADMIN"] as const;
export const DEPARTMENTS = [
    "INFORMATIQUE",
    "CIVIL",
    "ELECTRICITE",
    "MECANIQUE",
    "GESTION",
    "NO",
] as const;

// Mapping pour traduire et colorer les rôles
export const roleMapping: Record<
    (typeof ROLES)[number],
    { label: string; color: string }
> = {
    PERSONAL: {label: "Personnel", color: "blue"},
    DEPARTMENT_HEAD: {label: "Chef de département", color: "green"},
    DIRECTOR: {label: "Directeur", color: "red"},
    ADMIN: {label: "Administrateur", color: "purple"},
};

// Mapping pour traduire et colorer les départements
export const departmentMapping: Record<
    (typeof DEPARTMENTS)[number],
    { label: string; color: string }
> = {
    INFORMATIQUE: {label: "Informatique", color: "blue"},
    CIVIL: {label: "Civil", color: "green"},
    ELECTRICITE: {label: "Électricité", color: "yellow"},
    MECANIQUE: {label: "Mécanique", color: "red"},
    GESTION: {label: "Gestion", color: "orange"},
    NO: {label: "Aucun", color: "gray"},
};

// Définition du schéma Zod pour le formulaire
export const userFormSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    email: z.string().email("L'adresse email n'est pas valide"),
    role: z.enum(ROLES, {
        errorMap: () => ({message: "Veuillez sélectionner un rôle valide"}),
    }),
    department: z.enum(DEPARTMENTS, {
        errorMap: () => ({message: "Veuillez sélectionner un département valide"}),
    }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
    initialData?: User,
    mode: "add" | "edit",
    onSubmit: (data: UserFormValues) => void,
}

export function UserForm({initialData, onSubmit, mode}: UserFormProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            email: initialData?.email || "",
            role: initialData?.role || "PERSONAL",
            department: initialData?.department || "NO",
        },
    });


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
            >
                {/* Champ Nom */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input placeholder="Nom de l'utilisateur" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {/* Champ Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Adresse mail</FormLabel>
                            <FormControl>
                                <Input placeholder="Adresse mail" disabled={ mode!=="add" ? true : false} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Champ Rôle */}
                <FormField
                    control={form.control}
                    name="role"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Rôle</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un rôle"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {roleMapping[role].label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Champ Département */}
                <FormField
                    control={form.control}
                    name="department"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Département</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un département"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPARTMENTS.map((department) => (
                                            <SelectItem key={department} value={department}>
                                                {departmentMapping[department].label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button  type="submit" className="mt-4">
                    {mode === "add" ? "Ajouter" : "Enregistrer"}
                </Button>
            </form>
        </Form>
    );
}
