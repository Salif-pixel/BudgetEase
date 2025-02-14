'use client'
import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/src/components/ui/card'
import {Button, buttonVariants} from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
    CreateRequestFormProps,
    RequestsListProps,
    RequestCardProps,
    NeedFormProps,
    NeedsListProps,
    CreateRequestInput,
    CreateNeedInput, Category, RequestType,
} from './types'
import {zodResolver} from "@hookform/resolvers/zod";
import {$Enums, Need, RequestStatus} from "@prisma/client";
import {
    createNeed,
    createRequest, deleteNeed,
    deleteRequest,
    updateNeed,
    updateRequestStatus
} from "@/src/actions/request_need.action";
import {useCustomToast} from "@/src/components/spectrum/alert";
import Link from "next/link";
import {Pencil, PlusCircle, Trash} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/src/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import {exportToCSV} from "@/src/components/csv/export-csv";
import {log} from "node:util";

// Schéma de validation pour la création d'une demande
const createRequestSchema = z.object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
    description: z.string().optional(),
    department: z.string().nonempty('Le département est requis'),
});

export const CreateRequestForm: React.FC<CreateRequestFormProps> = ({ user }) => {
    const { showToast } = useCustomToast();

    // Ajout de la validation Zod dans le formulaire
    const form = useForm<CreateRequestInput>({
        resolver: async (data) => {
            try {
                const parsedData = createRequestSchema.parse(data);
                return { values: parsedData, errors: {} };
            } catch (err) {
                if (err instanceof z.ZodError) {
                    const errors = err.errors.reduce((acc: any, error) => {
                        acc[error.path[0]] = {
                            message: error.message,
                        };
                        return acc;
                    }, {});
                    return { values: {}, errors };
                }
                return { values: {}, errors: {} };
            }
        },
        defaultValues: {
            department: user.department ?? undefined, // ⚠️ user.department peut être null
        },
    });

    const handleSubmit = form.handleSubmit(async (data) => {
        const values = {
            title: data.title,
            description: data.description,
            department: data.department,
            userId: user.id,
        };
        try {
            showToast("Demande en cours de création...", "Veuillez patienter pendant que nous créons votre demande.", "info");
            await createRequest(values);
            showToast("Demande créée avec succès", "Votre demande a été créée avec succès.", "success");
            form.reset();
        } catch (error) {
            showToast('Erreur lors de la création de la demande', 'Une erreur est survenue, veuillez réessayer.', 'error');
        }
    });

    return (
        <Card className="w-full max-w-2xl mx-auto pb-2">
            <CardHeader>
                <CardTitle>Nouvelle demande de budget</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            {...form.register('title')}
                            placeholder="Titre de la demande"
                            className="w-full"
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.title?.message}
                            </p>
                        )}
                    </div>

                    <Textarea
                        {...form.register('description')}
                        placeholder="Description de la demande"
                        className="w-full"
                    />

                    <Button type="submit" className="w-full">
                        Créer la demande
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

const statusTranslation = {
    DRAFT: "Brouillon",
    SUBMITTED: "Soumis",
    VALIDATED: "Validé",
    APPROVED: "Approuvé",
    REJECTED: "Rejeté",
};

const RequestCard: React.FC<RequestCardProps> = ({
                                                     request,
                                                     onClick,
    user
                                                 }) => {
    const { showToast } = useCustomToast();

    const handleDelete = async (id: string) => {
        showToast("Suppression en cours...", "Veuillez patienter pendant que nous supprimons la demande.", "info");
        await deleteRequest(id);
        showToast("Demande supprimée avec succès", "La demande a été supprimée avec succès.", "success");
    };

    const handleUpdate = async (status: RequestStatus) => {
        showToast("Mise à jour en cours...", "Veuillez patienter pendant que nous mettons à jour la demande.", "info");
        await updateRequestStatus(request.id, status, request.userId);
        showToast("Demande mise à jour avec succès", "La demande a été mise à jour avec succès.", "success");
    };

    const getStatusColor = (status: RequestStatus): string => {
        const colors = {
            DRAFT: 'bg-gray-100 text-gray-600',
            SUBMITTED: 'bg-blue-100 text-blue-600',
            VALIDATED: 'bg-green-100 text-green-600',
            APPROVED: 'bg-emerald-100 text-emerald-600',
            REJECTED: 'bg-red-100 text-red-600',
        };
        return colors[status] || 'bg-gray-100 text-gray-600';
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(date));
    };

    return (
        <Card className={`hover:shadow-lg transition-shadow cursor-pointer rounded-lg p-4 ${getStatusColor(request.status)}`}>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg font-semibold">{request.title}</CardTitle>
                <div className={"flex flex-row gap-2"}>
                    { (user.role !== "PERSONAL" || request.status === "DRAFT") &&
                        <Link href={`/needs/new/${request.id}`} className={buttonVariants({ size: "icon", variant: "outline" })}>
                            <PlusCircle />
                        </Link>
                    }
                    { (user.role !== "PERSONAL"  &&
                        <Avatar className="h-10 w-10 rounded-full">
                            <AvatarImage src={request.user.image || ""} alt={request.user.name || ""} />
                            <AvatarFallback className="rounded-lg bg-primary text-background">{request.user.email ? request.user.email[0].toUpperCase() : ""}{ request.user.email ? request.user.email[1].toUpperCase() : ""}</AvatarFallback>
                        </Avatar>)
                    }
                </div>

            </CardHeader>

            <CardContent>
                <p className="text-sm">{request.description}</p>
                <div className="mt-2 text-sm text-gray-600">
                    Créé le: {formatDate(request.createdAt)}
                </div>

                {request.needs.length > 0 && (
                    <div className="mt-2 text-sm">
                        Besoins: {request.needs.length}
                        <br />
                        Total estimé: {request.needs.reduce((sum, need) => sum + (need.estimated_cost || 0) * need.quantity, 0)} F CFA
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between items-center gap-4 mt-4">
                <Select disabled={user.role === "PERSONAL" || (user.role != "DIRECTOR"  && request.status==="APPROVED")} value={request.status} onValueChange={(value: RequestStatus) => handleUpdate(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Changer le statut" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(RequestStatus)
                            .filter((status) => user.role === "DIRECTOR" || status !== "APPROVED") // Masquer "APPROVED" sauf pour DIRECTOR
                            .map((status) => (
                                <SelectItem key={status} value={status}>
                                    {statusTranslation[status]}
                                </SelectItem>
                            ))}

                        {/* Afficher "APPROVED" uniquement s'il est déjà attribué */}
                        {request.status === "APPROVED" && user.role !=="DIRECTOR" && (
                            <SelectItem key="APPROVED" value="APPROVED" disabled>
                                {statusTranslation["APPROVED"]}
                            </SelectItem>
                        )}
                    </SelectContent>

                </Select>


                { (user.role !== "PERSONAL" || request.status === "DRAFT" ) &&<>
                   { (user.role !== "DIRECTOR" && request.status !== "APPROVED")  &&
                        <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(request.id);
                    }}
                >
                    <Trash />
                </Button>
                   }
                </>
                }
            </CardFooter>
        </Card>
    );
};
type ExportRowType = {
    titre_requete: string;
    description_requete: string;
    statut: $Enums.RequestStatus | "";
    personnel: string;
    email_personnel: string;
    departement: string;
    date_creation: string;
    date_validation: string;
    categorie_besoin: string;
    titre_besoin: string;
    description_besoin: string;
    cout_estime: number;
    quantite: number | "";
    validé_par: string;
    date_approbation: string;
    approuvé_par: string;
};
const exportToExcel = (data: RequestType[]) => {
    // Transformation et aplatissement des données
    const flattenedData: ExportRowType[] = data
        .map((request) => {
            const user = request.user;
            const userName = user.name || 'Non spécifié';
            const userEmail = user.email || 'Non spécifié';

            return request.needs.map((need) => ({
                titre_requete: request.title,
                description_requete: request.description || 'Non spécifié',
                statut: request.status,
                personnel: userName,
                email_personnel: userEmail,
                departement: request.department,
                date_creation: request.createdAt.toLocaleString(),
                date_validation: request.validatedAt
                    ? request.validatedAt.toLocaleString()
                    : 'Non validé',
                categorie_besoin: need.category.name,
                titre_besoin: need.title,
                description_besoin: need.description || 'Non spécifié',
                // Vérification de null pour cout_estime
                cout_estime: need.estimated_cost != null ? need.estimated_cost : 0,
                quantite: need.quantity,
                validé_par: request.validatedBy || 'Non spécifié',
                date_approbation: request.approvedAt
                    ? request.approvedAt.toLocaleString()
                    : 'Non approuvé',
                approuvé_par: request.approvedBy || 'Non spécifié',
            }));
        })
        .flat();
    // Calcul du coût total en vérifiant que 'cout_estime' n'est pas null
    const totalCoutEstime = flattenedData.reduce((acc, row) => {
        const coutEstime = row.cout_estime != null ? row.cout_estime : 0;
        return acc + coutEstime;
    }, 0);

    // Création de la ligne TOTAL
    const totalRow: ExportRowType = {
        titre_requete: 'TOTAL',
        description_requete: '',
        statut: "", // Laisser vide pour le total
        personnel: '',
        email_personnel: '',
        departement: '',
        date_creation: '',
        date_validation: '',
        categorie_besoin: '',
        titre_besoin: '',
        description_besoin: '',
        cout_estime: totalCoutEstime,
        quantite: "", // Laisser vide pour le total
        validé_par: '',
        date_approbation: '',
        approuvé_par: '',
    };

    flattenedData.push(totalRow);

    // Création du workbook et de la feuille Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Requêtes');

    // Définition des colonnes et styles
    worksheet.columns = [
        { header: 'Titre requête', key: 'titre_requete', width: 25 },
        { header: 'Description requête', key: 'description_requete', width: 30 },
        { header: 'Statut', key: 'statut', width: 15 },
        { header: 'Personnel', key: 'personnel', width: 20 },
        { header: 'Email personnel', key: 'email_personnel', width: 25 },
        { header: 'Département', key: 'departement', width: 20 },
        { header: 'Date création', key: 'date_creation', width: 20 },
        { header: 'Date validation', key: 'date_validation', width: 20 },
        { header: 'Catégorie besoin', key: 'categorie_besoin', width: 20 },
        { header: 'Titre besoin', key: 'titre_besoin', width: 25 },
        { header: 'Description besoin', key: 'description_besoin', width: 30 },
        { header: 'Coût estimé', key: 'cout_estime', width: 15 },
        { header: 'Quantité', key: 'quantite', width: 12 },
        { header: 'Validé par', key: 'validé_par', width: 20 },
        { header: 'Date approbation', key: 'date_approbation', width: 20 },
        { header: 'Approuvé par', key: 'approuvé_par', width: 20 },
    ];

    // Style des en-têtes (fond bleu, texte blanc)
    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000FF' },
        };
        cell.font = {
            bold: true,
            color: { argb: 'FFFFFFFF' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Ajout des données
    flattenedData.forEach((item, index) => {
        const row = worksheet.addRow(item);
        // Si c'est la dernière ligne (TOTAL), on applique un style rouge
        if (index === flattenedData.length - 1) {
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF0000' },
                };
                cell.font = {
                    bold: true,
                    color: { argb: 'FFFFFFFF' },
                };
            });
        }
    });

    // Génération et téléchargement du fichier Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob(
            [buffer],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        );
        saveAs(blob, 'requetes_export.xlsx');
    });
};
export const RequestsList: React.FC<RequestsListProps> = ({
                                                              requests,
                                                              onStatusUpdate,
                                                                user,
                                                              onDelete,
                                                          }) => {
    return (
        <div className={" w-full h-full p-4  space-y-8"}>
            <Button
            onClick={() => exportToExcel(requests)}
            className="bg-secondary/70 text-muted-foreground hover:bg-secondary"
        >
            Exporter en csv
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {requests.map((request) => (

                        <RequestCard
                            key={request.id}
                            request={request}
                            user={user}
                            onStatusUpdate={
                                onStatusUpdate
                                    ? (status) => onStatusUpdate(request.id, status)
                                    : undefined
                            }
                            onDelete={onDelete ? () => onDelete(request.id) : undefined}
                        />
                ))}

        </div>
        </div>
    )
}

// Schéma de validation pour la création d'un besoin
const createNeedSchema = z.object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
    description: z.string().optional(),
    categoryId: z.string(),
    quantity: z.number().min(1, 'La quantité doit être supérieure à 0'),
    estimated_cost: z.number().min(0, 'Le coût estimé doit être positif').optional(),
})

export const NeedForm: React.FC<NeedFormProps> = ({
                                                      categories,
                                                      requestId,
                                                      need,
                                                  }) => {
    const form = useForm<CreateNeedInput>({
        resolver: zodResolver(createNeedSchema),
        defaultValues: need || {
            quantity: 1,
            categoryId: categories[0]?.id,
        },
    })
    const { showToast } = useCustomToast();

    const handleSubmit = form.handleSubmit(async (data) => {
        const values = {
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            quantity: data.quantity,
            estimated_cost: data.estimated_cost,
            requestId: requestId,
        }
        try {
            if (!need) {
                showToast("Besoin en cours de création...", "Veuillez patienter pendant que nous créons votre besoin.", "info");
                const result = await createNeed(values);
                if (!result.success) {
                    showToast('Erreur lors de la création du besoin', result.error, 'error');
                }else{
                showToast("Besoin créé avec succès", "Votre besoin a été créé avec succès.", "success");
                }
            }else{
                showToast("Besoin en cours de mise à jour...", "Veuillez patienter pendant que nous mettons à jour votre besoin.", "info");
                const result = await updateNeed(need.id, values);
                if (!result.success){
                    showToast('Erreur lors de la création du besoin',`${result.error}, veuillez réessayer.`, "error");
                }else{
                    showToast("Besoin mis à jour avec succès", "Votre besoin a été mis à jour avec succès.", "success");
                }

            }
            if (!need) form.reset() // Reset only for new needs
        } catch (error) {
            showToast('Erreur lors de la création du besoin', 'Une erreur est survenue, veuillez réessayer.', 'error');
        }
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>{need ? '' : 'Ajouter un besoin'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            {...form.register('title')}
                            placeholder="Titre du besoin"
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    <Textarea
                        {...form.register('description')}
                        placeholder="Description"
                    />

                    <Select
                        value={form.watch('categoryId')}
                        onValueChange={(value) => form.setValue('categoryId', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            {...form.register('quantity', { valueAsNumber: true })}
                            placeholder="Quantité"
                            min="1"
                        />
                        <Input
                            type="number"
                            {...form.register('estimated_cost', { valueAsNumber: true })}
                            placeholder="Coût estimé"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        {need ? 'Mettre à jour' : 'Ajouter'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export const NeedsList: React.FC<NeedsListProps> = ({ needs, categories, requestId }) => {
    const { showToast } = useCustomToast();
    const [selectedNeed, setSelectedNeed] = useState<Need & { category: Category } | null>(null);
    const [needToDelete, setNeedToDelete] = useState<Need | null>(null);

    const confirmDelete = async () => {
        if (!needToDelete) return;
        showToast("Suppression en cours...", "Veuillez patienter...", "info");
        await deleteNeed(needToDelete.id);
        showToast("Besoin supprimé avec succès", "Le besoin a été supprimé.", "success");
        setNeedToDelete(null);
    };

    return (
        <>
            <div className="space-y-4">
                {needs.map((need) => (
                    <Card key={need.id}>
                        <CardHeader>
                            <CardTitle className="text-lg flex justify-between">
                                {need.title}
                                <span className="text-sm text-gray-600">{need.category.name}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{need.description}</p>
                            <div className="mt-2 flex justify-between text-sm">
                                <span>Quantité: {need.quantity}</span>
                                <span>Coût total: {(need.estimated_cost || 0) * need.quantity} F CFA</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedNeed(need)}>
                                <Pencil size={16} /> Modifier
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setNeedToDelete(need)}>
                                <Trash size={16} /> Supprimer
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Modale de modification */}
            {selectedNeed && (
                <Dialog open={Boolean(selectedNeed)} onOpenChange={() => setSelectedNeed(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Modifier le besoin</DialogTitle>
                        </DialogHeader>
                        <NeedForm categories={categories} requestId={requestId} need={selectedNeed} />
                    </DialogContent>
                </Dialog>
            )}

            {/* Modale de confirmation de suppression */}
            {needToDelete && (
                <Dialog open={Boolean(needToDelete)} onOpenChange={() => setNeedToDelete(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                        </DialogHeader>
                        <p>Voulez-vous vraiment supprimer le besoin <strong>{needToDelete.title}</strong> ?</p>
                        <DialogFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setNeedToDelete(null)}>
                                Annuler
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Confirmer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

