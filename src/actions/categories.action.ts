// app/actions/categories.ts
"use server"

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export type CategoryFormData = {
    name: string;
    description?: string;
}



export async function createCategory(data: CategoryFormData) {
    try {
        const category = await prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
            }
        });
        revalidatePath('/settings/categories');
        return { success: true, data: category };
    } catch (error) {
        return { success: false, error: 'Erreur lors de la creation des catégories' };
    }
}

export async function updateCategory(id: string, data: CategoryFormData) {
    try {
        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
            }
        });
        revalidatePath('/settings/categories');
        return { success: true, data: category };
    } catch (error) {
        return { success: false, error: 'erreur lors de la mise a jour de la catégorie' };
    }
}

export async function toggleCategoryStatus(id: string) {
    try {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) {
            return { success: false, error: "La catégorie n'a pas été trouvée " };
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                isActive: !category.isActive
            }
        });
        revalidatePath('/categories');
        return { success: true, data: updatedCategory };
    } catch (error) {
        return { success: false, error: 'Erreur lors du changement de status' };
    }
}

export async function deleteCategory(id: string) {
    try {
        // Vérifier si la catégorie est utilisée
        const needsCount = await prisma.need.count({
            where: { categoryId: id }
        });

        if (needsCount > 0) {
            return {
                success: false,
                error: 'la catégorie est utilisée par des besoins'
            };
        }

        await prisma.category.delete({
            where: { id }
        });
        revalidatePath('/categories');
        return { success: true };
    } catch (error) {

        return { success: false, error: 'erreur lors de la suppressions de la catégorie' };
    }
}