
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useState } from "react";
import {FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormMail } from "@/src/components/input-component/input-mail";
import {CustomFormPassword} from "@/src/components/input-component/password-indicator";
import { Button } from "@/src/components/ui/button"; // Assumed import for your button component
import { Loader2 } from "lucide-react";
import { z } from "zod";
import {RiGoogleFill, RiGithubFill } from "@remixicon/react"
import { useCustomToast } from "@/src/components/spectrum/alert";
import * as React from "react";
import {authClient} from "@/src/lib/authClient";
import Link from "next/link";



// Define the schema for validation (use zod here)
const LoginFormSchema = z.object({
    email: z.string().email("l'adresse email n'est pas valide").nonempty("Veuillez entrer une adresse email"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").nonempty("Veuillez entrer un mot de passe"),
});
export type LoginFormType = {
    email: string;
    password: string;
};

export default function LoginForm() {
    const signInGithub = async () => {
        showToast( "Connexion en cours...",  "Veuillez patienter pendant que nous vous connectons à votre compte.","info");

        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/settings/account",
        })
        await new Promise((resolve) => setTimeout(resolve, 2000));
        showToast( "Connexion réussie! 🎉",  "Vous êtes maintenant connecté à votre compte.","celebration");
    }
    const signInGoogle = async () => {
        showToast( "Connexion en cours...",  "Veuillez patienter pendant que nous vous connectons à votre compte.","info");

        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/settings/account",
        })
        await new Promise((resolve) => setTimeout(resolve, 2000));
        showToast( "Connexion réussie! 🎉",  "Vous êtes maintenant connecté à votre compte.","celebration");
    }
    const [isPending, setIsPending] = useState(false);
    const { showToast } = useCustomToast();
    const form = useForm({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Submit handler
    const onSubmit = async (values: LoginFormType) => {
        setIsPending(true);
        const { email, password} = values;
        const { data, error } = await authClient.signIn.email({
            email: email,
            password: password,
            callbackURL: "/settings/account",
        },{
            onRequest: (ctx) => {
                showToast( "Connexion en cours...",  "Veuillez patienter pendant que nous vous connectons à votre compte.","info");
            },
            onSuccess: (ctx) => {
                form.reset()
                showToast( "Connexion réussie! 🎉",  "Vous êtes maintenant connecté à votre compte.","celebration");
            },
            onError: (ctx) => {
                if(ctx.error.message === "Invalid email or password"){
                    showToast( "Erreur lors de la connexion",  "Vos identifiants sont incorrects. Veuillez réessayer.","error");
                }else {
                    showToast( "Erreur lors de la connexion",  ctx.error.message,"error");
                }

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
                        Connexion à votre compte
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-2 text-gray-600"
                    >
                        Gérez le budget de votre établissement en toute simplicité
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
                                <CustomFormMail name="email" control={form.control} labelText={"Adresse mail"} />

                            </div>

                            <div>
                                <CustomFormPassword name="password" control={form.control} labelText={"mot de passe"} />

                            </div>

                            <div className={"w-full"}>
                                {isPending ? (
                                    <Button className="self-end capitalize w-full" disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        chargement...
                                    </Button>
                                ) : (
                                    <Button className="self-end capitalize w-full " type="submit">
                                        <Lock className="h-5 w-5 mr-2" />
                                        Se connecter
                                    </Button>
                                )}
                            </div>
                        </motion.form>

                        <div className="flex flex-col gap-2">
                            <Button onClick={()=>{signInGoogle()}} className="bg-[#DB4437] text-white after:flex-1 hover:bg-[#DB4437]/90">
                                <span className="pointer-events-none me-2 flex-1">
                                    <RiGoogleFill className="opacity-60" size={16} aria-hidden="true" />
                                </span>
                                Se connecter avec Google
                            </Button>
                            <Button onClick={()=>{signInGithub()}} className="bg-[#14171a] text-white after:flex-1 hover:bg-[#14171a]/90">
                                <span className="pointer-events-none me-2 flex-1">
                                  <RiGithubFill className="opacity-60" size={16} aria-hidden="true" />
                                </span>
                                Se connecter avec Github
                            </Button>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="text-center "
                        >
                            <p className="text-sm text-gray-600">
                                Vous n&apos;avez pas encore de compte ?{" "}
                                <a href="/register" className="text-primary/70 hover:text-primary">
                                    Inscrivez-vous
                                </a>
                            </p>
                            <Link onClick={async()=> {
                                const { data, error } = await authClient.forgetPassword({
                                    email: form.getValues("email"),
                                    redirectTo: "/reset-password",
                                },{
                                    onRequest: (ctx) => {
                                        showToast( "Vérification en cours...",  "Veuillez patienter pendant que nous vérifions votre adresse email.","info");
                                    },
                                    onSuccess: (ctx) => {
                                        showToast( "Email envoyé! 🎉",  "Un email de réinitialisation de mot de passe vous a été envoyé.","celebration");
                                    },
                                    onError: (ctx) => {
                                        showToast( "Erreur lors de la vérification",  ctx.error.message,"error");
                                    },
                                });

                            }}  href="#" className="text-sm text-primary/70 hover:text-primary">
                                Mot de passe oublié ?
                            </Link>
                        </motion.div>
                    </FormProvider>
            </div>

        </motion.div>
    );
}
