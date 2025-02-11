"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import {EyeOff, Loader2} from "lucide-react";
import {CustomFormPassword} from "@/src/components/input-component/password-indicator";
import {ChangePassword} from "@/src/actions/account.action";
import {Account, User} from "@prisma/client";
import {useCustomToast} from "@/src/components/spectrum/alert";

// Schéma de validation avec Zod
const passwordChangeSchema = z.object({
    currentPassword: z.string().min(6, "Le mot de passe actuel est requis"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export type PasswordChangeFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ChangePasswordForm({ user }: { user: User & { accounts: Account[] } }) {
    const [isPending, setIsPending] = useState(false);
    const {showToast} = useCustomToast();
    const form = useForm<PasswordChangeFormValues>({
        resolver: zodResolver(passwordChangeSchema),
    });

    const onSubmit = async (data: PasswordChangeFormValues) => {

        try {
            setIsPending(true);
           const result = await ChangePassword(user, data.currentPassword, data.newPassword, data.confirmPassword);
            if (result && result.error) {
                showToast("Erreur", result.error, "error");
            }
            else {
                form.reset();
                showToast("Succès", "Votre mot de passe a été mis à jour avec succès", "success");
            }
        }catch (e) {
            throw e;
            showToast("Erreur", "Oups un problème est survenu lors du changement de mot de passe", "error");
        }
        setIsPending(false);


    };

    return (
        <FormProvider {...form}>
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {/* Champ Mot de passe actuel */}
                <div>
                    <CustomFormPassword
                        name="currentPassword"
                        control={form.control}
                        labelText="Mot de passe actuel"
                    />
                </div>

                {/* Champ Nouveau mot de passe */}
                <div>
                    <CustomFormPassword
                        name="newPassword"
                        control={form.control}
                        labelText="Nouveau mot de passe"
                    />
                </div>

                {/* Champ Confirmer le mot de passe */}
                <div>
                    <CustomFormPassword
                        name="confirmPassword"
                        control={form.control}
                        labelText="Confirmer le nouveau mot de passe"
                    />
                </div>

                {/* Bouton de soumission */}
                <div className="w-full">
                    {isPending ? (
                        <Button className="self-end capitalize w-full" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Chargement...
                        </Button>
                    ) : (
                        <Button className="self-end capitalize w-full" type="submit">
                            <EyeOff className="h-5 w-5 mr-2" />
                            Mettre à jour le mot de passe
                        </Button>
                    )}
                </div>
            </motion.form>
        </FormProvider>
    );
}
