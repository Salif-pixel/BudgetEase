import {headers} from "next/headers";
import {auth} from "@/src/lib/auth";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";
import {redirect} from "next/navigation";
import {get_user} from "@/src/lib/data";
import {prisma} from "@/src/lib/prisma";
import {CreateRequestForm, RequestsList} from "@/app/(protected)/needs/new/component/sortableListComponent";
import {Department} from "@prisma/client";
import { Card, CardContent } from "@/src/components/ui/card";

export default async function NeedsComponent() {
    const headersValue = await headers();

    const [session, user, hasAccess] = await Promise.all([
        auth.api.getSession({ headers: headersValue }),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? get_user(session.user.id) : null
        ),
        auth.api.getSession({ headers: headersValue }).then(session =>
            session ? checkPageAccess(session.user.id, "/needs") : false
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
            department: user.department as Department,
            needs: { some: {} }
        },
        include: {
            needs: { include: { category: true } },
            user: { select: { image: true, name: true, email: true } }
        }
    });


    if(user.role === null) {
        return redirect("/not-found");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Demandes du département
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                {user.department}
                            </span>
                        </div>
                    </div>

                    <Card className="bg-white shadow-sm rounded-lg">
                        <CardContent className="p-6">
                            <RequestsList
                                requests={requests}
                                user={user}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}