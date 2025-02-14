"use client";
import { usePathname } from "next/navigation";
import AppSidebar from "@/src/components/app-sidebar";

type NavItem = {
    title: string;
    url: string;
    icon: string;
    items?: NavItem[];
    isActive?: boolean;
};

type FilteredNavItem = NavItem & {
    isActive: boolean;
    items?: FilteredNavItem[];
};

type Props = {
    user: any; // Typez selon votre modèle user
    allowedRoutes: string[];
};

export default function UserAppSidebarClient({ user, allowedRoutes }: Props) {
    const currentPath = usePathname();
    // Configuration de base de la navigation
    const navConfig = [
        {
            title: "Tableau de bord",
            url: "/dashboard",
            icon: "💳",
            items: [
                { title: "Suivi des dépenses", url: "/dashboard", icon: "💰" },
                { title: "Départements", url: "/dashboard/departments", icon: "🏢" },
            ],
        },
        {
            title: "Besoins",
            url: "/needs",
            icon: "🧾",
            items: [
                { title: "Faire une demande", url: "/needs/new", icon: "📑" },
                { title: "Gestion des Besoins", url: "/needs", icon: "📦" },
                { title: "Liste des priorités", url: "/needs/priorities", icon: "📝" },
            ],
        },
        {
            title: "Paramètres",
            url: "/settings/users",
            icon: "⚙️",
            items: [
                { title: "Gestion des utilisateurs", url: "/settings/users", icon: "👥" },
                { title: "Gestion des catégories", url: "/settings/categories", icon: "📂" },
                { title: "Gestion des roles", url: "/settings/roles", icon: "🛡️" },
                { title: "Compte", url: "/settings/account", icon: "👤" },
            ],
        },
    ];

    // Fonction de filtrage améliorée avec gestion de l'état actif
    const filterNav = (items: any[], routes: string[]): any[] => {
        return items.reduce((acc, item) => {
            const isAllowed = routes.includes(item.url);
            const hasAllowedChildren = item.items?.some((subItem: any) => routes.includes(subItem.url));

            if (!isAllowed && !hasAllowedChildren) return acc;
            const filteredItem = {
                ...item,
                isActive: currentPath == item.url, // Vérifie si c'est exactement la route actuelle
                items: item.items ? filterNav(item.items, routes) : undefined,
            };

            // Si un sous-menu est actif, rendre aussi le parent actif
            if (filteredItem.items?.some((subItem: any) => subItem.isActive)) {
                filteredItem.isActive = true;
            }

            acc.push(filteredItem);
            return acc;
        }, []);
    };

    const filteredNavMain = filterNav(navConfig, allowedRoutes);


    return <AppSidebar
        data={filteredNavMain}
        user={user}
    />;
}