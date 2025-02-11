import UsersDatatable from "@/app/(protected)/settings/users/usersDatatable";
import {get_users} from "@/src/lib/data";

export default async function UsersComponent() {
    const users = await get_users();
    if (!users) {
        return
    }
    return (
        <>
            <UsersDatatable users={users} />
        </>
    )
}