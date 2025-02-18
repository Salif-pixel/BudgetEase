'use client';

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { Role } from "@prisma/client";

import {useCustomToast} from "@/src/components/spectrum/alert";
import {updatePageAccessManagment} from "@/src/actions/roles.action";


// Types
type Page = {
    id: string;
    name: string;
    label: string;
    route: string | null;
}

type PageAccess = {
    id: string;
    pageId: string;
    role: Role;
    allowed: boolean;
}

// Traduction des rôles
const roleTranslations: Record<Role, string> = {
    PERSONAL: "Personnel",
    DEPARTMENT_HEAD: "Chef de département",
    DIRECTOR: "Directeur",
    ADMIN: "Administrateur"
};

export default function PageAccessManagement({
                                                 initialPages,
                                                 initialAccess
                                             }: {
    initialPages: Page[],
    initialAccess: PageAccess[]
}) {
    const [role, setRole] = useState<Role | "">("");
    const [pages] = useState<Page[]>(initialPages);
    const [pageAccess, setPageAccess] = useState<PageAccess[]>(initialAccess);
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const { showToast } = useCustomToast();

    const handleRoleChange = (value: Role) => {
        setRole(value);
    };

    const isPageAllowed = (pageId: string, selectedRole: Role) => {
        return pageAccess.find(
            access => access.pageId === pageId && access.role === selectedRole
        )?.allowed || false;
    };

    const handleAccessToggle = async (pageId: string, selectedRole: Role) => {
        if (!selectedRole) return;

        const loadingKey = `${pageId}-${selectedRole}`;
        setLoading(prev => ({ ...prev, [loadingKey]: true }));

        try {
            const newAllowed = !isPageAllowed(pageId, selectedRole);
            const result = await updatePageAccessManagment(pageId, selectedRole, newAllowed);

            if (result.success) {
                // Mise à jour optimiste de l'état local
                if (result.data) {
                setPageAccess(prev => {
                    const existingIndex = prev.findIndex(
                        access => access.pageId === pageId && access.role === selectedRole
                    );

                    if (existingIndex >= 0) {
                        const newAccess = [...prev];
                        newAccess[existingIndex] = {
                            ...newAccess[existingIndex],
                            allowed: newAllowed
                        };
                        return newAccess;
                    }

                    return [...prev, {
                        id: result.data.id as string || "",
                        pageId,
                        role: selectedRole,
                        allowed: newAllowed
                    }];
                });
                    }
                showToast(
                    "Accès mis à jour",
                    `Les permissions ont été mises à jour avec succès`,
                    "success"
                );
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            showToast(
                "Erreur",
                "Une erreur est survenue lors de la mise à jour des accès",
                "error"
            );
        } finally {
            setLoading(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const PageCard = ({ page }: { page: Page }) => {
        const loadingKey = `${page.id}-${role}`;
        const isAllowed = role ? isPageAllowed(page.id, role as Role) : false;

        return (
            <Card className="flex items-start space-x-4 p-4 hover:shadow-md transition-shadow">
                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium">{page.label || page.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                {page.route}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {loading[loadingKey] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Switch
                                    checked={isAllowed}
                                    onCheckedChange={() => handleAccessToggle(page.id, role as Role)}
                                    disabled={!role}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <Card className="p-8 lg:p-16 mx-auto">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <CardTitle>Gestion des accès aux pages</CardTitle>
                </div>
                <CardDescription>
                    Configurez les accès aux différentes pages selon les rôles
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-4">
                    <Label htmlFor="role">Rôle</Label>
                    <Select onValueChange={handleRoleChange as (value: string) => void} value={role}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Sélectionnez un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(roleTranslations)
                                .filter(([roleKey]) => roleKey !== "ADMIN") // Filtrer "ADMIN"
                                .map(([roleKey, roleLabel]) => (
                                    <SelectItem key={roleKey} value={roleKey}>
                                        {roleLabel}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                <AnimatePresence>
                    {role && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <h3 className="text-lg font-medium mb-4">Pages</h3>
                            <div className="grid gap-4">
                                {pages.map((page) => (
                                    <PageCard
                                        key={page.id}
                                        page={page}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}


