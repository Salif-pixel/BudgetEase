import {headers} from "next/headers";
import {auth} from "@/src/lib/auth";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";
import {redirect} from "next/navigation";

export default async function NeedsComponent(){
    const [session, hasAccess] = await Promise.all([
        headers(),
        auth.api.getSession({ headers: await headers() }),
        auth.api.getSession({ headers: await headers() }).then(session =>
            session ? checkPageAccess(session.user.id, "/needs") : false
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
            <h1>besoins</h1>
        </div>
    );
}