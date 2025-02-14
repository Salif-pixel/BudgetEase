import {PropsWithChildren} from "react";

import { SidebarProvider} from "@/src/components/ui/sidebar";
import UserAppSidebar from "@/app/(protected)/userAppSidebard";
import SessionWrapper from "@/app/(protected)/session-wrapper";
import UserAppSidebarWrapper from "@/app/(protected)/userAppSidebarWrapper";




export default function Layout(props: PropsWithChildren ) {

    return (
        <SessionWrapper >
            <SidebarProvider >
                <UserAppSidebarWrapper/>
                {props.children}
            </SidebarProvider>
        </SessionWrapper>
    );
}