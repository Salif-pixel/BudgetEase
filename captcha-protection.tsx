// // components/CaptchaProtection.tsx
// import React, { useRef, useEffect } from 'react';
// import HCaptcha from '@hcaptcha/react-hcaptcha';
//
// interface CaptchaProtectionProps {
//   onVerify: (token: string) => void;
//   onError?: (error: Error) => void;
// }
//
// const CaptchaProtection: React.FC<CaptchaProtectionProps> = ({ onVerify, onError }) => {
//   const captchaRef = useRef<HCaptcha>(null);
//
//   return (
//     <div className="w-full flex justify-center my-4">
//       <HCaptcha
//         ref={captchaRef}
//         sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
//         onVerify={onVerify}
//         onError={onError}
//       />
//     </div>
//   );
// };
//
// export default CaptchaProtection;
//
// // pages/api/auth/sign-up/email.ts
// import { auth } from "@/src/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";
// import arcjet, { protectSignup } from "@arcjet/next";
// import { NextRequest, NextResponse } from "next/server";
//
// const aj = arcjet({
//     key: process.env.ARCJET_KEY!,
//     rules: [
//         protectSignup({
//             // ... vos règles Arcjet existantes
//         }),
//     ],
// });
//
// const betterAuthHandlers = toNextJsHandler(auth.handler);
//
// async function verifyCaptcha(token: string) {
//     const response = await fetch('https://hcaptcha.com/siteverify', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: new URLSearchParams({
//             secret: process.env.HCAPTCHA_SECRET_KEY!,
//             response: token
//         })
//     });
//
//     const data = await response.json();
//     return data.success;
// }
//
// const ajProtectedPOST = async (req: NextRequest) => {
//     const clonedReq = req.clone();
//     const body = await clonedReq.json();
//     const { email, captchaToken } = body;
//
//     // Vérifier le CAPTCHA
//     if (!captchaToken) {
//         return NextResponse.json({ message: "CAPTCHA required" }, { status: 400 });
//     }
//
//     const isValidCaptcha = await verifyCaptcha(captchaToken);
//     if (!isValidCaptcha) {
//         return NextResponse.json({ message: "Invalid CAPTCHA" }, { status: 400 });
//     }
//
//     const decision = await aj.protect(req, { email });
//
//     // ... reste de votre logique existante
// };
//
// export { ajProtectedPOST as POST };
// export const { GET } = betterAuthHandlers;
//
//
//
//
//
//
//
//
// //
// import CaptchaProtection from '@/components/CaptchaProtection';
//
// const SignUpForm = () => {
//     const [captchaToken, setCaptchaToken] = useState<string>('');
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         // Inclure le token dans votre requête d'inscription
//         const response = await fetch('/api/auth/sign-up/email', {
//             method: 'POST',
//             body: JSON.stringify({
//                 email,
//                 password,
//                 captchaToken,
//             })
//         });
//     };
//
//     return (
//         <form onSubmit={handleSubmit}>
//             {/* vos champs de formulaire */}
//             <CaptchaProtection
//                 onVerify={setCaptchaToken}
//                 onError={(error) => console.error('Captcha error:', error)}
//             />
//             <button type="submit">S'inscrire</button>
//         </form>
//     );
// };