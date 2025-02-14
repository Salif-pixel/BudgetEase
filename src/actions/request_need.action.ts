'use server'

import {Department, RequestStatus} from '@prisma/client'
import { prisma } from '@/src/lib/prisma'
import {revalidatePath} from "next/cache";

// Créer une nouvelle demande
export async function createRequest(data: {
    title: string
    description?: string | null
    department: Department
    userId: string
}) {
    try {
        const request = await prisma.request.create({
            data: {
                title: data.title,
                description: data.description,
                userId: data.userId,
                department: data.department,
                status: RequestStatus.DRAFT
            }
        })
        revalidatePath("/needs/new");
        return { success: true, data: request }

    } catch (error) {
        return { success: false, error: 'Erreur lors de la création de la demande' }
    }
}

export async function deleteRequest(requestId: string) {
    try {
        await prisma.request.delete({
            where: { id: requestId }
        })
        revalidatePath("/needs/new");
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Erreur lors de la suppression de la demande' }
    }
}
// Ajouter un besoin à une demande
export async function createNeed(data: {
    title: string
    description?: string | null
    categoryId: string
    quantity: number
    estimated_cost?: number | null
    requestId: string
}) {
    try {
        const existingRequest = await prisma.need.findFirst({
            where: {
                requestId: data.requestId,
                title: data.title,
            }
        })
        if (existingRequest) {
            return { success: false, error: 'Un besoin avec ce titre existe déjà' }
        }
        const need = await prisma.need.create({
            data: {
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                quantity: data.quantity,
                estimated_cost: data.estimated_cost,
                requestId: data.requestId
            }
        })
        revalidatePath(`/needs/new/${data.requestId}`);
        return { success: true, data: need }
    } catch (error) {
        return { success: false, error: 'Erreur lors de la création du besoin' }
    }
}
export async function updateNeed(needId: string, data: {
    title: string
    description?: string | null
    categoryId: string
    quantity: number
    requestId: string
    estimated_cost?: number | null
}) {
    const existingRequest = await prisma.need.findFirst({
        where: {
            id: { not: needId },
            requestId: data.requestId,
            title: data.title,
        }
    })
    if (existingRequest) {
        return { success: false, error: 'Un besoin avec ce titre existe déjà' }
    }
    try {
        const need = await prisma.need.update({
            where: { id: needId },
            data: {
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                quantity: data.quantity,
                estimated_cost: data.estimated_cost
            }
        })
        revalidatePath(`/needs/new/${need.requestId}`);
        return { success: true, data: need }
    } catch (error) {
        return { success: false, error: 'Erreur lors de la mise à jour du besoin' }
    }
}
export async function deleteNeed(needId: string) {
    try {
        const need = await prisma.need.delete({
            where: { id: needId }
        })
        revalidatePath(`/needs/new/${need.requestId}`);
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Erreur lors de la suppression du besoin' }
    }
}
// Récupérer les demandes d'un utilisateur
export async function getUserRequests(userId: string) {
    try {
        const requests = await prisma.request.findMany({
            where: {
                userId: userId
            },
            include: {
                needs: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { success: true, data: requests }
    } catch (error) {
        return { success: false, error: 'Erreur lors de la récupération des demandes' }
    }
}

// Mettre à jour le statut d'une demande
export async function updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    userId: string
) {
    try {
        const update: any = {
            status
        }
        const user = await prisma.user.findFirst({
            where: { id: userId },

        });
        if (!user) {
            return { success: false, error: 'Utilisateur non trouvé' }
        }

        // Ajouter les champs de validation/approbation selon le statut
        if (status === RequestStatus.VALIDATED) {
            update.validatedAt = new Date()
            update.validatedBy = user.name
        } else if (status === RequestStatus.APPROVED) {
            update.approvedAt = new Date()
            update.approvedBy = user.name
        }

        const request = await prisma.request.update({
            where: { id: requestId },
            data: update
        })
        revalidatePath(`/needs/new/`);
        return { success: true, data: request }
    } catch (error) {
        return { success: false, error: 'Erreur lors de la mise à jour du statut' }
    }
}