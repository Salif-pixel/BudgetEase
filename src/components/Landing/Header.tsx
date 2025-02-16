"use client"
import FinanceSVG from "../../assets/paypal-33.svg";
import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button, buttonVariants } from "@/src/components/ui/button"
import { GradientHeading } from "@/src/components/cult/gradientheading"
import { cn } from "@/src/lib/utils"
import { ArrowRight, BarChart2, PieChart, TrendingUp } from "lucide-react"
import { motion } from "motion/react";

export default function Header() {
    return (
        <div className="bg-primary rounded-3xl border-8 border-background overflow-hidden shadow-2xl">
            <div className="container mx-auto px-4 py-6">
                <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
                    <Button className="bg-background text-foreground hover:bg-background/90 rounded-full">
                        <span className="text-lg font-bold">💰BudgetEase</span>
                    </Button>
                    <div className="hidden lg:flex gap-4">
                        <Link
                            href="/login"
                            className={cn(
                                buttonVariants({ size: "lg", variant: "outline" }),
                                "rounded-full bg-background text-foreground hover:bg-background/80",
                            )}
                        >
                            Se connecter
                        </Link>
                        <Link
                            href="/register"
                            className={cn(
                                buttonVariants({ size: "lg", variant: "outline" }),
                                "rounded-full bg-foreground text-background hover:bg-foreground/90",
                            )}
                        >
                            S&apos;inscrire
                        </Link>
                    </div>
                </nav>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <GradientHeading
                                className="text-center lg:text-left text-white"
                                variant="light"
                                size="xxxl"
                                weight="bold"
                            >
                                Simplifiez votre gestion budgétaire
                            </GradientHeading>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-background text-lg font-medium"
                        >
                            BudgetEase transforme la gestion financière de votre établissement en une expérience intuitive et
                            efficace. Prenez le contrôle de vos finances avec des outils puissants et faciles à utiliser.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link
                                href="/login"
                                className={cn(
                                    buttonVariants({ size: "lg" }),
                                    "rounded-full bg-background text-primary hover:bg-background/90",
                                )}
                            >
                                Voir la démo
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/register"
                                className={cn(
                                    buttonVariants({ size: "lg", variant: "outline" }),
                                    "rounded-full bg-transparent text-background border-background hover:bg-background/10",
                                )}
                            >
                                S'inscrire
                            </Link>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square max-w-lg mx-auto"
                    >
                        <Image
                            src={FinanceSVG}
                            width={800}
                            height={800}
                            alt="BudgetEase Dashboard"
                            className="rounded-2xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl" />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16"
                >
                    {[
                        {
                            icon: PieChart,
                            title: "Gerer vos finances",
                            description: "Suivez vos dépenses",
                        },
                        {
                            icon: TrendingUp,
                            title: "Analyse des tendances",
                            description: "Identifiez les opportunités d'optimisation budgétaire",
                        },
                        {
                            icon: BarChart2,
                            title: "Rapports détaillés",
                            description: "Générez des rapports personnalisés en quelques clics",
                        },
                    ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background flex items-center justify-center">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-background">{feature.title}</h3>
                                <p className="text-sm text-background/80">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

