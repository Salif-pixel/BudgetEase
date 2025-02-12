
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";

export default async function PrioritiesComponent (){
    const headersValue = await headers();

    const sessionPromise = auth.api.getSession({ headers: headersValue });

    const [session, hasAccess] = await Promise.all([
        sessionPromise,
        sessionPromise.then((session) =>
            session ? checkPageAccess(session.user.id, "/needs/priorities") : false
        ),
    ]);

    if (!session) {
        return redirect("/login");
    }

    if (!hasAccess) {
        return redirect("/not-found");
    }
    return (
            <div>
                <h1>priorites</h1>
            </div>

    )
}