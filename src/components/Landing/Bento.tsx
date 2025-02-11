"use client";

import {EyeIcon, Lock, Sparkles, UsersIcon} from "lucide-react";
import { GlowingEffect } from "@/src/components/ui/glowing-effect";

export function Bento() {
    return (
        <div className={" w-full p-4 gap-4"}>
            <ul className=" grid grid-cols-1  grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                <GridItem
                    area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                    icon={<EyeIcon className="h-4 w-4 text-primary dark:text-neutral-40 " />}
                    title="Visualisation claire"
                    description="Graphiques interactifs pour une compréhension rapide des dépenses de l'école."
                />

                <GridItem
                    area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                    icon={<Sparkles className="h-4 w-4 text-primary dark:text-neutral-400" />}
                    title="Prévisions budgétaires."
                    description="Outils avancés pour planifier et prévoir les budgets futurs avec précision."
                />

                <GridItem
                    area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                    icon={<UsersIcon className="h-4 w-4 text-primary dark:text-neutral-400" />}
                    title="Collaboration"
                    description="Fonctionnalités de partage pour une meilleure coordination entre les départements."
                />

                <GridItem
                    area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                    icon={<Lock  className="h-4 w-4 text-primary dark:text-neutral-400" />}
                    title="Sécurité des données"
                    description="Protection avancée des informations financières sensibles de l'école."
                />

            </ul>

        </div>
          );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={`min-h-[14rem] list-none ${area}`}>
            <div className="relative h-full rounded-2.5xl border  p-2  md:rounded-3xl md:p-3">
                <GlowingEffect
                    blur={0}
                    borderWidth={3}
                    spread={80}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6  dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border border-gray-600 p-2 ">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-primary dark:text-white">
                                {title}
                            </h3>
                            <h2
                                className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm/[1.125rem]
              md:text-base/[1.375rem]  text-black dark:text-neutral-400"
                            >
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
