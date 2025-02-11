"use client"

import { motion } from "framer-motion"
import { LockKeyhole, ArrowRight, CheckCircle } from "lucide-react"

export default function ResetPasswordAnimation() {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-primary text-background p-8 rounded-r-lg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                    className="mb-6"
                >
                    <LockKeyhole size={64} />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-2xl font-bold mb-4"
                >
                    Réinitialisez votre mot de passe
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mb-8"
                >
                    Sécurisez votre compte en quelques étapes simples
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="flex items-center justify-center space-x-4"
                >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <LockKeyhole size={24} />
                    </div>
                    <ArrowRight size={24} />
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

