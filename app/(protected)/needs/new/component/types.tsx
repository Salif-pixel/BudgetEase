// types.ts
import {RequestStatus, Department, User, Role} from '@prisma/client'



export interface Category {
    id: string
    name: string
    description: string | null
    isActive: boolean
}
export interface RequestType {
    id: string
    title: string
    description: string | null
    status: RequestStatus
    userId: string
    user: {image:string | null,name:string|null,email:string|null}
    department: string | Department
    validatedAt: Date | null
    validatedBy: string | null
    approvedAt: Date | null
    approvedBy: string | null
    needs: Need[]
    createdAt: Date
    updatedAt: Date
}
export interface Need {
    id: string
    title: string
    description: string | null
    categoryId: string
    category: Category
    quantity: number
    estimated_cost: number | null
    requestId: string
    createdAt: Date
    updatedAt: Date
}


// Props interfaces pour les composants
export interface CreateRequestFormProps {
    user: User
}

export interface RequestsListProps {
    requests: RequestType[]
    onStatusUpdate?: (requestId: string, status: RequestStatus) => Promise<void>
    onDelete?: (requestId: string) => Promise<void>
    user:User
}

export interface RequestCardProps {
    request: RequestType
    onStatusUpdate?: (status: RequestStatus) => Promise<void>
    onDelete?: () => Promise<void>
    onClick?: () => void
    user:User
}

export interface NeedFormProps {
    requestId: string
    categories: Category[]
    need?: Need  // Pour l'édition
}

export interface NeedsListProps {
    needs: Need[]
    requestId: string
    categories: Category[]
    onDelete?: (needId: string) => Promise<void>
    onUpdate?: (needId: string, data: UpdateNeedInput) => Promise<void>
}

// Types pour les inputs des formulaires
export interface CreateRequestInput {
    title: string
    description?: string | null
    department: Department
    userId: string
}

export interface CreateNeedInput {
    title: string
    description?: string | null
    categoryId: string
    quantity: number
    estimated_cost?: number | null
    requestId: string
}

export interface UpdateNeedInput {
    title?: string
    description?: string | null
    categoryId?: string
    quantity?: number
    estimated_cost?: number | null
}