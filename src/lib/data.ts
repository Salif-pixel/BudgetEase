import {prisma} from "@/src/lib/prisma";


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
export const get_users = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "asc"
        },
        include: {
            accounts: true,
        }
    });
    return users;
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


