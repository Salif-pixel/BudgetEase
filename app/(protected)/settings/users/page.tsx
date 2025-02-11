import {SidebarInset, SidebarTrigger} from "@/src/components/ui/sidebar";
import {Separator} from "@/src/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/src/components/ui/breadcrumb";

import {Suspense} from "react";
import UsersComponent from "@/app/(protected)/settings/users/UsersComponent";
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";

export default async function UsersPage() {
    const session = await auth.api.getSession(
        {headers : await headers()}
    );
    if (!session) {
        return redirect("/login");
    }

    const user = session?.user;

    const hasAccess = await checkPageAccess(user.id,  "/settings/users");
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
                                <BreadcrumbPage>Gestion des utilisateurs</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={"w-full h-full flex flex-col gap-4"}>
                <Suspense fallback={<div className={`flex flex-col items-center justify-center h-screen`}>
                    <div className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary`}></div>
                </div>}>
                    <UsersComponent/>
                </Suspense>
            </div>

        </SidebarInset>
    )
}