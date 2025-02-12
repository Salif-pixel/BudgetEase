"use client"

import { useState} from "react"
import { motion } from "framer-motion"
import { Camera,Shield, Bell } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Card, CardContent } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import {useEdgeStore} from "@/src/lib/edgestore";
import {updateImageAccount} from "@/src/actions/account.action";
import {Account, User} from "@prisma/client";
import {useCustomToast} from "@/src/components/spectrum/alert";
import ChangePasswordForm from "@/src/components/account/changePasswordForm";
import {PersonalInfoForm} from "@/src/components/account/PersonalInfo";


export default function ProfileComponent({user}: {user: User & { accounts: Account[] } }) {
    const [avatarSrc, setAvatarSrc] = useState(user.image || "")
    const [backgroundSrc, setBackgroundSrc] = useState(user.background || "")
    const { edgestore } = useEdgeStore();
    const { showToast } = useCustomToast();

    const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (file) {

            const res = await edgestore.publicFiles.upload({
                file,
                options: {
                    replaceTargetUrl: user.image || "",
                },
            });
            setAvatarSrc(res.url)
            await updateImageAccount(user.id, res.url, backgroundSrc)
            showToast("Image de profil mise à jour", "Votre image de profil a été mise à jour avec succès", "success")
        }
    }
    const handleFileBackgroundChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                options: {
                    replaceTargetUrl: user.background || "",
                },
            });
            setBackgroundSrc(res.url)
            await updateImageAccount(user.id, avatarSrc, res.url)
            showToast("Image de fond mise à jour", "Votre image de fond a été mise à jour avec succès", "success")
        }
    }

    // Fonction pour obtenir les initiales
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
    }

    const initials = getInitials(user.name || "")

    return (
            <div className="h-full">
                {/* Hero Section avec Background */}
                <div className="relative h-[calc(100vh-30vh)] bg-primary/90 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary"
                        style={{
                            backgroundImage: `url(${backgroundSrc})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundBlendMode: "overlay",
                        }}
                    />
                    <input type="file" id="background-upload" className="hidden" accept="image/*" onChange={handleFileBackgroundChange} />
                    <label
                        htmlFor="background-upload"
                        className="absolute top-2 right-2 z-50 rounded-full bg-secondary p-2 hover:bg-secondary/70 cursor-pointer"
                    >
                        <Camera className="h-4 w-4" />
                    </label>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                </div>

                {/* Contenu Principal */}
                <main className="container mx-auto px-4 pb-8">
                    <div className=" pb-8 pt-2 flex items-end space-x-4">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 border-4 botext-background shadow-xl transition-transform group-hover:scale-105">
                                <AvatarImage src={avatarSrc} alt="Photo de profil" />
                                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 rounded-full bg-secondary hover:bg-secondary/90 transition-colors cursor-pointer p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <Camera className="h-4 w-4" />
                            </label>
                        </div>
                        <div className="mb-4 text-foreground">
                            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                            <p className="text-foreground/80">{user.email}</p>
                        </div>
                    </div>
                    <Tabs defaultValue="profile" className="space-y-8">
                        <TabsList className="grid w-full max-w-[400px] grid-cols-3">
                            <TabsTrigger value="profile">Profil</TabsTrigger>
                            <TabsTrigger value="security">Sécurité</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <PersonalInfoForm user={user}/>
                          </TabsContent>

                        <TabsContent value="security">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <Card className="border-none shadow-lg">
                                    <CardContent className="p-6 space-y-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Shield className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold text-xl">Changer votre mot de passe</h3>
                                        </div>
                                        <ChangePasswordForm user={user}/>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <Card className="border-none shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Bell className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold text-xl">Préférences de notifications</h3>
                                        </div>
                                        {/* Ajouter les préférences de notification ici */}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
    )
}

