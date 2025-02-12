
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";

export default async function NewComponent (){
    const [session, hasAccess] = await Promise.all([
        headers(),
        auth.api.getSession({ headers: await headers() }),
        auth.api.getSession({ headers: await headers() }).then(session =>
            session ? checkPageAccess(session.user.id, "/needs/new") : false
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
                <h1>Demandes</h1>
            </div>
    )
}