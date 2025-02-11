import { motion } from "framer-motion";
import {Lock, User2Icon} from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormMail } from "@/src/components/input-component/input-mail";
import { CustomFormPassword } from "@/src/components/input-component/password-indicator";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCustomToast } from "@/src/components/spectrum/alert";
import { CustomFormInput } from "@/src/components/input-component/input-field";

import { z } from "zod";
import {handleClick} from "@/src/components/magic/confettis";
import {authClient} from "@/src/lib/authClient";
const registerSchema = z.object({
    email: z.string().email("L'adresse email n'est pas valide").nonempty("Veuillez entrer une adresse email"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").nonempty("Veuillez entrer un mot de passe"),
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères").nonempty("Veuillez entrer un nom d'utilisateur"),
});

export type RegisterFormType = {
    email: string;
    password: string;
    username: string;

};
export default function RegisterForm() {
    const [isPending, setIsPending] = useState(false);
    const { showToast } = useCustomToast();

    // Initialisation du formulaire avec react-hook-form et zod
    const form = useForm<RegisterFormType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },
    });

    // Gestion de la soumission du formulaire
    const onSubmit = async (values: RegisterFormType) => {
        setIsPending(true);
        const { email, password, username } = values;
        const { data, error } = await authClient.signUp.email({
            email: email,
            password: password,
            name: username,
            callbackURL: "/login",
        },{
            onRequest: (ctx) => {
                showToast("Inscription en cours...", "Veuillez patienter pendant que nous créons votre compte.", "info");
            },
            onSuccess: (ctx) => {
                form.reset()
                showToast("Inscription réussie! 🎉", "Vous êtes maintenant inscrit à BudgetEase.","celebration");
                handleClick();
            },
            onError: (ctx) => {
                showToast("Erreur lors de l'inscription", ctx.error.message, "error");
                form.setError("email", {
                    type: "manual",
                    message: ctx.error.message,
                })
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
                        Créez votre compte
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-2 text-gray-600"
                    >
                        Rejoignez-nous et gérez votre budget en toute simplicité
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
                        {/* Champ Nom d'utilisateur */}
                        <div>
                            <CustomFormInput
                                name="username"
                                control={form.control}
                                label="Nom d'utilisateur"
                                placeholder="Entrez votre nom d'utilisateur"
                                icon={<User2Icon className="h-5 w-5 text-gray-400" />}
                            />
                        </div>

                        {/* Champ Email */}
                        <div>
                            <CustomFormMail name="email" control={form.control} labelText={"Adresse mail"} />
                        </div>

                        {/* Champ Mot de passe */}
                        <div>
                            <CustomFormPassword name="password" control={form.control} labelText={"mot de passe"} />
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
                                    <Lock className="h-5 w-5 mr-2" />
                                    S&apos;inscrire
                                </Button>
                            )}
                        </div>
                    </motion.form>
                </FormProvider>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center"
                >
                    <p className="text-sm text-gray-600">
                        Vous avez déjà un compte ?{" "}
                        <a href="/login" className="text-primary/70 hover:text-primary">
                            Connectez-vous
                        </a>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}


