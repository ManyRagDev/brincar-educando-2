"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Infinity as InfinityIcon, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

const STORAGE_KEY = "brincar-educando-calm-notice-dismissed";

function HandDrawnArrow() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 right-4 sm:right-12 md:right-16 z-[60] pointer-events-none hidden sm:block"
        >
            <div className="relative">
                <svg
                    width="100"
                    height="60"
                    viewBox="0 0 100 60"
                    fill="none"
                    className="text-[var(--color-primary)] opacity-80"
                >
                    <motion.path
                        d="M10 50 Q 30 10, 85 15"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M75 5 L 90 15 L 75 25"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    />
                </svg>
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="absolute -left-12 top-10 text-[11px] font-bold text-[var(--color-primary)] rotate-[-15deg] whitespace-nowrap"
                >
                    Experimente aqui!
                </motion.span>
            </div>
        </motion.div>
    );
}

export function CalmModeNotice() {
    const [isVisible, setIsVisible] = useState(false);
    const [showArrow, setShowArrow] = useState(false);
    const { theme, toggleTheme, isAcolher } = useTheme();

    useEffect(() => {
        // Check if user already dismissed it
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed === "true") return;

        // Show notice after 3 seconds
        const noticeTimer = setTimeout(() => {
            setIsVisible(true);
            // Show arrow 1 second after notice
            const arrowTimer = setTimeout(() => setShowArrow(true), 1000);
            return () => clearTimeout(arrowTimer);
        }, 3000);

        return () => clearTimeout(noticeTimer);
    }, []);

    // Auto-hide arrow after 8 seconds of visibility
    useEffect(() => {
        if (showArrow) {
            const timer = setTimeout(() => setShowArrow(false), 8000);
            return () => clearTimeout(timer);
        }
    }, [showArrow]);

    const handleDismiss = () => {
        setIsVisible(false);
        setShowArrow(false);
        localStorage.setItem(STORAGE_KEY, "true");
    };

    const handleToggle = () => {
        toggleTheme();
        setShowArrow(false); // Hide arrow on first interaction
    };

    return (
        <>
            <AnimatePresence>
                {showArrow && <HandDrawnArrow key="calm-arrow" />}
            </AnimatePresence>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={cn(
                            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[50] w-[90%] max-w-sm sm:w-auto",
                            "bg-[var(--color-card)] border-2 border-[var(--color-primary)]/20",
                            "rounded-3xl p-4 shadow-2xl backdrop-blur-md",
                            "flex flex-col sm:flex-row items-center gap-4"
                        )}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                <InfinityIcon className="h-5 w-5 text-[var(--color-primary)]" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-[var(--color-foreground)] leading-tight">
                                    Ambiente Acolhedor
                                </p>
                                <p className="text-[10px] text-[var(--color-muted-foreground)] font-medium">
                                    Cores suaves para quem prefere menos estímulo.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleToggle}
                                className={cn(
                                    "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                                    isAcolher
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg active:scale-95"
                                )}
                            >
                                {isAcolher ? (
                                    <>
                                        <Check className="h-3 w-3" /> Ativado
                                    </>
                                ) : (
                                    "Ativar Modo"
                                )}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="p-2 rounded-xl hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] transition-colors"
                                aria-label="Dispensar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
