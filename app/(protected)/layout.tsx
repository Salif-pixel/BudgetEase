import {PropsWithChildren} from "react";

import { SidebarProvider} from "@/src/components/ui/sidebar";
import UserAppSidebar from "@/app/(protected)/userAppSidebard";
import SessionWrapper from "@/app/(protected)/session-wrapper";




export default function Layout(props: PropsWithChildren ) {

    return (
        <SessionWrapper >
            <SidebarProvider >
                <UserAppSidebar />
                {props.children}
            </SidebarProvider>
        </SessionWrapper>
    );
}