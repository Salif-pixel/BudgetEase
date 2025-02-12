
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb"
import { Separator } from "@/src/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/src/components/ui/sidebar"
import DashboardComponent from "@/app/(protected)/dashboard/DashboardComponent";
import {Suspense} from "react";
import LoaderComponent from "@/src/components/LoaderComponent";


export default function Page() {


  return (
      <SidebarInset >
        <header className="flex h-16 shrink-0 items-center gap-2 ">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>suivi des dépenses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Suspense fallback={<LoaderComponent/>}>
          <DashboardComponent/>
        </Suspense>
      </SidebarInset>

  )
}
