// src/app/actions/logout.ts
"use server";
import { redirect } from "next/navigation";
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";

export async function logout() {
    await auth.api.signOut({
        headers: await headers()
    })
    redirect("/");
}
