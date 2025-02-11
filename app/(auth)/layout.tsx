import {PropsWithChildren} from "react";
import AuthWrapper from "@/app/(auth)/auth-wrapper";






export default function Layout(props: PropsWithChildren) {
    return (
        <AuthWrapper>
            {props.children}
        </AuthWrapper>


    );
}