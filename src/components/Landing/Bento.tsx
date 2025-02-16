"use client"

import type React from "react"
import { motion } from "framer-motion"
import { EyeIcon, Lock, Sparkles, UsersIcon } from "lucide-react"
import { cn } from "@/src/lib/utils"

export function Bento() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 ">
            <div className="w-full px-4 md:px-6 ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                <h2 className="text-4xl  md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                    Fonctionnalités clés
                    <br />
                    de BudgetEase
                </h2>
                <p className="text-lg text-gray-600">
                    Découvrez les fonctionnalités qui rendent BudgetEase indispensable pour la gestion financière de votre établissement.
                </p>
                </motion.div>
                <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <GridItem
                        icon={<EyeIcon className="h-8 w-8" />}
                        title="Visualisation claire"
                        description="Graphiques interactifs pour une compréhension rapide des dépenses de l'école."
                        color="bg-blue-500"
                    />
                    <GridItem
                        icon={<Sparkles className="h-8 w-8" />}
                        title="Prévisions budgétaires"
                        description="Outils avancés pour planifier et prévoir les budgets futurs avec précision."
                        color="bg-purple-500"
                    />
                    <GridItem
                        icon={<UsersIcon className="h-8 w-8" />}
                        title="Collaboration"
                        description="Fonctionnalités de partage pour une meilleure coordination entre les départements."
                        color="bg-green-500"
                    />
                    <GridItem
                        icon={<Lock className="h-8 w-8" />}
                        title="Sécurité des données"
                        description="Protection avancée des informations financières sensibles de l'école."
                        color="bg-red-500"
                    />
                </ul>
            </div>
        </section>
    )
}

interface GridItemProps {
    icon: React.ReactNode
    title: string
    description: string
    color: string
}

const GridItem = ({ icon, title, description, color }: GridItemProps) => {
    return (
        <motion.li
            className="list-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className={cn("absolute inset-0 opacity-10", color)} />
                <div className="relative flex h-full flex-col justify-between gap-6 p-6">
                    <div className="space-y-4">
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white", color)}>
                            {icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{description}</p>
                    </div>
                    <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    />
                </div>
            </div>
        </motion.li>
    )
}

