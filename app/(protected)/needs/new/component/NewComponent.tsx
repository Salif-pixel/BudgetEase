import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkPageAccess } from "@/app/(protected)/session-wrapper";
import { get_user } from "@/src/lib/data";
import { CreateRequestForm, RequestsList } from "@/app/(protected)/needs/new/component/sortableListComponent";
import { prisma } from "@/src/lib/prisma";
import { Department } from "@prisma/client";

export default async function NewComponent() {
    const headersValue = await headers();

    const [session, user, hasAccess] = await Promise.all([
        auth.api.getSession({ headers: headersValue }),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? get_user(session.user.id) : null
        ),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? checkPageAccess(session.user.id, "/needs/new") : false
        )
    ]);

    if (!session || !user) {
        return redirect("/login");
    }

    if (!hasAccess) {
        return redirect("/not-found");
    }

    const requests = await prisma.request.findMany({
        orderBy: { createdAt: 'asc' },
        where: { department: user.department as Department ,userId:user.id},
        include: {
            needs: { include: { category: true } },
            user: { select: { image: true, name: true, email: true }}
        }
    });

    if (user.role === null) {
        return redirect("/not-found");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Nouvelle Demande de Besoins
                    </h1>
                    <p className="text-gray-600">
                        Créez et gérez vos demandes de besoins pour le département {user.department}
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Create Request Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Formulaire de Demande
                            </h2>
                            <CreateRequestForm user={user} />
                        </div>
                    </div>

                    {/* Requests List Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Liste des Demandes
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <RequestsList requests={requests} user={user} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Floating Button (Optional) */}

        </div>
    );
}










// <div className="fixed bottom-8 right-8">
//     <button
//         className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//
//     >
//         <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//         >
//             <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 10l7-7m0 0l7 7m-7-7v18"
//             />
//         </svg>
//     </button>
// </div>