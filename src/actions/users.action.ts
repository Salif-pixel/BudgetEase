"use server"


import {prisma} from "@/src/lib/prisma";
import {revalidatePath} from "next/cache";
import { v4 as uuidv4 } from "uuid";
import {UserFormValues} from "@/app/(protected)/settings/users/UserForm";

export const UpdateOrCreateuser = async(data:UserFormValues) => {
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        });
        if (!existingUser) {
            await prisma.user.create({
                data: {
                    id: uuidv4(),
                    email: data.email,
                    emailVerified: true,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    name: data.name,
                    role: data.role,
                    department: data.department,
                }
            });
            revalidatePath("/settings/users");
        }
    } catch {
        return {error: "Erreur lors de la création de l'utilisateur"};
    }

    try {

         await prisma.user.update({
            where: {
               email: data.email
            },
            data: {
                name: data.name,
                role: data.role,
                updatedAt: new Date(),
                department: data.department,
            }
        });
        revalidatePath("/settings/users");

    }catch {
        return {error: "Erreur lors de la mise à jour de l'utilisateur"};
    }

}

export const DeleteUsers = async (id: string[]) => {
    try {
        await prisma.user.deleteMany({
            where: {
                id: {
                    in: id
                }
            }
        });
        revalidatePath("/settings/users");
    } catch {
        return {error: "Erreur lors de la suppression de l'utilisateur"};
    }
}