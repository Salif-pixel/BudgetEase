
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";

import {get_user} from "@/src/lib/data";
import {CreateRequestForm, RequestsList} from "@/app/(protected)/needs/new/component/sortableListComponent";
import {prisma} from "@/src/lib/prisma";
import {CreateRequestInput} from "@/app/(protected)/needs/new/component/types";

export default async function NewComponent (){
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
        where: { department: user.department ?? undefined },
        include: { needs: { include: { category: true } } , user:{select:{image:true , name:true ,email:true}}}
    })

if(user.role===null)
{
    return redirect("/not-found");
}
    return (
        <div className="container p-8 gap-2 space-y-8 mx-auto ">
            <CreateRequestForm user={user}  />
            <RequestsList requests={requests} user={user}  />
        </div>
    )
}