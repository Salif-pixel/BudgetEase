"use client"

import React from "react"


import { LogoCarousel } from "@/src/components/cult/logoCarousel"
import {GradientHeading} from "@/src/components/cult/gradientheading";


export function Hero() {
    return (
        <div className="space-y-8  py-24">
            <div className="w-full max-w-screen-lg mx-auto flex flex-col items-center space-y-8">
                <div className="text-center">
                    <GradientHeading variant="default" size="lg" weight="bold">
                        Les différentes technologies utilisées
                    </GradientHeading>

                </div>

                <LogoCarousel columnCount={3} />
            </div>
        </div>
    )
}
