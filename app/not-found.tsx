"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import Link from "next/link"
import SplashCursor from "@/src/components/reactbits/SplashCursor/SplashCursor";

const NotFound = () => {
    const particlesRef = useRef<HTMLCanvasElement>(null)
    const controls = useAnimation()
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        const canvas = particlesRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = windowSize.width
        canvas.height = windowSize.height

        const bubbles: { x: number; y: number; size: number; speed: number }[] = []

        const createBubble = () => ({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 20,
            size: Math.random() * 4 + 1,
            speed: Math.random() * 1 + 0.5,
        })

        for (let i = 0; i < 100; i++) {
            bubbles.push(createBubble())
        }

        const animateBubbles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            bubbles.forEach((bubble, index) => {
                ctx.beginPath()
                ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`
                ctx.fill()

                bubble.y -= bubble.speed
                if (bubble.y + bubble.size < 0) {
                    bubbles[index] = createBubble()
                }

                // Add subtle horizontal movement
                bubble.x += Math.sin(bubble.y * 0.1) * 0.5
            })
            requestAnimationFrame(animateBubbles)
        }

        animateBubbles()

        const sequence = async () => {
            try {
                await controls.start({ opacity: 1, y: 0, transition: { duration: 2 } });
                await controls.start({
                    y: [0, -20, 0],
                    transition: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                });
            } catch  {

            }
        };

        sequence();
    }, [controls, windowSize])

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-primary via-primary/90 to-black overflow-hidden flex flex-col items-center justify-center text-white">
            <canvas ref={particlesRef} className="absolute inset-0" />

            {/* Seaweed */}
            <SeaweedSVG className="absolute bottom-0 left-0 w-full h-64" />

            {/* Fish */}
            <FishSVG
                className="absolute top-1/4 -left-20 w-20 h-20"
                animate={{
                    x: ["0%", "120%"],
                    y: ["0%", "5%", "0%", "-5%", "0%"],
                }}
                transition={{
                    x: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    y: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                }}
            />

            {/* 404 Text */}
            <motion.h1
                className="text-9xl font-bold mb-8 relative z-10 text-blue-200"
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                style={{ textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
            >
                404
            </motion.h1>

            {/* Error Message */}
            <motion.p
                className="text-2xl mb-8 text-center relative z-10 text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                Vous vous êtes aventuré trop profondément.
                <br />
                Cette page est perdue dans les abysses.
            </motion.p>

            {/* Return Home Button */}
            <motion.div className="relative z-10" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                    href="/"
                    className="bg-primary/70 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary transition-colors shadow-lg"
                >
                    Remonter à la surface
                </Link>
            </motion.div>

            {/* Light rays */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-300/10 to-transparent opacity-50" />
            <SplashCursor />
        </div>
    )
}

const SeaweedSVG = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
            d="M10 100C10 80 20 70 20 50C20 30 10 20 10 0"
            stroke="#4CAF50"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
        />
        <motion.path
            d="M30 100C30 80 40 70 40 50C40 30 30 20 30 0"
            stroke="#4CAF50"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.path
            d="M50 100C50 80 60 70 60 50C60 30 50 20 50 0"
            stroke="#4CAF50"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
        />
        <motion.path
            d="M70 100C70 80 80 70 80 50C80 30 70 20 70 0"
            stroke="#4CAF50"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
        />
        <motion.path
            d="M90 100C90 80 100 70 100 50C100 30 90 20 90 0"
            stroke="#4CAF50"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 2 }}
        />
    </svg>
)

const FishSVG = motion(({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
            d="M70 50C70 69.33 54.33 85 35 85C15.67 85 0 69.33 0 50C0 30.67 15.67 15 35 15C54.33 15 70 30.67 70 50Z"
            fill="#FF9800"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.path
            d="M100 50L70 30V70L100 50Z"
            fill="#FF9800"
            initial={{ x: 0 }}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <circle cx="25" cy="45" r="5" fill="black" />
    </svg>
))

export default NotFound

