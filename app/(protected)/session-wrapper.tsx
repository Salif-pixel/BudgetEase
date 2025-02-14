import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { get_user } from "@/src/lib/data";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

// Helper pour vérifier l'accès à une page
export   async function checkPageAccess(userId: string, currentPath: string) {
    try {
        // Récupérer l'utilisateur avec son rôle
        const user = await prisma.user.findFirst({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || !user.role) {
            return false;
        }

        // Récupérer la page correspondant au chemin actuel
        const page = await prisma.page.findFirst({
            where: {
                route: currentPath,
            },
            include: {
                accessControls: {
                    where: {
                        role: user.role,
                    },
                },
            },
        });

        if (!page) {
            // Si la page n'existe pas dans la base de données, on considère qu'elle est accessible
            // Vous pouvez modifier ce comportement selon vos besoins
            return true;
        }

        // Vérifier si l'accès est autorisé pour le rôle de l'utilisateur
        const hasAccess = page.accessControls.some((access) => access.allowed);

        return hasAccess;
    } catch (error) {
        console.error("Erreur lors de la vérification de l'accès à la page:", error);
        return false;
    }
}

// Fonction pour vérifier la session et l'utilisateur
async function verifySessionAndUser() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            redirect("/login");
        }
        const user = await get_user(session.user.id);
        if (!user) {
            redirect("/login");
        }

        return { session, user };
    }catch{
        redirect("/login");
    }



}



export default async function SessionWrapper({ children }: { children: React.ReactNode }) {
    try {
         await verifySessionAndUser();



        return <>{children}</>;
    } catch (error) {

        redirect("/login");
    }
}