import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { checkPageAccess } from "@/app/(protected)/session-wrapper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import Link from "next/link";

enum Department {
    INFORMATIQUE = "INFORMATIQUE",
    CIVIL = "CIVIL",
    ELECTRICITE = "ELECTRICITE",
    MECANIQUE = "MECANIQUE",
    GESTION = "GESTION",
    NO = "NO"
}

// Traduction des départements pour affichage
const departmentTranslations: Record<Department, string> = {
    [Department.INFORMATIQUE]: "Informatique",
    [Department.CIVIL]: "Génie Civil",
    [Department.ELECTRICITE]: "Électricité",
    [Department.MECANIQUE]: "Mécanique",
    [Department.GESTION]: "Gestion",
    [Department.NO]: "Non Assigné"
};

export default async function DepartmentsComponent() {
    const headersValue = await headers();

    const sessionPromise = auth.api.getSession({ headers: headersValue });

    const [session, hasAccess] = await Promise.all([
        sessionPromise,
        sessionPromise.then((session) =>
            session ? checkPageAccess(session.user.id, "/dashboard/departments") : false
        )
    ]);

    if (!session) {
        return redirect("/login");
    }

    if (!hasAccess) {
        return redirect("/not-found");
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Départements</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(Department).map((department) => (
                    <Link key={department} href={`/dashboard/departments/${department}`}>
                        <Card className="hover:shadow-lg transition cursor-pointer">
                            <CardHeader>
                                {/* Afficher le nom en français */}
                                <CardTitle>{departmentTranslations[department]}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">Département {departmentTranslations[department]}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
