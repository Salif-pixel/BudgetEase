// seedPages.ts
import { Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPages() {
    // Création ou mise à jour des pages

    // Page : Dashboard
    const dashboardPage = await prisma.page.upsert({
        where: { name: "dashboard" },
        update: {
            label: "Tableau de bord",
            route: "/dashboard",
        },
        create: {
            name: "dashboard",
            label: "Tableau de bord",
            route: "/dashboard",
        },
    });

    // Page : Département (tableau de bord des départements)
    const departmentPage = await prisma.page.upsert({
        where: { name: "department" },
        update: {
            label: "Départements",
            route: "/dashboard/departments",
        },
        create: {
            name: "department",
            label: "Départements",
            route: "/dashboard/departments",
        },
    });

    // Page : Gestion des besoins
    const needsPage = await prisma.page.upsert({
        where: { name: "needs" },
        update: {
            label: "Gestion des besoins",
            route: "/needs",
        },
        create: {
            name: "needs",
            label: "Gestion des besoins",
            route: "/needs",
        },
    });

    // Page : Faire une demande
    const needsNewPage = await prisma.page.upsert({
        where: { name: "needs_new" },
        update: {
            label: "Faire une demande",
            route: "/needs_new",
        },
        create: {
            name: "needs_new",
            label: "Faire une demande",
            route: "/needs_new",
        },
    });

    // Page : Gestion des priorités
    const needsPrioritiesPage = await prisma.page.upsert({
        where: { name: "needs_priorities" },
        update: {
            label: "Gestion des priorités",
            route: "/needs_priorities",
        },
        create: {
            name: "needs_priorities",
            label: "Gestion des priorités",
            route: "/needs_priorities",
        },
    });

    // Page : Gestion des utilisateurs
    const usersPage = await prisma.page.upsert({
        where: { name: "users" },
        update: {
            label: "Gestion des utilisateurs",
            route: "/settings/users",
        },
        create: {
            name: "users",
            label: "Gestion des utilisateurs",
            route: "/settings/users",
        },
    });

    // Page : Compte utilisateur
    const accountPage = await prisma.page.upsert({
        where: { name: "account" },
        update: {
            label: "Compte",
            route: "/settings/account",
        },
        create: {
            name: "account",
            label: "Compte",
            route: "/settings/account",
        },
    });

    // Page : Gestion des catégories de besoins
    const categoriesPage = await prisma.page.upsert({
        where: { name: "categories" },
        update: {
            label: "Gestion des catégories de besoins",
            route: "/settings/categories",
        },
        create: {
            name: "categories",
            label: "Gestion des catégories de besoins",
            route: "/settings/categories",
        },
    });

    // Page : Gestion des rôles
    const rolesPage = await prisma.page.upsert({
        where: { name: "roles" },
        update: {
            label: "Gestion des rôles",
            route: "/settings/roles",
        },
        create: {
            name: "roles",
            label: "Gestion des rôles",
            route: "/settings/roles",
        },
    });

    // Définir les accès pour chaque page
    // Exemple pour la page dashboard
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: dashboardPage.id, role: "ADMIN" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: dashboardPage.id } },
            role: "ADMIN",
            allowed: true,
        },
    });
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: dashboardPage.id, role: "DIRECTOR" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: dashboardPage.id } },
            role: "DIRECTOR",
            allowed: true,
        },
    });
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: dashboardPage.id, role: "PERSONAL" } },
        update: { allowed: false },
        create: {
            page: { connect: { id: dashboardPage.id } },
            role: "PERSONAL",
            allowed: false,
        },
    });
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: dashboardPage.id, role: "DEPARTMENT_HEAD" } },
        update: { allowed: false },
        create: {
            page: { connect: { id: dashboardPage.id } },
            role: "DEPARTMENT_HEAD",
            allowed: false,
        },
    });

    // Pour la page "department", autoriser ADMIN et DIRECTOR
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: departmentPage.id, role: "ADMIN" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: departmentPage.id } },
            role: "ADMIN",
            allowed: true,
        },
    });
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: departmentPage.id, role: "DIRECTOR" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: departmentPage.id } },
            role: "DIRECTOR",
            allowed: true,
        },
    });

    // Pour la page "needs", autoriser ADMIN, DIRECTOR et DEPARTMENT_HEAD, refuser pour PERSONAL
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: needsPage.id, role: "ADMIN" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: needsPage.id } },
            role: "ADMIN",
            allowed: true,
        },
    });
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: needsPage.id, role: "DIRECTOR" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: needsPage.id } },
            role: "DIRECTOR",
            allowed: true,
        },
    });
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: needsPage.id, role: "DEPARTMENT_HEAD" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: needsPage.id } },
            role: "DEPARTMENT_HEAD",
            allowed: true,
        },
    });
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: needsPage.id, role: "PERSONAL" } },
        update: { allowed: false },
        create: {
            page: { connect: { id: needsPage.id } },
            role: "PERSONAL",
            allowed: false,
        },
    });

    // Pour la page "needs_new", autoriser tous les rôles
    for (const role of ["ADMIN", "DIRECTOR", "DEPARTMENT_HEAD", "PERSONAL"] as Role[]) {
        await prisma.pageAccess.upsert({
            where: { pageId_role: { pageId: needsNewPage.id, role } },
            update: { allowed: true },
            create: {
                page: { connect: { id: needsNewPage.id } },
                role,
                allowed: true,
            },
        });
    }

    // Pour la page "needs_priorities", autoriser ADMIN et DIRECTOR
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: needsPrioritiesPage.id, role: "ADMIN" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: needsPrioritiesPage.id } },
            role: "ADMIN",
            allowed: true,
        },
    });
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: needsPrioritiesPage.id, role: "DIRECTOR" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: needsPrioritiesPage.id } },
            role: "DIRECTOR",
            allowed: true,
        },
    });

    // Pour la page "users", seuls ADMIN ont accès
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: usersPage.id, role: "ADMIN" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: usersPage.id } },
            role: "ADMIN",
            allowed: true,
        },
    });
    for (const role of ["DIRECTOR", "DEPARTMENT_HEAD", "PERSONAL"] as Role[]) {
        await prisma.pageAccess.upsert({
            where: { pageId_role: { pageId: usersPage.id, role } },
            update: { allowed: false },
            create: {
                page: { connect: { id: usersPage.id } },
                role,
                allowed: false,
            },
        });
    }

    // Pour la page "account", autoriser tous les rôles
    for (const role of ["ADMIN", "DIRECTOR", "DEPARTMENT_HEAD", "PERSONAL"] as Role[]) {
        await prisma.pageAccess.upsert({
            where: { pageId_role: { pageId: accountPage.id, role } },
            update: { allowed: true },
            create: {
                page: { connect: { id: accountPage.id } },
                role,
                allowed: true,
            },
        });
    }

    // Pour la page "categories", autoriser ADMIN et DIRECTOR
    for (const role of ["ADMIN", "DIRECTOR"] as Role[]) {
        await prisma.pageAccess.upsert({
            where: { pageId_role: { pageId: categoriesPage.id, role } },
            update: { allowed: true },
            create: {
                page: { connect: { id: categoriesPage.id } },
                role,
                allowed: true,
            },
        });
    }
    for (const role of ["DEPARTMENT_HEAD", "PERSONAL"] as Role[]) {
        await prisma.pageAccess.upsert({
            where: { pageId_role: { pageId: categoriesPage.id, role } },
            update: { allowed: false },
            create: {
                page: { connect: { id: categoriesPage.id } },
                role,
                allowed: false,
            },
        });
    }

    // Pour la page "roles", seuls ADMIN ont accès
    await prisma.pageAccess.upsert({
        where: { pageId_role: { pageId: rolesPage.id, role: "ADMIN" } },
        update: { allowed: true },
        create: {
            page: { connect: { id: rolesPage.id } },
            role: "ADMIN",
            allowed: true,
        },
    });
    for (const role of ["DIRECTOR", "DEPARTMENT_HEAD", "PERSONAL"] as Role[]) {
        await prisma.pageAccess.upsert({
            where: { pageId_role: { pageId: rolesPage.id, role } },
            update: { allowed: false },
            create: {
                page: { connect: { id: rolesPage.id } },
                role,
                allowed: false,
            },
        });
    }

    console.log("Pages et accès générés avec succès");
}

seedPages()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error("Erreur lors du seed :", error);
        process.exit(1);
    });
