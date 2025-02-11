'use server'



import {revalidatePath} from "next/cache";
import {prisma} from "@/src/lib/prisma";
import {Role} from "@prisma/client";

export async function updatePageAccessManagment(pageId: string, role: Role, allowed: boolean) {
    try {
        const pageAccess = await prisma.pageAccess.upsert({
            where: {
                pageId_role: {
                    pageId,
                    role,
                },
            },
            update: {
                allowed,
            },
            create: {
                pageId,
                role,
                allowed,
            },
        })

        revalidatePath("/settings/roles")
        return { success: true, data: pageAccess }
    } catch {
        return { success: false, error: 'Erreur lors de la mise à jour des accès' }
    }
}