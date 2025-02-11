import {SidebarInset, SidebarTrigger} from "@/src/components/ui/sidebar";
import {Separator} from "@/src/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/src/components/ui/breadcrumb";
import AccessManagment from "@/app/(protected)/settings/roles/AccessManagement";
import {prisma} from "@/src/lib/prisma";
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";

export default async function RolePage (){
    const pages = await prisma.page.findMany();
    const pageAccess = await prisma.pageAccess.findMany();
    if(!pages || !pageAccess){
        return
    }
    type Page = {
        id: string;
        name: string;
        label: string; // doit être une string, pas string | null
        route: string; // idem
    };

    const newPages: Page[] = pages.map((item): Page => ({
        id: item.id,
        name: item.name,
        label: item.label ?? "", // Si item.label est null, on retourne ""
        route: item.route ?? "", // Idem pour route
    }));

    const session = await auth.api.getSession(
        {headers : await headers()}
    );
    if (!session) {
        return redirect("/login");
    }

    const user = session?.user;

    const hasAccess = await checkPageAccess(user.id,  "/settings/roles");
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
                                    paramètres
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>roles</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={"w-full h-full p-8"}>
               <AccessManagment initialPages={newPages} initialAccess={pageAccess}/>
            </div>
        </SidebarInset>
    )
}