"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {BarChart3, Clock, DownloadIcon, PieChart, TrendingUp} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {
    const [currentImage, setCurrentImage] = useState(0)
    const images = [
        "/dashboard.png",
        "/department.png",
        "/request.png",
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length)
        }, 5000) // Change image every 5 seconds

        return () => clearInterval(timer)
    }, []) // Removed unnecessary dependency: images.length

    const features = [

        {
            title: "Suivi des performances",
            description: "Analysez les tendances et optimisez les allocations budgétaires",
            icon: TrendingUp,
        },
        {
            title: "Rapports automatisés",
            description: "Générez des rapports détaillés en quelques clics",
            icon: BarChart3,
        },

        {
            title: "Export des données",
            description: "Exportez vos données en un clic pour une analyse approfondie",
            icon: DownloadIcon,
        },
    ]

    return (
        <section className="w-full bg-background py-24">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                        Optimisez la gestion financière
                        <br />
                        de votre établissement
                    </h2>
                    <p className="text-lg text-gray-600">
                        Une plateforme intuitive qui transforme la gestion budgétaire de votre école en une expérience simple et
                        efficace.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Dashboard Preview Carousel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-2xl overflow-hidden shadow-2xl bg-background aspect-video"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/50 to-blue-50/50" />
                        {images.map((img, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: currentImage === index ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={img || "/placeholder.svg"}
                                    alt={`Dashboard de gestion budgétaire ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-2xl"
                                />
                            </motion.div>
                        ))}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full ${currentImage === index ? "bg-primary" : "bg-gray-300"}`}
                                    onClick={() => setCurrentImage(index)}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Features List */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid gap-8"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary transition-colors">
                                            <feature.icon className="h-6 w-6 text-background" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-100/0 to-blue-100/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-500" />
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex justify-start"
                        >
                            <Link
                                href="/dashboard/departments"
                                className="group inline-flex items-center gap-2 bg-primary text-background px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-300"
                            >
                                Découvrir le dashboard
                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                >
                                    →
                                </motion.span>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 bg-white rounded-2xl p-8 shadow-lg"
                >
                    {[
                        { label: "Établissements", value: "50+" },
                        { label: "Budgets gérés", value: "FCFA2M+" },
                        { label: "Temps économisé", value: "85%" },
                        { label: "Satisfaction", value: "98%" },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

