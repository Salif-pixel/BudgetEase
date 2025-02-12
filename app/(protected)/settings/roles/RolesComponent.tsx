
import AccessManagment from "@/app/(protected)/settings/roles/AccessManagement";
import {prisma} from "@/src/lib/prisma";
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";

export default async function RolesComponent (){
    const headersValue = await headers();

    const [pages, pageAccess, session, hasAccess] = await Promise.all([
        prisma.page.findMany(),
        prisma.pageAccess.findMany(),
        auth.api.getSession({ headers: headersValue }),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? checkPageAccess(session.user.id, "/settings/roles") : false
        )
    ]);

// Vérification des données
    if (!pages || !pageAccess) {
        return;
    }

    if (!session) {
        return redirect("/login");
    }

    if (!hasAccess) {
        return redirect("/not-found");
    }

// Type Page
    type Page = {
        id: string;
        name: string;
        label: string; // doit être une string
        route: string; // doit être une string
    };

// Transformation des pages
    const newPages: Page[] = pages.map((item): Page => ({
        id: item.id,
        name: item.name,
        label: item.label ?? "", // Remplace null par ""
        route: item.route ?? "", // Remplace null par ""
    }));
    return (

            <div className={"w-full h-full p-8"}>
                <AccessManagment initialPages={newPages} initialAccess={pageAccess}/>
            </div>
    )
}