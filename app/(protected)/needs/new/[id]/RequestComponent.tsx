import {prisma} from "@/src/lib/prisma";
import {NeedForm, NeedsList} from "@/app/(protected)/needs/new/component/sortableListComponent";

interface RequestComponentProps {
    id: string;
}

export default async function RequestComponent({ id }: RequestComponentProps) {
    const request = await prisma.request.findFirst({
        where: { id },
        include: {
            needs: {
                include: {
                    category: true,
                },
            },
        },
    });

    const categories = await prisma.category.findMany({
        where: {isActive: true}
    })
    if (!request) {
        return <div>Demande non trouvée</div>
    }

    return (
        <div className="container mx-auto py-8 gap-4 p-8 space-y-4">
            <h1 className="text-2xl font-bold mb-4">{request.title}</h1>
            <p className="text-gray-600 mb-8">{request.description}</p>

            <div className="grid grid-cols-1 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Ajouter un besoin</h2>
                    <NeedForm requestId={request.id} categories={categories}/>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Liste des besoins</h2>
                    <NeedsList needs={request.needs} requestId={request.id} categories={categories}/>
                </div>
            </div>
        </div>
    );
}