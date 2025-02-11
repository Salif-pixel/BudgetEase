import {SidebarInset, SidebarTrigger} from "@/src/components/ui/sidebar";
import {Separator} from "@/src/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/src/components/ui/breadcrumb";
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";

export default async function Page (){
    const session = await auth.api.getSession(
        {headers : await headers()}
    );
    if (!session) {
        return redirect("/login");
    }

    const user = session?.user;

    const hasAccess = await checkPageAccess(user.id,  "/needs/priorities");
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
                                    besoins
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>priorités</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div>
                <h1>priorites</h1>
            </div>
        </SidebarInset>
    )
}