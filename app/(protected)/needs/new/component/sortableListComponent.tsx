'use client'
import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription} from '@/src/components/ui/card'
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
import {
    AlertCircle, CalendarDays, CheckCircle, CheckCircle2,
    DollarSign,
    Download,
    FileText,
    ListPlus,
    Package,
    Pencil,
    PlusCircle, Send,
    Tag,
    Trash, Wallet, XCircle
} from "lucide-react";
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

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick, user }) => {
    const { showToast } = useCustomToast();

    const handleDelete = async (id: string) => {
        showToast("Suppression en cours...", "Veuillez patienter pendant que nous supprimons la demande.", "info");
        await deleteRequest(id);
        showToast("Demande supprimée avec succès", "La demande a été supprimée avec succès.", "success");
    };

    const handleUpdate = async (status: RequestStatus) => {
        showToast("Mise à jour en cours...", "Veuillez patienter pendant que nous mettons à jour la demande.", "info");
        await updateRequestStatus(request.id, status, user.id);
        showToast("Demande mise à jour avec succès", "La demande a été mise à jour avec succès.", "success");
    };

    const getStatusConfig = (status: RequestStatus) => {
        const configs = {
            DRAFT: {
                bg: 'bg-gray-50 hover:bg-gray-100/80',
                border: 'border-gray-200',
                badge: 'bg-gray-100 text-gray-600',
                icon: <FileText className="w-4 h-4 text-gray-500" />,
            },
            SUBMITTED: {
                bg: 'bg-blue-50 hover:bg-blue-100/80',
                border: 'border-blue-200',
                badge: 'bg-blue-100 text-blue-600',
                icon: <Send className="w-4 h-4 text-blue-500" />,
            },
            VALIDATED: {
                bg: 'bg-secondary/5 hover:bg-secondary/20',
                border: 'border-secondary',
                badge: 'bg-amber-500 text-secondary',
                icon: <CheckCircle2 className="w-4 h-4 text-secondary" />,
            },
            APPROVED: {
                bg: 'bg-emerald-50 hover:bg-emerald-100/80',
                border: 'border-emerald-200',
                badge: 'bg-emerald-100 text-emerald-600',
                icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
            },
            REJECTED: {
                bg: 'bg-red-50 hover:bg-red-100/80',
                border: 'border-red-200',
                badge: 'bg-red-100 text-red-600',
                icon: <XCircle className="w-4 h-4 text-red-500" />,
            },
        };
        return configs[status];
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(date));
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const statusConfig = getStatusConfig(request.status);

    return (
        <Card
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${statusConfig.bg} border-2 ${statusConfig.border}`}
            onClick={onClick}
        >

            <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.badge}`}>
                            {statusConfig.icon}
                            {statusTranslation[request.status]}
                        </span>
                    </div>
                    <CardTitle className="text-lg font-semibold mt-2">{request.title}</CardTitle>
                </div>

                <div className="flex items-center gap-3">
                    {(
                        // 1️⃣ Si l'utilisateur est "PERSONAL" et que la requête est en "DRAFT", il peut voir le bouton
                        (user.role === "PERSONAL" && request.status === "DRAFT") ||

                        // 2️⃣ Si l'utilisateur est "HEAD_OF_DEPARTMENT" et que la requête N'EST PAS "APPROVED", il peut voir le bouton
                        (user.role === "DEPARTMENT_HEAD" && request.status !== "APPROVED") ||

                        // 3️⃣ Si la requête est "APPROVED", seuls "ADMIN" et "DIRECTOR" peuvent voir le bouton
                        (request.status === "APPROVED" && (user.role === "DIRECTOR" || user.role === "ADMIN"))
                    ) && (
                        <Link
                            href={`/needs/new/${request.id}`}
                            className={buttonVariants({
                                variant: "outline",
                                size: "sm",
                                className: "hover:bg-background/80 cursor-pointer"
                            })}
                        >
                            <PlusCircle className="w-4 h-4 mr-1" />
                            Ajouter
                        </Link>
                    )}


                    {user.role !== "PERSONAL" && (
                        <Avatar className="h-8 w-8 ring-2 ring-background">
                            <AvatarImage src={request.user.image || ""} alt={request.user.name || ""} />
                            <AvatarFallback className="bg-primary text-background">
                                {request.user.email ? request.user.email[0].toUpperCase() : ""}
                                {request.user.email ? request.user.email[1].toUpperCase() : ""}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <p className="text-sm text-gray-600 leading-relaxed">{request.description}</p>

                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            {formatDate(request.createdAt)}
                        </span>
                    </div>

                    {request.needs.length > 0 && (
                        <>
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {request.needs.length} besoin{request.needs.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                    {formatCurrency(request.needs.reduce((sum, need) => sum + (need.estimated_cost || 0) * need.quantity, 0))}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center gap-4 pt-4 border-t">
                <Select
                    disabled={user.role === "PERSONAL" || (user.role !== "DIRECTOR" && request.status === "APPROVED")}
                    value={request.status}
                    onValueChange={(value: RequestStatus) => handleUpdate(value)}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Changer le statut" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(RequestStatus)
                            .filter((status) => (user.role === "DIRECTOR" || status !== "APPROVED") && status !== "SUBMITTED")
                            .map((status) => (
                                <SelectItem key={status} value={status} className="flex items-center gap-2">
                                    {/*{getStatusConfig(status).icon}*/}
                                    {statusTranslation[status]}
                                </SelectItem>
                            ))}
                        {request.status === "APPROVED" && user.role !== "DIRECTOR" && (
                            <SelectItem key="APPROVED" value="APPROVED" disabled>
                                {statusTranslation["APPROVED"]}
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
                {(
                    // 1️⃣ Si l'utilisateur est "PERSONAL" et que la requête est en "DRAFT", il peut voir le bouton
                    (user.role === "PERSONAL" && request.status === "DRAFT") ||

                    // 2️⃣ Si l'utilisateur est "HEAD_OF_DEPARTMENT" et que la requête N'EST PAS "APPROVED", il peut voir le bouton
                    (user.role === "DEPARTMENT_HEAD" && request.status !== "APPROVED") ||

                    // 3️⃣ L'ADMIN peut toujours voir le bouton, quel que soit le statut
                    (user.role === "ADMIN")
                ) && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(request.id);
                        }}
                        className="hover:bg-red-600/90 transition-colors"
                    >
                        <Trash className="w-4 h-4 mr-1" />
                        Supprimer
                    </Button>
                )}

            </CardFooter>
        </Card>
    );
};
export type ExportRowType = {
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
type AlertVariant = "success" | "error" | "warning" | "info"; // Définition possible

type ToastFunction = (
    title: string,
    description?: string,
    variant?: AlertVariant,
    badge?: string
) => void;

export const exportToExcel = (data: RequestType[], showToast: ToastFunction) => {
    if (data.length === 0) {
        showToast("Erreur","Vous n'avez aucune requete","error");
    }else {

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

        const totalCoutEstime = flattenedData.reduce((acc, row) => {
            const coutEstime = row.cout_estime != null ? row.cout_estime : 0;
            const quantite = row.quantite != null ? Number(row.quantite) : 1; // Conversion en number
            return acc + coutEstime * quantite;
        }, 0);



        const totalRow: ExportRowType = {
            titre_requete: 'TOTAL',
            description_requete: '',
            statut: "",
            personnel: '',
            email_personnel: '',
            departement: '',
            date_creation: '',
            date_validation: '',
            categorie_besoin: '',
            titre_besoin: '',
            description_besoin: '',
            cout_estime: totalCoutEstime,
            quantite: "",
            validé_par: '',
            date_approbation: '',
            approuvé_par: '',
        };

        flattenedData.push(totalRow);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Demandes');

        // Définition des colonnes avec style amélioré
        worksheet.columns = [
            {header: 'Titre requête', key: 'titre_requete', width: 25},
            {header: 'Description requête', key: 'description_requete', width: 30},
            {header: 'Statut', key: 'statut', width: 15},
            {header: 'Personnel', key: 'personnel', width: 20},
            {header: 'Email personnel', key: 'email_personnel', width: 25},
            {header: 'Département', key: 'departement', width: 20},
            {header: 'Date création', key: 'date_creation', width: 20},
            {header: 'Date validation', key: 'date_validation', width: 20},
            {header: 'Catégorie besoin', key: 'categorie_besoin', width: 20},
            {header: 'Titre besoin', key: 'titre_besoin', width: 25},
            {header: 'Description besoin', key: 'description_besoin', width: 30},
            {header: 'Coût estimé', key: 'cout_estime', width: 15},
            {header: 'Quantité', key: 'quantite', width: 12},
            {header: 'Validé par', key: 'validé_par', width: 20},
            {header: 'Date approbation', key: 'date_approbation', width: 20},
            {header: 'Approuvé par', key: 'approuvé_par', width: 20},
        ];

        // Style amélioré des en-têtes
        const headerRow = worksheet.getRow(1);
        headerRow.height = 30; // Hauteur augmentée pour les en-têtes
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: '2563EB'} // Bleu plus moderne
            };
            cell.font = {
                bold: true,
                color: {argb: 'FFFFFF'},
                size: 12
            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            };
            cell.border = {
                top: {style: 'medium', color: {argb: '000000'}},
                left: {style: 'thin', color: {argb: '000000'}},
                bottom: {style: 'medium', color: {argb: '000000'}},
                right: {style: 'thin', color: {argb: '000000'}}
            };
        });

        // Ajout des données avec style amélioré
        flattenedData.forEach((item, index) => {
            const row = worksheet.addRow(item);
            row.height = 25; // Hauteur de ligne augmentée

            row.eachCell((cell, colNumber) => {
                // Style de base pour toutes les cellules
                cell.border = {
                    top: {style: 'thin', color: {argb: '000000'}},
                    left: {style: 'thin', color: {argb: '000000'}},
                    bottom: {style: 'thin', color: {argb: '000000'}},
                    right: {style: 'thin', color: {argb: '000000'}}
                };
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                };

                // Style alterné pour les lignes
                if (index % 2 !== 0 && index !== flattenedData.length - 1) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {argb: 'F3F4F6'} // Gris très clair
                    };
                }

                // Style spécial pour la colonne statut
                if (colNumber === 3 && item.statut) {
                    const statusColors = {
                        DRAFT: {bg: 'FFF3C4', font: '92400E'},     // Jaune
                        SUBMITTED: {bg: 'DBEAFE', font: '1E40AF'},  // Bleu
                        VALIDATED: {bg: 'D1FAE5', font: '065F46'},  // Vert
                        APPROVED: {bg: 'BBF7D0', font: '166534'},   // Vert foncé
                        REJECTED: {bg: 'FEE2E2', font: 'B91C1C'},   // Rouge
                    };
                    const color = statusColors[item.statut as keyof typeof statusColors];
                    if (color) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: color.bg}
                        };
                        cell.font = {
                            color: {argb: color.font},
                            bold: true
                        };
                    }
                }

                // Format monétaire pour la colonne coût
                if (colNumber === 12) {
                    cell.numFmt = '#,##0 "FCFA"';
                }

                // Format date pour les colonnes de date
                if ([7, 8, 15].includes(colNumber) && cell.value !== '') {
                    cell.numFmt = 'dd/mm/yyyy hh:mm';
                }
            });

            // Style spécial pour la ligne TOTAL
            if (index === flattenedData.length - 1) {
                row.height = 30;
                row.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {argb: 'DC2626'} // Rouge plus moderne
                    };
                    cell.font = {
                        bold: true,
                        color: {argb: 'FFFFFF'},
                        size: 12
                    };
                    cell.border = {
                        top: {style: 'medium', color: {argb: '000000'}},
                        left: {style: 'thin', color: {argb: '000000'}},
                        bottom: {style: 'medium', color: {argb: '000000'}},
                        right: {style: 'thin', color: {argb: '000000'}}
                    };
                });
            }
        });

        // Ajout d'AutoFilter
        worksheet.autoFilter = {
            from: {row: 1, column: 1},
            to: {row: 1, column: worksheet.columns.length}
        };

        // Figer la première ligne
        worksheet.views = [
            {state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2'}
        ];

        // Protection de la feuille avec certaines exceptions
        worksheet.protect('', {
            selectLockedCells: true,
            selectUnlockedCells: true,
            formatCells: true,
            formatColumns: true,
            formatRows: true,
            sort: true,
            autoFilter: true
        });

        // Génération et téléchargement
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob(
                [buffer],
                {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
            );
            saveAs(blob, `demandes_export_${new Date().toLocaleDateString('fr-FR')}.xlsx`);
        });
    }
};
export const RequestsList: React.FC<RequestsListProps> = ({
                                                              requests,
                                                              onStatusUpdate,
                                                                user,
                                                              onDelete,
                                                          }) => {
    const { showToast } = useCustomToast();
    return (
        <div className={" w-full h-full p-4  space-y-8"}>
            <div className="flex gap-3 w-full sm:w-auto">
                <Button onClick={()=>{exportToExcel(requests, showToast)}} variant="outline" className="flex-1 sm:flex-none gap-2">
                    <Download className="w-4 h-4" />
                    Exporter
                </Button>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-x-32  p-4">

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
    });
    const { showToast } = useCustomToast();

    const handleSubmit = form.handleSubmit(async (data) => {
        const values = {
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            quantity: data.quantity,
            estimated_cost: data.estimated_cost,
            requestId: requestId,
        };
        try {
            if (!need) {
                showToast("Besoin en cours de création...", "Veuillez patienter pendant que nous créons votre besoin.", "info");
                const result = await createNeed(values);
                if (!result.success) {
                    showToast('Erreur lors de la création du besoin', result.error, 'error');
                } else {
                    showToast("Besoin créé avec succès", "Votre besoin a été créé avec succès.", "success");
                }
            } else {
                showToast("Besoin en cours de mise à jour...", "Veuillez patienter pendant que nous mettons à jour votre besoin.", "info");
                const result = await updateNeed(need.id, values);
                if (!result.success) {
                    showToast('Erreur lors de la création du besoin', `${result.error}, veuillez réessayer.`, "error");
                } else {
                    showToast("Besoin mis à jour avec succès", "Votre besoin a été mis à jour avec succès.", "success");
                }
            }
            if (!need) form.reset();
        } catch (error) {
            showToast('Erreur lors de la création du besoin', 'Une erreur est survenue, veuillez réessayer.', 'error');
        }
    });

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                    <ListPlus className="h-6 w-6 text-blue-500" />
                    {need ? 'Modifier le besoin' : 'Ajouter un besoin'}
                </CardTitle>
                {!need && (
                    <CardDescription>
                        Remplissez les informations ci-dessous pour ajouter un nouveau besoin
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Titre</label>
                        <Input
                            {...form.register('title')}
                            placeholder="Ex: Ordinateur portable"
                            className="focus-visible:ring-blue-500"
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <Textarea
                            {...form.register('description')}
                            placeholder="Décrivez votre besoin en détail..."
                            className="min-h-[100px] focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Catégorie</label>
                        <Select
                            value={form.watch('categoryId')}
                            onValueChange={(value) => form.setValue('categoryId', value)}
                        >
                            <SelectTrigger className="w-full focus:ring-blue-500">
                                <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                        className="flex flex-row  items-center gap-2"
                                    >

                                        {category.name}
                                        <Tag className="h-4 w-4" />
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Quantité</label>
                            <div className="relative">
                                <Package className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
                                <Input
                                    type="number"
                                    {...form.register('quantity', { valueAsNumber: true })}
                                    placeholder="Ex: 1"
                                    min="1"
                                    className="pl-10 focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Coût estimé</label>
                            <div className="relative">
                                <DollarSign className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
                                <Input
                                    type="number"
                                    {...form.register('estimated_cost', { valueAsNumber: true })}
                                    placeholder="Ex: 50000"
                                    min="0"
                                    step="0.01"
                                    className="pl-10 focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        {need ? 'Mettre à jour' : 'Ajouter le besoin'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

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
            <div className="space-y-6">
                {needs.map((need) => (
                    <Card
                        key={need.id}
                        className="hover:shadow-md transition-all bg-white duration-200 border-l-4 border-l-primary"
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-semibold">
                                        {need.title}
                                    </CardTitle>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        <Tag className="w-4 h-4 mr-1" />
                                        {need.category.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedNeed(need)}
                                        className="hover:bg-gray-100"
                                    >
                                        <Pencil size={16} className="mr-1" />
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setNeedToDelete(need)}
                                        className="hover:bg-red-600"
                                    >
                                        <Trash size={16} className="mr-1" />
                                        Supprimer
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-2 text-gray-600">
                                    <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm leading-relaxed">{need.description}</p>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                        <Package className="w-4 h-4 text-gray-600" />
                                        <span>Quantité: {need.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                        <DollarSign className="w-4 h-4 text-gray-600" />
                                        <span>Coût total: {(need.estimated_cost || 0) * need.quantity} F CFA</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modales */}
            <Dialog open={Boolean(selectedNeed)} onOpenChange={() => setSelectedNeed(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <></>
                        </DialogTitle>
                    </DialogHeader>
                    <NeedForm categories={categories} requestId={requestId} need={selectedNeed ?? undefined} />
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(needToDelete)} onOpenChange={() => setNeedToDelete(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl text-red-600">
                            <AlertCircle className="h-6 w-6" />
                            Confirmer la suppression
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600">
                            Voulez-vous vraiment supprimer le besoin <strong className="text-gray-900">{needToDelete?.title}</strong> ?
                            Cette action est irréversible.
                        </p>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setNeedToDelete(null)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            className="flex items-center gap-2"
                        >
                            <Trash size={16} />
                            Confirmer la suppression
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};