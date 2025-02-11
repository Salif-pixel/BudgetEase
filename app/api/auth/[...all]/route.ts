import { auth } from "@/src/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, { protectSignup } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/src/lib/prisma";

const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
        protectSignup({
            email: {
                mode: "LIVE",
                block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
            },
            bots: {
                mode: "LIVE",
                allow: [],
            },
            rateLimit: {
                // uses a sliding window rate limit
                mode: "LIVE",
                interval: "10m", // counts requests over a 10 minute sliding window
                max: 5000, // allows 5 submissions within the window
            },
        }),
    ],
});

const betterAuthHandlers = toNextJsHandler(auth.handler);

const ajProtectedPOST = async (req: NextRequest) => {
    // Cloner la requête une seule fois au début
    const clonedReq = req.clone();

    // Lire le body une seule fois
    const body = await clonedReq.json();
    const { email ,provider} = body;

    if(provider){
        const newReq = new NextRequest(req.url, {
            method: req.method,
            headers: req.headers,
            body: JSON.stringify(body),
        });
        return betterAuthHandlers.POST(newReq);

    }
        const isSignUp = req.url.includes("/register");
        if (isSignUp) {
            const existingUser = await prisma.user.findFirst({
                where: {email: email},
            });

            if (existingUser) {
                return NextResponse.json(
                    {message: "Cette adresse email est déjà utilisée."},
                    {status: 400}
                );
            }


            const decision = await aj.protect(req, {email});
            console.log("salif",decision.isDenied())

            if (decision.isDenied()) {
                if (decision.reason.isEmail()) {
                    let message = '';
                    if (decision.reason.emailTypes.includes("INVALID")) {
                        message = "l'adresse email n'est pas valide.";
                    } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
                        message = "l'adresse email est jetable. Veuillez utiliser une adresse email permanente.";
                    } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
                        message = "l'adresse email n'a pas de serveur de messagerie valide.";
                    } else {
                        message = "l'adresse email n'est pas valide.";
                    }

                    return NextResponse.json({
                        message,
                        reason: decision.reason,
                    }, {status: 400})
                } else {
                    return NextResponse.json({message: "vous avez été bloqué "}, {status: 403});
                }
            } else {
                // Créer une nouvelle requête avec le même body pour better-auth
                const newReq = new NextRequest(req.url, {
                    method: req.method,
                    headers: req.headers,
                    body: JSON.stringify(body)
                });

                return betterAuthHandlers.POST(newReq);
            }
        }else{
            return betterAuthHandlers.POST(req);
        }
}

export { ajProtectedPOST as POST }
export const { GET } = betterAuthHandlers;




