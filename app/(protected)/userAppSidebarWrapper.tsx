import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { get_user } from "@/src/lib/data";
import { prisma } from "@/src/lib/prisma";
import UserAppSidebarClient from "@/app/(protected)/userAppSidebard";

export default async function UserAppSidebarWrapper() {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    // Redirections si non authentifié
    if (!session) return redirect("/login");
    const user = await get_user(session.user.id);
    if (!user || !user.role) return redirect("/login");

    try {
        // Récupération des accès
        const allowedPageAccess = await prisma.pageAccess.findMany({
            where: {
                role: user.role,
                allowed: true,
                page: { route: { not: null } } // Filtre supplémentaire
            },
            include: { page: true },
        });

        // Transformation des routes avec vérification
        const allowedRoutes = allowedPageAccess
            .map(access => access.page?.route)
            .filter((route): route is string => !!route);
        return (
            <UserAppSidebarClient
                allowedRoutes={allowedRoutes || []} // Fallback explicite
                user={user}
            />
        );

    } catch (error) {
        console.error("Error fetching page access:", error);
        return <UserAppSidebarClient allowedRoutes={[]} user={user} />;
    }
}