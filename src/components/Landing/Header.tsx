import TextPressure from "@/src/components/reactbits/TextPressure";
import {Button, buttonVariants} from "@/src/components/ui/button";
import FinanceSVG from "../../assets/paypal-33.svg";
import Image from "next/image";
import {GradientHeading} from "@/src/components/cult/gradientheading";
import React from "react";
import Link from "next/link";
import {cn} from "@/src/lib/utils";
export default function Header() {
    return (
        <div className={"h-fit bg-primary border-[20px] border-background  rounded-[40px]"}>
            <div className={"w-full flex flex-col sm:flex-row gap-4 p-4 justify-between"}>
                <Button className={"bg-background text-foreground hover:bg-background rounded-full hover:text-foreground "}>
                    <div className={"flex flex-row w-full"}>
                        <div className="grid flex-1  text-center text-sm leading-tight">
                            <span className="truncate font-semibold">💰BudgetEase</span>
                        </div>
                    </div>
                </Button>
                <div className={"flex flex-col sm:flex-row sm:justify-end gap-4 "}>
                    <Link
                        href="/login"
                        className={cn(
                            buttonVariants({ size: "lg", variant: "outline" }),
                            "rounded-full bg-background  text-foreground hover:text-foreground/70 hover:bg-background/70"
                        )}
                    >
                        Se connecter
                    </Link>
                    <Link
                        href="/register"
                        className={cn(
                            buttonVariants({ size: "lg", variant: "outline" }),
                            "rounded-full bg-foreground   text-background hover:text-background/70 hover:bg-foreground/70"
                        )}
                    >
                        S&apos;inscire
                    </Link>


                </div>
            </div>

            <div className={"w-full h-full relative flex flex-row "}>
                <div className={" w-full h-full "}>
                    <TextPressure
                        className={"hidden sm:flex"}
                        text="Bienvenue"
                        flex={true}
                        alpha={false}
                        stroke={false}
                        width={true}
                        weight={true}
                        italic={true}
                        textColor="#ffffff"
                        strokeColor="#ff0000"
                        minFontSize={10}
                    />
                    <GradientHeading className={" block md:hidden text-center text-white"} variant="light" size="xxxl" weight="bold">
                        Bienvenue
                    </GradientHeading>
                    <p className={" p-10 text-xs lg:text-lg text-background font-bold"}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et luctus enim justo non justo. Ut felis.
                    </p>

                </div>
                <Image className={"hidden lg:block"} src={FinanceSVG} width={"500"} height={"500"} alt={"finance"} />
            </div>

        </div>
    )
}