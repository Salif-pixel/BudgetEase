"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { createCategory, updateCategory, CategoryFormData } from "@/src/actions/categories.action";
import {useCustomToast} from "@/src/components/spectrum/alert";

type Props = {
    category?: {
        id: string;
        name: string;
        description: string ;
    };
    onSuccess?: () => void;
};

export function CategoryForm({ category, onSuccess }: Props) {
    const { showToast } = useCustomToast();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormData>({
        defaultValues: category || {
            name: "",
            description: "",
        },
    });

    async function onSubmit(data: CategoryFormData) {
        setIsLoading(true);
        try {
            if (category) {
                showToast(
                    "mise à jour de la catégorie ....",
                    "Veuillez patienter pendant que nous mettons à jour le catégorie de la catégorie.",
                    "info"
                );
                await updateCategory(category.id, data);
                showToast(
                    "mise à jour de la catégorie",
                    "la catégorie a été mise à jour avec succès",
                    "success"
                );
            } else {
                showToast(
                    "creation du catégorie ....",
                    "Veuillez patienter pendant que nous mettons à jour le catégorie de la catégorie.",
                    "info"
                );
                await createCategory(data);
                showToast(
                    "creation de la catégorie",
                    "la catégorie a été créée avec succès",
                    "success"
                );
            }
            onSuccess?.();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input
                    {...register("name", { required: "Le nom est requis" })}
                    placeholder="Nom de la catégorie"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div>
                <Textarea
                    {...register("description")}
                    placeholder="Description (optionnelle)"
                />
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? "En cours..." : category ? "Modifier" : "Créer"}
            </Button>
        </form>
    );
}
