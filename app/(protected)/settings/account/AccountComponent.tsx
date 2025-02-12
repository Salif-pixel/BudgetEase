import {SidebarInset, SidebarTrigger} from "@/src/components/ui/sidebar";
import {Separator} from "@/src/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/src/components/ui/breadcrumb";
import ProfileComponent from "@/app/(protected)/settings/account/profileComponent";
import {auth} from "@/src/lib/auth";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {get_user} from "@/src/lib/data";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";


export default async function AccountComponent() {
    const headersValue = await headers();

    const [session, user, hasAccess] = await Promise.all([
        auth.api.getSession({ headers: headersValue }),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? get_user(session.user.id) : null
        ),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? checkPageAccess(session.user.id, "/settings/account") : false
        )
    ]);

    if (!session || !user) {
        return redirect("/login");
    }

    if (!hasAccess) {
        return redirect("/not-found");
    }

    return (

        <><ProfileComponent user={user} /></>
    )
}

