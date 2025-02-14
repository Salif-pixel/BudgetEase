import {headers} from "next/headers";
import {auth} from "@/src/lib/auth";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";
import {redirect} from "next/navigation";
import {get_user} from "@/src/lib/data";
import {prisma} from "@/src/lib/prisma";
import {CreateRequestForm, RequestsList} from "@/app/(protected)/needs/new/component/sortableListComponent";
import {Button} from "@/src/components/ui/button";
import {exportToCSV} from "@/src/components/csv/export-csv";
import {Department} from "@prisma/client";
interface RequestComponentProps {
    department: string;
}
export default async function DepartmentRequestComponent({ department }: RequestComponentProps){
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
        where: { department: department as Department   ,status: { in: ["VALIDATED", "APPROVED"] } },
        include: { needs: { include: { category: true } } , user:{select:{image:true , name:true ,email:true}}}
    })

    if(user.role===null)
    {
        return redirect("/not-found");
    }
    return (
        <div className="flex flex-col gap-8">
            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 p-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400 mx-auto mb-6"
                    >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" x2="8" y1="13" y2="13" />
                        <line x1="16" x2="8" y1="17" y2="17" />
                        <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Aucune demande trouvée
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Aucune demande n'a été créée pour ce département.
                    </p>


                </div>
            ) : (
                <div className="container p-8 gap-2 space-y-8 mx-auto">
                    <div className="flex justify-between items-center">
                        <RequestsList requests={requests} user={user} />

                    </div>
                </div>

            )}
        </div>
    );
}

