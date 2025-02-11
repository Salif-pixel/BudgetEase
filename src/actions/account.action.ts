"use server"

import {prisma} from "@/src/lib/prisma";

import {revalidatePath} from "next/cache";
import bcrypt from "bcryptjs";
import {Account, User} from "@prisma/client";
import {Resend} from "resend";

export  const updateImageAccount = async (id: string,  image: string , background: string ) => {
    try {
        await prisma.user.update({
            where: {
                id
            },
            data: {
                image,
                background,
            }
        });
    } catch {
        return { error: "Error while updating the account" };
    }
    revalidatePath("/settings/account");
}

export const ChangePassword = async (user:User & { accounts: Account[] }, currentPassword: string, newPassword: string, confirmPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(currentPassword, salt);
    const result = await bcrypt.compare(currentPassword, hash);
    if (!result) {
        return { error: "le mot de passe est incorrect" };
    }
    if (newPassword !== confirmPassword) {
        return { error: "les mots de passe ne correspondent pas" };
    }
    const newSalt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, newSalt);

    try {
        // Mise à jour du mot de passe dans l'account
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                accounts: {
                    update: {
                        where: {
                            id: user.accounts[0].id,
                        },
                        data: {
                            password: newHash,
                        },
                    },
                },
            },
        });
    } catch{
        return { error: "Erreur lors de la mise à jour du mot de passe" };
    }

    revalidatePath("/settings/account");
};

export const updateUserProfile = async (id: string, values: { name: string; email: string }) => {

    try {
        await prisma.user.update({
            where: {
                id,
            },
            data: {
                name: values.name,
                email: values.email,
            },
        });
    } catch {
        return { error: "Erreur lors de la mise à jour du profil" };
    }

    revalidatePath("/settings/account");
}