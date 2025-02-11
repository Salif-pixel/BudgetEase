"use client"


import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/src/components/ui/button"
import { Form} from "@/src/components/ui/form"
import { Card, CardContent } from "@/src/components/ui/card"
import { motion } from "framer-motion"
import { useState } from "react"
import { User } from "@prisma/client"
import { useCustomToast } from "@/src/components/spectrum/alert"
import { updateUserProfile } from "@/src/actions/account.action"
import {zodResolver} from "@hookform/resolvers/zod";
import {CustomFormInput} from "@/src/components/input-component/input-field";
import {Loader2} from "lucide-react"; // Assurez-vous de créer cette action

// Définition du schéma de validation
const personalInfoSchema = z.object({
    name: z.string().min(2, {
        message: "Le nom doit contenir au moins 2 caractères",
    }),
    email: z.string().email({
        message: "Veuillez entrer une adresse email valide",
    }),
})

type PersonalInfoFormProps = {
    user: User
}

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const { showToast } = useCustomToast()

    const form = useForm<z.infer<typeof personalInfoSchema>>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
        },
    })

    const handleSubmit = async (values: z.infer<typeof personalInfoSchema>) => {
        try {
            // Appel de l'action serveur pour mettre à jour le
            setIsPending(true)
           const result= await updateUserProfile(user.id, values)
            if (result && result.error) {
                showToast("Erreur", result.error, "error")
            }
            showToast(
                "Profil mis à jour",
                "Vos informations ont été mises à jour avec succès",
                "success"
            )
            setIsEditing(false)

        } catch  {
            showToast(
                "Erreur",
                "Une erreur est survenue lors de la mise à jour du profil",
                "error"
            )
        }
        setIsPending(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Informations Personnelles</h2>
                            {!isPending?<Button
                                variant="outline"
                                onClick={() => {
                                    if (isEditing) {
                                        form.handleSubmit(handleSubmit)()
                                    } else {
                                        setIsEditing(true)
                                    }
                                }}
                                className="transition-all hover:bg-primary hover:text-primary-foreground"
                            >
                                 {isEditing ? "Enregistrer" : "Modifier"}

                            </Button>:
                            <Button
                                variant="outline"
                                disabled={true}
                                className="transition-all hover:bg-primary hover:text-primary-foreground"
                                >
                                <Loader2 className="animate-spin h-6 w-6"/>
                                chargement ...
                            </Button>
                            }
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6 md:grid-cols-2">
                               <CustomFormInput name={"name"} control={form.control} disabled={!isEditing} label={"Nom"} />
                                <CustomFormInput name={"email"} control={form.control} disabled={true} label={"Nom"} />
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}