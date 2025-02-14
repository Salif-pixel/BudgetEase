import { prisma } from "@/src/lib/prisma";
import { NeedForm, NeedsList } from "@/app/(protected)/needs/new/component/sortableListComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CalendarIcon, ClipboardList, PlusCircle } from "lucide-react";

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
        where: { isActive: true }
    });

    if (!request) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Card className="w-full max-w-lg">
                    <CardContent className="flex flex-col items-center p-6">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <ClipboardList className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Demande non trouvée</h2>
                        <p className="text-gray-500 text-center">
                            La demande que vous recherchez n'existe pas ou a été supprimée.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const createdAt = new Date(request.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-36 py-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
                        <div className="flex items-center gap-2 text-gray-500">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Créée le {createdAt}</span>
                        </div>
                    </div>
                    <Badge
                        variant="secondary"
                        className="w-fit"
                    >
                        {request.needs.length} besoin{request.needs.length > 1 ? 's' : ''}
                    </Badge>
                </div>
                {request.description && (
                    <p className="mt-4 text-gray-600 max-w-3xl">
                        {request.description}
                    </p>
                )}
            </div>

            <div className="space-y-8">
                {/* Add Need Section */}

                        <NeedForm requestId={request.id} categories={categories} />


                {/* Needs List Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-gray-500" />
                        <CardTitle>Liste des besoins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {request.needs.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Aucun besoin n'a encore été ajouté à cette demande.
                            </div>
                        ) : (
                            <NeedsList
                                needs={request.needs}
                                requestId={request.id}
                                categories={categories}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}