
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";

export default async function CategoriesComponent (){
    const [session, hasAccess] = await Promise.all([
        headers(),
        auth.api.getSession({ headers: await headers() }),
        auth.api.getSession({ headers: await headers() }).then(session =>
            session ? checkPageAccess(session.user.id, "/settings/categories") : false
        )
    ]);

    if (!session) {
        return redirect("/login");
    }

    if (!hasAccess) {
        return redirect("/not-found");
    }
    return (
            <div>
                <h1>catégories</h1>
            </div>
    )
}