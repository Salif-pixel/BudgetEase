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


export default async function ProfilePage() {
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
    const hasAccess = await checkPageAccess(user.id,  "/settings/account");
    if (!hasAccess) {
        return redirect("/not-found");
    }

    return (
        <SidebarInset >
            <header className="flex h-16 shrink-0 items-center gap-2 ">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    paramètre
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Compte</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <ProfileComponent user={user} />

        </SidebarInset>
    )
}

