"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Infinity as InfinityIcon, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

const STORAGE_KEY = "brincar-educando-calm-notice-dismissed";
const NOTICE_DURATION_SECONDS = 6;

function HandDrawnArrow() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-4 sm:right-12 md:right-16 z-[60] pointer-events-none hidden sm:block"
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
    const [remainingSeconds, setRemainingSeconds] = useState(NOTICE_DURATION_SECONDS);
    const { toggleTheme, isAcolher } = useTheme();

    useEffect(() => {
        // Check if user already dismissed it
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed === "true") return;

        // Show notice after 2.5 seconds
        const noticeTimer = setTimeout(() => {
            setIsVisible(true);
            const arrowTimer = setTimeout(() => setShowArrow(true), 800);
            return () => clearTimeout(arrowTimer);
        }, 2500);

        return () => clearTimeout(noticeTimer);
    }, []);

    // Countdown and auto-dismiss timer
    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setRemainingSeconds((current) => {
                if (current <= 1) {
                    setIsVisible(false);
                    setShowArrow(false);
                    localStorage.setItem(STORAGE_KEY, "true");
                    return 0;
                }
                return current - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isVisible]);

    const handleDismiss = () => {
        setIsVisible(false);
        setShowArrow(false);
        localStorage.setItem(STORAGE_KEY, "true");
    };

    const handleToggle = () => {
        toggleTheme();
        setShowArrow(false);
    };

    return (
        <>
            <AnimatePresence>
                {showArrow && <HandDrawnArrow key="calm-arrow" />}
            </AnimatePresence>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={cn(
                            "fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-1/2 -translate-x-1/2 z-[45] w-[calc(100%-2rem)] max-w-sm sm:w-auto",
                            "bg-[var(--color-card)]/95 border border-[var(--color-primary)]/25 overflow-hidden",
                            "rounded-2xl sm:rounded-3xl p-3.5 shadow-2xl backdrop-blur-lg",
                            "flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                        )}
                    >
                        <div className="flex items-center gap-3 flex-1 w-full">
                            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                <InfinityIcon className="h-4 w-4 text-[var(--color-primary)]" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-black text-[var(--color-foreground)] leading-tight">
                                        Ambiente Acolhedor
                                    </p>
                                    <span className="text-[10px] font-bold text-[var(--color-muted-foreground)] tabular-nums">
                                        {remainingSeconds}s
                                    </span>
                                </div>
                                <p className="text-[10px] text-[var(--color-muted-foreground)] font-medium truncate">
                                    Cores suaves para quem prefere menos estímulo.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleToggle}
                                className={cn(
                                    "flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[36px]",
                                    isAcolher
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-[var(--color-primary)] text-white shadow-sm hover:brightness-95 active:scale-95"
                                )}
                            >
                                {isAcolher ? (
                                    <>
                                        <Check className="h-3.5 w-3.5" /> Ativado
                                    </>
                                ) : (
                                    "Ativar Modo"
                                )}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="p-1.5 rounded-xl hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                                aria-label="Dispensar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Barra de progresso visual de tempo restante */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-muted)]">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: NOTICE_DURATION_SECONDS, ease: "linear" }}
                                className="h-full bg-[var(--color-primary)]"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
