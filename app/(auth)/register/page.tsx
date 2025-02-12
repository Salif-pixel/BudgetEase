"use client"


import { motion } from "framer-motion"


import RegisterForm from "@/src/components/auth/Register-form";
import BudgetAnimation from "@/src/components/v0/budget-animation";

export default function Page() {


    return (
        <div className="min-h-screen  flex flex-col lg:flex-row">

            {/* Auth Form Column */}
            <RegisterForm/>
            {/* Image/Animation Column */}

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:flex-1 bg-primary  hidden overflow-hidden relative max-h-screen md:flex items-center justify-center p-8 lg:p-16"
            >
                <BudgetAnimation/>

            </motion.div>
        </div>
    )
}

