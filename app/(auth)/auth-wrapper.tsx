
import { redirect } from "next/navigation";
// Assurez-vous que c'est le bon chemin // Assurez-vous que c'est le bon chemin
import {headers} from "next/headers";
import {auth} from "@/src/lib/auth";



export default async function AuthWrapper({ children }: { children: React.ReactNode }) {

    const checkSession = async () => {
            const session = await auth.api.getSession({
                headers: await headers(),
            });

            if (session) {
                // Redirige vers la page de connexion si la session est invalide
                redirect("/settings/account");
            }

    };

    await checkSession();


    return <>{children}</>;
}