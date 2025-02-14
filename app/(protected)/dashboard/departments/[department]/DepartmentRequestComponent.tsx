import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { checkPageAccess } from "@/app/(protected)/session-wrapper";
import { redirect } from "next/navigation";
import { get_user } from "@/src/lib/data";
import { prisma } from "@/src/lib/prisma";
import { CreateRequestForm, RequestsList } from "@/app/(protected)/needs/new/component/sortableListComponent";
import { Button } from "@/src/components/ui/button";
import { exportToCSV } from "@/src/components/csv/export-csv";
import { Department } from "@prisma/client";
import { FileText, Filter, Download } from 'lucide-react';

interface RequestComponentProps {
    department: string;
}

export default async function DepartmentRequestComponent({ department }: RequestComponentProps) {
    const headersValue = await headers();

    const [session, user, hasAccess] = await Promise.all([
        auth.api.getSession({ headers: headersValue }),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? get_user(session.user.id) : null
        ),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? checkPageAccess(session.user.id, "/dashboard/departments") : false
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
        where: {
            status: { in: ["VALIDATED", "APPROVED"] },
            department: { equals: department as Department }
        },
        include: {
            needs: { include: { category: true } },
            user: { select: { image: true, name: true, email: true }}
        }
    });

    if (user.role === null) {
        return redirect("/not-found");
    }

    if (requests.length === 0) {
        return (
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-full p-4 mb-6">
                            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Aucune demande pour {department}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                            Il n'y a actuellement aucune demande validée ou approuvée pour ce département.
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Département {department}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {requests.length} demande{requests.length > 1 ? 's' : ''} validée{requests.length > 1 ? 's' : ''}
                        </p>
                    </div>

                </div>

                {/* Main Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                        <RequestsList requests={requests} user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}