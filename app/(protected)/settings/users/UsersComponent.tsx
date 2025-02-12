import UsersDatatable from "@/app/(protected)/settings/users/usersDatatable";
import {get_user, get_users} from "@/src/lib/data";
import {headers} from "next/headers";
import {auth} from "@/src/lib/auth";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";
import {redirect} from "next/navigation";

export default async function UsersComponent() {
    const headersValue = await headers(); // Éviter les appels multiples

    const [session, hasAccess, users] = await Promise.all([
        auth.api.getSession({ headers: headersValue }),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? checkPageAccess(session.user.id, "/settings/categories") : false
        ),
        get_users() // Ajout de la récupération des utilisateurs
    ]);

    if (!session) {
        return redirect("/login");
    }

    if (!hasAccess) {
        return redirect("/not-found");
    }

    return (
        <>
            <UsersDatatable users={users} />
        </>
    )
}