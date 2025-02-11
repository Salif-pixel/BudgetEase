"use client"

import { motion, useAnimation } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const BudgetAnimation = () => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const controls = useAnimation()

    const primaryColor = "hsl(var(--primary))"
    const primaryForeground = "hsl(var(--primary-foreground))"
    const background = isDark ? "hsl(var(--background))" : "hsl(var(--background))"
    const foreground = isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))"

    const [percentages, setPercentages] = useState([25, 10, 15])

    useEffect(() => {
        const updatePercentages = () => {
            setPercentages(percentages.map(() => Math.floor(Math.random() * 30) + 10))
        }

        const interval = setInterval(updatePercentages, 5000)
        return () => clearInterval(interval)
    }, [percentages, setPercentages]) // Added setPercentages to dependencies

    useEffect(() => {
        controls.start({
            pathLength: [0, 1],
            opacity: [0, 1],
            transition: { duration: 3, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
        })
    }, [controls])

    return (
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* Background */}
            <motion.rect
                x="0"
                y="0"
                width="400"
                height="400"
                rx="20"
                fill={background}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            />

            {/* Animated lines */}
            {[0, 1, 2, 3].map((i) => (
                <motion.path
                    key={`line-${i}`}
                    d={`M${50 + i * 100},50 Q${200},${150 + i * 50} ${350 - i * 100},350`}
                    stroke={primaryColor}
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={controls}
                />
            ))}

            {/* Pie Chart */}
            <motion.circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke={primaryColor}
                strokeWidth="40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 5, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
            <motion.circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke={primaryForeground}
                strokeWidth="40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 0.65 }}
                transition={{
                    duration: 5,
                    delay: 0.5,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                }}
            />

            {/* Coins */}
            {[40, 100, 160].map((y, index) => (
                <motion.g key={index} filter="url(#shadow)">
                    <motion.circle
                        cx="320"
                        cy={y}
                        r="30"
                        fill={primaryColor}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 1,
                            delay: index * 0.3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            repeatDelay: 4,
                        }}
                    />
                    <motion.text
                        x="320"
                        y={y}
                        fontSize="24"
                        fontWeight="bold"
                        fill={primaryForeground}
                        textAnchor="middle"
                        dominantBaseline="central"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 1,
                            delay: 0.3 + index * 0.3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            repeatDelay: 4,
                        }}
                    >
                        €
                    </motion.text>
                </motion.g>
            ))}

            {/* Bar Chart */}
            {[
                { height: 100, x: 60, color: primaryColor },
                { height: 150, x: 120, color: primaryForeground },
                { height: 80, x: 180, color: primaryColor },
            ].map((bar, index) => (
                <motion.rect
                    key={index}
                    x={bar.x}
                    y={400 - bar.height}
                    width="40"
                    height={bar.height}
                    fill={bar.color}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                        duration: 2,
                        delay: 1 + index * 0.3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        repeatDelay: 3,
                    }}
                />
            ))}

            {/* Floating numbers */}
            {[
                { x: 80, y: 100 },
                { x: 300, y: 250 },
                { x: 150, y: 300 },
            ].map((item, index) => (
                <motion.text
                    key={index}
                    x={item.x}
                    y={item.y}
                    fill={foreground}
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    initial={{ opacity: 0, y: item.y + 20 }}
                    animate={{ opacity: 1, y: item.y }}
                    transition={{
                        duration: 2,
                        delay: 2 + index * 0.3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        repeatDelay: 3,
                    }}
                >
                    {percentages[index]}%
                </motion.text>
            ))}
        </svg>
    )
}

export default BudgetAnimation

