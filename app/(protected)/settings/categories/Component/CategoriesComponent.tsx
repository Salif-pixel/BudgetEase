import {AddCategoryButton} from "@/app/(protected)/settings/categories/Component/add-category-button";
import {CategoryCard} from "@/app/(protected)/settings/categories/Component/category-card";
import {checkPageAccess} from "@/app/(protected)/session-wrapper";
import {redirect} from "next/navigation";
import {auth} from "@/src/lib/auth";
import {headers} from "next/headers";
import {getCategories} from "@/src/lib/data";

export default async function CategoriesPage() {
    const headersValue = await headers();
    const sessionPromise = auth.api.getSession({ headers: headersValue });

    const [session, hasAccess, categoriesResponse] = await Promise.all([
        sessionPromise,
        sessionPromise.then((session) =>
            session ? checkPageAccess(session.user.id, "/settings/categories") : false
        ),
        getCategories(),
    ]);

    if (!session) return redirect("/login");
    if (!hasAccess) return redirect("/not-found");
    // ✅ Correction ici
    const categories = categoriesResponse.success ? categoriesResponse.data ?? [] : [];
    const data = categories.map((category) => ({
        ...category,
        description: category.description ?? "", // Remplace null par ""
    }));

    return (
        <div className="container mx-auto py-6 px-8">
            <div className="flex justify-between items-center mb-6 ">
                <h1 className="text-2xl font-bold">Gestion des catégories</h1>
                <AddCategoryButton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4 w-full p-8">
                {data.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </div>
    );
}
