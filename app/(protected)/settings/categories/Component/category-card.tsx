"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CategoryForm } from "./category-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { deleteCategory, toggleCategoryStatus } from "@/src/actions/categories.action";
import { useCustomToast } from "@/src/components/spectrum/alert";
import { Edit3Icon, Trash, Info } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {cn} from "@/src/lib/utils";

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
        <Card className={cn("relative p-6 hover:shadow-lg  transition-shadow duration-200 group",category.isActive ? "bg-emerald-100":"bg-red-100")}>
            <div className="flex flex-col h-full justify-between gap-4">
                {/* En-tête avec badge de statut */}
                <div className="flex justify-between items-start">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <h3 className={cn("text-lg font-semibold text-muted-foreground",category.isActive ? "text-emerald-800":"text-red-800")}>
                                {category.name}
                            </h3>
                            <Badge  className={cn(category.isActive ? "bg-emerald-100 text-emerald-400" : "bg-red-100 text-red-400","gap-2 hover:bg-gray-100 ")}>
                                {category.isActive ? <span className={"bg-emerald-500 rounded-full h-2 w-2"}></span> : <span></span>}
                                {category.isActive ? "Actif" : "Inactif"}
                            </Badge>
                        </div>
                        {category.description && (
                            <div className="flex items-start gap-2 text-muted-foreground">
                                <Info className={cn("h-4 w-4 mt-1 flex-shrink-0",category.isActive ? "text-emerald-800":"text-red-800")} />
                                <p className={cn("text-sm leading-relaxed",category.isActive ? "text-emerald-800":"text-red-800")}>{category.description}</p>
                            </div>
                        )}
                    </div>
                    <Button
                        size="sm"
                        variant="destructive"
                        className={cn(category.isActive ? "bg-emerald-800":"bg-red-800")}
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit3Icon className={cn("h-4 w-4",category.isActive ? "text-emerald-200":"text-red-200")} />
                    </Button>
                </div>

                {/* Actions */}
                <div className={cn("flex justify-end gap-2 border-t pt-4",category.isActive ? "border-t-emerald-200 ":"border-t-red-200")}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleStatus}
                        className={cn("flex-1 hover:bg-background",category.isActive ? "text-red-800 ":"text-emerald-800")}
                    >
                        {category.isActive ? "Désactiver" : "Activer"}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={isDeleting}
                    >
                        <Trash className="h-4 w-4 " />

                    </Button>
                </div>
            </div>

            {/* Modals */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Modifier la catégorie</DialogTitle>
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
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Trash className="h-6 w-6 text-destructive" />
                            Confirmation requise
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Êtes-vous sûr de vouloir supprimer définitivement la catégorie{" "}
                            <span className="font-semibold text-foreground">
                                {category.name}
                            </span>
                            ? Cette action est irréversible.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="secondary"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirmed}
                                disabled={isDeleting}
                            >
                                Confirmer la suppression
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}