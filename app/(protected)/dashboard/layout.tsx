import {PropsWithChildren} from "react";
import {AppSidebar} from "@/src/components/app-sidebar";
import { SidebarProvider} from "@/src/components/ui/sidebar";


export default function Layout(props: PropsWithChildren) {
    return (
        <SidebarProvider >
            <AppSidebar  />
            {props.children}
        </SidebarProvider>
    );
}