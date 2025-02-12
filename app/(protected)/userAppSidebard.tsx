
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {get_user} from "@/src/lib/data";
import {prisma} from "@/src/lib/prisma";
import AppSidebar from "@/src/components/app-sidebar";

export default async function UserAppSidebar() {
    const  session = await auth.api.getSession(
        {headers : await headers()}
    );
    if (!session) {
        return redirect("/login");
    }
    const user = await  get_user(session?.user.id);
    if(!user){
        return redirect("/login");
    }
    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        navMain: [
            {
                title: "Tableau de bord",
                url: "/dashboard",
                icon: "💳",
                isActive: true,
                items: [
                    {
                        title: "Suivi des dépenses",
                        url: "/dashboard",
                        icon: "💰",
                    },
                    {
                        title: "Départements",
                        url: "/dashboard/departments",
                        icon: "🏢",
                    },
                ],
            },

            {
                title: "Besoins",
                url: "/needs",
                icon: "🧾",
                items: [
                    {
                        title: "Faire une demande",
                        url: "/needs/new",
                        icon: "📑",
                    },
                    {
                        title: "Gestion des Besoins",
                        url: "/needs",
                        icon: "📦",
                    },
                    {
                        title: "Liste des priorités",
                        url: "/needs/priorities",
                        icon: "📝",
                    },
                ],
            },
            {
                title: "Paramètres",
                url: "/settings/users",
                icon: "⚙️",
                items: [
                    {
                        title: "Gestion des utilisateurs",
                        url: "/settings/users",
                        icon: "👥",
                    },
                    {
                        title: "Gestion des catégories",
                        url: "/settings/categories",
                        icon: "📂",
                    },
                    {
                        title: "Gestion des roles",
                        url: "/settings/roles",
                        icon: "🛡️",
                    },
                    {
                        title: "Compte",
                        url: "/settings/account",
                        icon: "👤",
                    },
                ],
            },
        ],


    }
    if (!user.role){
        return
    }

    const allowedPageAccess = await prisma.pageAccess.findMany({
        where: {
            role: user.role,
            allowed: true,
        },
        include: {
            page: true, // On inclut le modèle Page pour avoir accès aux routes
        },
    });

// Extraction des routes autorisées (en filtrant les éventuels null)
    const allowedRoutes = allowedPageAccess
        .map(access => access.page.route)
        .filter((route): route is string => !!route);

    function filterNav(navItems: any[], allowedRoutes: string[]): any[] {
        return navItems.reduce((acc: any[], item) => {
            let filteredSubItems: any[] | undefined;

            // Si l'élément contient des sous-items, on les filtre récursivement
            if (item.items) {
                filteredSubItems = filterNav(item.items, allowedRoutes);
            }

            // Vérifier si l'élément principal est autorisé (si une URL est présente)
            const isMainAllowed = item.url ? allowedRoutes.includes(item.url) : false;

            // On ajoute l'élément s'il est autorisé ou s'il possède des sous-items autorisés
            if (isMainAllowed || (filteredSubItems && filteredSubItems.length > 0)) {
                acc.push({
                    ...item,
                    items: filteredSubItems, // Note : si filteredSubItems est undefined, cela ne posera pas de problème selon votre logique
                });
            }
            return acc;
        }, []);
    }

// Application du filtrage sur votre objet de navigation
    const filteredNavMain = filterNav(data.navMain, allowedRoutes);


    return (
        <>
            <AppSidebar data={filteredNavMain} user={user}/>
        </>
    )
}