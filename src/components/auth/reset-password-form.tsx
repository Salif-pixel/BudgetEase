"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormPassword } from "@/src/components/input-component/password-indicator";
import { Button } from "@/src/components/ui/button"; // Assumed import for your button component
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useCustomToast } from "@/src/components/spectrum/alert";
import { authClient } from "@/src/lib/authClient";
import Link from "next/link";
import bcrypt from "bcryptjs";
import {redirect} from "next/navigation";

// Define the schema for validation (use zod here)
const ResetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").nonempty("Veuillez entrer un nouveau mot de passe"), // Attach the error to confirmPassword field
});
export type ResetPasswordFormType = {
    newPassword: string;
};
const token = new URLSearchParams(window.location.search).get("token");
export default function ResetPasswordForm() {
    const [isPending, setIsPending] = useState(false);
    const { showToast } = useCustomToast();
    const form = useForm({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            newPassword: "",
        },
    });
    if(!token) {
        redirect("/login");
    }

    // Submit handler
    const onSubmit = async (values: ResetPasswordFormType) => {
        setIsPending(true);
        const { newPassword } = values;

        // Simulate an API call to reset the password
        const { data, error } = await authClient.resetPassword({
            newPassword: newPassword,
            token: token, // Replace with the actual token from the URL or context
        }, {
            onRequest: (ctx) => {
                showToast("Réinitialisation en cours...", "Veuillez patienter pendant que nous mettons à jour votre mot de passe.", "info");
            },
            onSuccess: (ctx) => {
                form.reset();
                showToast("Réinitialisation réussie! 🎉", "Votre mot de passe a été mis à jour avec succès.", "celebration");
                redirect("/login");
            },
            onError: (ctx) => {
                showToast("Erreur lors de la réinitialisation", ctx.error.message, "error");
            },
        });

        setIsPending(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:flex-1 flex items-center justify-center p-8 lg:p-16"
        >
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-3xl font-bold text-gray-900"
                    >
                        Réinitialisation du mot de passe
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-2 text-gray-600"
                    >
                        Entrez un nouveau mot de passe pour votre compte.
                    </motion.p>
                </div>
                <FormProvider {...form}>
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div>
                            <CustomFormPassword
                                name="newPassword"
                                control={form.control}
                                labelText={"Nouveau mot de passe"}
                            />
                        </div>

                        <div className={"w-full"}>
                            {isPending ? (
                                <Button className="self-end capitalize w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    En cours...
                                </Button>
                            ) : (
                                <Button className="self-end capitalize w-full" type="submit">
                                    Réinitialiser le mot de passe
                                </Button>
                            )}
                        </div>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="text-center"
                    >
                        <p className="text-sm text-gray-600">
                            Vous avez déjà un compte ?{" "}
                            <Link href="/login" className="text-primary/70 hover:text-primary">
                                Connectez-vous
                            </Link>
                        </p>
                    </motion.div>
                </FormProvider>
            </div>
        </motion.div>
    );
}