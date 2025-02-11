import { Alert } from "@/src/components/ui/alert";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon, PartyPopper, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";

type AlertVariant = "success" | "error" | "warning" | "info" | "celebration";

interface AlertComponentProps {
    className?: string;
    title: string;
    description?: string;
    variant?: AlertVariant;
    icon?: LucideIcon;
    badge?: string;
}

const variantStyles = {
    success: {
        bg: "from-green-50 to-white dark:from-green-950/20 dark:to-zinc-950",
        border: "border-green-100 dark:border-green-900/50",
        shadow: "shadow-[0_1px_6px_0_rgba(34,197,94,0.06)]",
        icon: {
            bg: "from-emerald-500 via-green-500 to-teal-500 dark:from-emerald-600 dark:via-green-600 dark:to-teal-600",
            component: CheckCircle2
        },
        text: {
            title: "text-green-900 dark:text-green-100",
            description: "text-green-600 dark:text-green-300"
        },
        glow: {
            start: "bg-emerald-400 dark:bg-emerald-600/30",
            middle: "bg-green-400 dark:bg-green-600/30",
            end: "bg-teal-400 dark:bg-teal-600/30"
        },
        badge: {
            bg: "from-emerald-500/10 via-green-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:via-green-500/20 dark:to-teal-500/20",
            text: "text-green-700 dark:text-green-200",
            ring: "ring-green-500/20 dark:ring-green-400/20"
        }
    },
    error: {
        bg: "from-red-50 to-white dark:from-red-950/20 dark:to-zinc-950",
        border: "border-red-100 dark:border-red-900/50",
        shadow: "shadow-[0_1px_6px_0_rgba(239,68,68,0.06)]",
        icon: {
            bg: "from-rose-500 via-red-500 to-pink-500 dark:from-rose-600 dark:via-red-600 dark:to-pink-600",
            component: XCircle
        },
        text: {
            title: "text-red-900 dark:text-red-100",
            description: "text-red-600 dark:text-red-300"
        },
        glow: {
            start: "bg-rose-400 dark:bg-rose-600/30",
            middle: "bg-red-400 dark:bg-red-600/30",
            end: "bg-pink-400 dark:bg-pink-600/30"
        },
        badge: {
            bg: "from-rose-500/10 via-red-500/10 to-pink-500/10 dark:from-rose-500/20 dark:via-red-500/20 dark:to-pink-500/20",
            text: "text-red-700 dark:text-red-200",
            ring: "ring-red-500/20 dark:ring-red-400/20"
        }
    },
    warning: {
        bg: "from-yellow-50 to-white dark:from-yellow-950/20 dark:to-zinc-950",
        border: "border-yellow-100 dark:border-yellow-900/50",
        shadow: "shadow-[0_1px_6px_0_rgba(234,179,8,0.06)]",
        icon: {
            bg: "from-amber-500 via-yellow-500 to-orange-500 dark:from-amber-600 dark:via-yellow-600 dark:to-orange-600",
            component: AlertCircle
        },
        text: {
            title: "text-yellow-900 dark:text-yellow-100",
            description: "text-yellow-600 dark:text-yellow-300"
        },
        glow: {
            start: "bg-amber-400 dark:bg-amber-600/30",
            middle: "bg-yellow-400 dark:bg-yellow-600/30",
            end: "bg-orange-400 dark:bg-orange-600/30"
        },
        badge: {
            bg: "from-amber-500/10 via-yellow-500/10 to-orange-500/10 dark:from-amber-500/20 dark:via-yellow-500/20 dark:to-orange-500/20",
            text: "text-yellow-700 dark:text-yellow-200",
            ring: "ring-yellow-500/20 dark:ring-yellow-400/20"
        }
    },
    celebration: {
        bg: "from-violet-50 to-white dark:from-violet-950/20 dark:to-zinc-950",
        border: "border-violet-100 dark:border-violet-900/50",
        shadow: "shadow-[0_1px_6px_0_rgba(139,92,246,0.06)]",
        icon: {
            bg: "from-fuchsia-500 via-violet-500 to-indigo-500 dark:from-fuchsia-600 dark:via-violet-600 dark:to-indigo-600",
            component: PartyPopper
        },
        text: {
            title: "text-violet-900 dark:text-violet-100",
            description: "text-violet-600 dark:text-violet-300"
        },
        glow: {
            start: "bg-fuchsia-400 dark:bg-fuchsia-600/30",
            middle: "bg-violet-400 dark:bg-violet-600/30",
            end: "bg-indigo-400 dark:bg-indigo-600/30"
        },
        badge: {
            bg: "from-fuchsia-500/10 via-violet-500/10 to-indigo-500/10 dark:from-fuchsia-500/20 dark:via-violet-500/20 dark:to-indigo-500/20",
            text: "text-violet-700 dark:text-violet-200",
            ring: "ring-violet-500/20 dark:ring-violet-400/20"
        }
    },
    info: {
        bg: "from-blue-50 to-white dark:from-blue-950/20 dark:to-zinc-950",
        border: "border-blue-100 dark:border-blue-900/50",
        shadow: "shadow-[0_1px_6px_0_rgba(59,130,246,0.06)]",
        icon: {
            bg: "from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-600 dark:via-blue-600 dark:to-indigo-600",
            component: AlertCircle
        },
        text: {
            title: "text-blue-900 dark:text-blue-100",
            description: "text-blue-600 dark:text-blue-300"
        },
        glow: {
            start: "bg-cyan-400 dark:bg-cyan-600/30",
            middle: "bg-blue-400 dark:bg-blue-600/30",
            end: "bg-indigo-400 dark:bg-indigo-600/30"
        },
        badge: {
            bg: "from-cyan-500/10 via-blue-500/10 to-indigo-500/10 dark:from-cyan-500/20 dark:via-blue-500/20 dark:to-indigo-500/20",
            text: "text-blue-700 dark:text-blue-200",
            ring: "ring-blue-500/20 dark:ring-blue-400/20"
        }
    }
};

export function AlertComponent({
                                   className,
                                   title,
                                   description,
                                   variant = "celebration",
                                   icon,
                                   badge
                               }: AlertComponentProps) {
    const styles = variantStyles[variant];
    const IconComponent = icon || styles.icon.component;

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("w-full max-w-lg mx-auto", className)}
        >
            <Alert className={cn(
                "relative overflow-hidden",
                `bg-gradient-to-b ${styles.bg}`,
                styles.border,
                styles.shadow,
                "rounded-xl p-4 w-full",
                className
            )}>
                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ rotate: -15, scale: 0.5 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                    >
                        <div className={cn(
                            "p-2.5 rounded-xl",
                            `bg-gradient-to-br ${styles.icon.bg}`,
                        )}>
                            <IconComponent className="h-5 w-5 text-white" />
                        </div>
                    </motion.div>

                    <div className="space-y-1">
                        <motion.h3
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className={cn(
                                "font-medium",
                                styles.text.title
                            )}
                        >
                            {title}
                        </motion.h3>
                        {description && (
                            <motion.p
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className={cn(
                                    "text-sm",
                                    styles.text.description
                                )}
                            >
                                {description}
                            </motion.p>
                        )}
                    </div>
                </div>

                <div className="absolute inset-0 pointer-events-none">
                    <div className={cn("absolute -left-2 -top-2 h-16 w-16 rounded-full blur-2xl opacity-20", styles.glow.start)} />
                    <div className={cn("absolute top-2 right-8 h-12 w-12 rounded-full blur-2xl opacity-20", styles.glow.middle)} />
                    <div className={cn("absolute -right-2 -bottom-2 h-16 w-16 rounded-full blur-2xl opacity-20", styles.glow.end)} />
                </div>

                {badge && (
                    <div className="absolute top-4 right-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                delay: 0.3
                            }}
                            className={cn(
                                "text-[11px] font-medium",
                                "px-2.5 py-0.5 rounded-full",
                                `bg-gradient-to-r ${styles.badge.bg}`,
                                styles.badge.text,
                                `ring-1 ${styles.badge.ring}`
                            )}
                        >
                            {badge}
                        </motion.div>
                    </div>
                )}
            </Alert>
        </motion.div>
    );
}

export function useCustomToast() {
    const { toast } = useToast();

    const showToast = (
        title: string,
        description?: string,
        variant: AlertVariant = "celebration",
        badge?: string
    ) => {
        toast({
            duration: 4000,
            className: "border-0 p-0 w-fit",
            description: (
                <AlertComponent
                    title={title}
                    description={description}
                    variant={variant}
                    badge={badge}
                />
            ),
        });
    };

    return { showToast };
}