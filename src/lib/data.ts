import {prisma} from "@/src/lib/prisma";
import {Prisma} from "@prisma/client";


// users
export const get_user = async (id: string | "") => {
    const user = await prisma.user.findFirst({
        where: {
            id
        },
        include: {
            accounts: true,
        }
    });
    return user;
}
export const get_users = async (): Promise<
    Prisma.UserGetPayload<{ include: { accounts: true; Request: true } }>[]
> => {
    return await prisma.user.findMany({
        orderBy: {
            createdAt: "asc"
        },
        include: {
            accounts: true,
            Request: true
        }
    });
};

// data
export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return { success: true, data: categories };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: '' +
                'erreur lors de la recherche des catégories' };
    }
}

export async function getCategoryById(id: string) {
    try {
        const category = await prisma.category.findUnique({
            where: { id }
        });
        return { success: true, data: category };
    } catch (error) {
        console.error('Error fetching category:', error);
        return { success: false, error: 'Erreur lors de la recherche de cette catégorie' };
    }
}


