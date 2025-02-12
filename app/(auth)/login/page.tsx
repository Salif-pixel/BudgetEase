"use client"
import { motion } from "framer-motion"


import Image from "next/image"
import Ballpit from "@/src/components/reactbits/Ballpit/Ballpit";
import LoginForm from "@/src/components/auth/login-form";


export default function Page() {



    return (
        <div className="min-h-screen  flex flex-col lg:flex-row">

            {/* Auth Form Column */}
            <LoginForm/>
            {/* Image/Animation Column */}

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:flex-1 bg-primary  hidden  overflow-hidden relative max-h-screen md:flex items-center justify-center p-8 lg:p-16"
            >
                <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                        src="/placeholder.svg?height=600&width=600"
                        alt="Gestion budgétaire illustration"
                        layout="fill"
                        objectFit="cover"
                        className="transform hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <Ballpit
                    count={200}
                    gravity={0.5}
                    friction={0.9975}
                    wallBounce={0.95}
                    followCursor={false}
                    colors={["#ff46b6", "#33FF57", "#3357FF"]}

                />

            </motion.div>
        </div>
    )
}

