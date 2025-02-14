import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { checkPageAccess } from "@/app/(protected)/session-wrapper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import Link from "next/link";
import { Building2 } from "lucide-react";

enum Department {
    INFORMATIQUE = "INFORMATIQUE",
    CIVIL = "CIVIL",
    ELECTRICITE = "ELECTRICITE",
    MECANIQUE = "MECANIQUE",
    GESTION = "GESTION",
    NO = "NO"
}

const departmentTranslations: Record<Department, string> = {
    [Department.INFORMATIQUE]: "Informatique",
    [Department.CIVIL]: "Génie Civil",
    [Department.ELECTRICITE]: "Électricité",
    [Department.MECANIQUE]: "Mécanique",
    [Department.GESTION]: "Gestion",
    [Department.NO]: "Non Assigné"
};

const departmentColors: Record<Department, { light: string, medium: string, dark: string }> = {
    [Department.INFORMATIQUE]: {
        light: "bg-blue-50",
        medium: "bg-blue-100",
        dark: "text-blue-600 hover:text-blue-700 hover:border-blue-500"
    },
    [Department.CIVIL]: {
        light: "bg-emerald-50",
        medium: "bg-emerald-100",
        dark: "text-emerald-600 hover:text-emerald-700 hover:border-emerald-500"
    },
    [Department.ELECTRICITE]: {
        light: "bg-yellow-50",
        medium: "bg-yellow-100",
        dark: "text-yellow-600 hover:text-yellow-700 hover:border-yellow-500"
    },
    [Department.MECANIQUE]: {
        light: "bg-red-50",
        medium: "bg-red-100",
        dark: "text-red-600 hover:text-red-700 hover:border-red-500"
    },
    [Department.GESTION]: {
        light: "bg-purple-50",
        medium: "bg-purple-100",
        dark: "text-purple-600 hover:text-purple-700 hover:border-purple-500"
    },
    [Department.NO]: {
        light: "bg-gray-50",
        medium: "bg-gray-100",
        dark: "text-gray-600 hover:text-gray-700 hover:border-gray-500"
    }
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
            <h1 className="text-3xl font-bold mb-8 text-center">Départements</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.values(Department).map((department) => {
                    const colors = departmentColors[department];
                    return (
                        <Link key={department} href={`/dashboard/departments/${department}`}>
                            <Card className={`group hover:scale-105 transition-all duration-300 border-2 bg-gray-100 hover:shadow-xl ${colors.dark}`}>
                                <CardHeader className="space-y-4 text-center pb-2">
                                    <div className={`mx-auto p-4 rounded-full transition-colors ${colors.medium} group-hover:opacity-90`}>
                                        <Building2 className={`w-8 h-8 ${colors.dark}`} />
                                    </div>
                                    <CardTitle className={`text-xl font-semibold ${colors.dark}`}>
                                        {departmentTranslations[department]}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-center text-sm mt-2">
                                        Département {departmentTranslations[department]}
                                    </p>
                                    <div className="mt-4 text-center">
                                        <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full transition-colors ${colors.light} ${colors.dark}`}>
                                            Voir les détails
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}