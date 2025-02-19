"use client"
import ResetPasswordForm from "@/src/components/auth/reset-password-form";
import {motion} from "framer-motion";
import ResetPasswordAnimation from "@/src/components/v0/reset-password-animation";

export default function ResetPage(){
    return (
        <div className="min-h-screen  flex flex-col lg:flex-row">

            {/* Auth Form Column */}
            <ResetPasswordForm/>
            {/* Image/Animation Column */}

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:flex-1 bg-primary hidden overflow-hidden relative max-h-screen md:flex items-center justify-center p-8 lg:p-16"
            >

               <ResetPasswordAnimation/>
            </motion.div>
        </div>
    )
}