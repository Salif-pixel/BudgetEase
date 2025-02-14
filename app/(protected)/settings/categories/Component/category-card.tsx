"use client";


import React, { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Info, Edit3Icon, Trash } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {useCustomToast} from "@/src/components/spectrum/alert";
import {deleteCategory, toggleCategoryStatus} from "@/src/actions/categories.action";
import {CategoryForm} from "@/app/(protected)/settings/categories/Component/category-form";
type Props = {
    category: {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
    };
};
export function CategoryCard({ category }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { showToast } = useCustomToast();

    async function handleToggleStatus() {
        try {
            showToast(
                "Mise à jour du statut...",
                "Modification en cours du statut de la catégorie.",
                "info"
            );
            await toggleCategoryStatus(category.id);
            showToast(
                "Statut mis à jour",
                "Le statut de la catégorie a été modifié avec succès.",
                "success"
            );
        } catch (error) {
            showToast(
                "Erreur",
                "Une erreur est survenue lors de la mise à jour.",
                "error"
            );
        }
    }

    async function handleDeleteConfirmed() {
        setIsDeleting(true);
        try {
            showToast(
                "Suppression en cours...",
                "Veuillez patienter pendant la suppression.",
                "info"
            );
            const result = await deleteCategory(category.id);
            if (!result.success) {
                showToast("Erreur", result.error, "error");
            } else {
                showToast(
                    "Succès",
                    "La catégorie a été supprimée définitivement.",
                    "success"
                );
            }
        } catch (error) {
            showToast(
                "Erreur",
                "Échec de la suppression de la catégorie.",
                "error"
            );
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    }

    return (
        <Card className={cn(
            "relative w-full transform transition-all duration-300",
            "hover:shadow-lg hover:scale-[1.02]",
            "sm:p-4 p-4",
            category.isActive ? "bg-emerald-50/80" : "bg-red-50/80"
        )}>
            <div className="flex flex-col h-full justify-between gap-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className={cn(
                                "text-lg font-semibold",
                                category.isActive ? "text-emerald-800" : "text-red-800"
                            )}>
                                {category.name}
                            </h3>
                            <Badge className={cn(
                                "text-sm font-medium transition-colors",
                                category.isActive
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                            )}>
                                <span className={cn(
                                    "inline-block h-2 w-2 rounded-full mr-2",
                                    category.isActive ? "bg-emerald-500" : "bg-red-500"
                                )} />
                                {category.isActive ? "Actif" : "Inactif"}
                            </Badge>
                        </div>
                        {category.description && (
                            <div className="flex items-start gap-3">
                                <Info className={cn(
                                    "h-5 w-5 mt-0.5 flex-shrink-0",
                                    category.isActive ? "text-emerald-600" : "text-red-600"
                                )} />
                                <p className={cn(
                                    "text-sm leading-relaxed",
                                    category.isActive ? "text-emerald-700" : "text-red-700"
                                )}>
                                    {category.description}
                                </p>
                            </div>
                        )}
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                            "rounded-full p-2 h-auto hover:scale-110 transition-transform",
                            category.isActive
                                ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                                : "bg-red-100 hover:bg-red-200 text-red-700"
                        )}
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit3Icon className="h-4 w-4" />
                    </Button>
                </div>

                {/* Actions Section */}
                <div className={cn(
                    "flex flex-col sm:flex-row gap-3 border-t pt-4",
                    category.isActive ? "border-emerald-200" : "border-red-200"
                )}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleStatus}
                        className={cn(
                            "flex-1 transition-colors",
                            category.isActive
                                ? "text-red-700 hover:bg-red-50"
                                : "text-emerald-700 hover:bg-emerald-50"
                        )}
                    >
                        {category.isActive ? "Désactiver" : "Activer"}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={isDeleting}
                        className="sm:w-auto w-full"
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                    </Button>
                </div>
            </div>

            {/* Modals */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            Modifier la catégorie
                        </DialogTitle>
                    </DialogHeader>
                    <CategoryForm
                        category={category}
                        onSuccess={() => setIsEditing(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <Trash className="h-6 w-6 text-red-600" />
                            Confirmation requise
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Êtes-vous sûr de vouloir supprimer définitivement la catégorie{" "}
                            <span className="font-semibold text-gray-900">
                                {category.name}
                            </span>
                            ? Cette action est irréversible.
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="sm:w-auto w-full"
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirmed}
                                disabled={isDeleting}
                                className="sm:w-auto w-full"
                            >
                                {isDeleting ? "Suppression..." : "Confirmer la suppression"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default CategoryCard;