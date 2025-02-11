import {prisma} from "@/src/lib/prisma";


// users
export const get_user = async (id: string | "") => {
    const user = await prisma.user.findUnique({
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

// roles


