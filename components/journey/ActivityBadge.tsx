"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { Flame, Sun, Zap, Moon, Star, Clock } from "lucide-react";

export type BadgeType = "trending" | "outdoor" | "energy_high" | "energy_low" | "quick" | "new";

interface ActivityBadgeProps {
    type: BadgeType;
    className?: string;
    customText?: string;
}

export function ActivityBadge({ type, className, customText }: ActivityBadgeProps) {
    const { isAcolher } = useTheme();

    const config = {
        trending: {
            icon: Flame,
            text: "Em alta",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            acolherColor: "text-amber-700",
            acolherBg: "bg-amber-100",
        },
        outdoor: {
            icon: Sun,
            text: "Ao ar livre",
            color: "text-sky-500",
            bg: "bg-sky-500/10",
            border: "border-sky-500/20",
            acolherColor: "text-sky-700",
            acolherBg: "bg-sky-100",
        },
        energy_high: {
            icon: Zap,
            text: "Gastar energia",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
            acolherColor: "text-yellow-700",
            acolherBg: "bg-yellow-100",
        },
        energy_low: {
            icon: Moon,
            text: "Para acalmar",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/20",
            acolherColor: "text-indigo-700",
            acolherBg: "bg-indigo-100",
        },
        quick: {
            icon: Clock,
            text: "Rápida",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            acolherColor: "text-emerald-700",
            acolherBg: "bg-emerald-100",
        },
        new: {
            icon: Star,
            text: "Nova!",
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            border: "border-pink-500/20",
            acolherColor: "text-rose-700",
            acolherBg: "bg-rose-100",
        },
    };

    const badgeConfig = config[type];
    const Icon = badgeConfig.icon;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors",
                isAcolher
                    ? cn(badgeConfig.acolherBg, badgeConfig.acolherColor, "border-transparent")
                    : cn(badgeConfig.bg, badgeConfig.color, badgeConfig.border),
                className
            )}
        >
            <Icon className="w-3 h-3 fill-current" />
            <span>{customText || badgeConfig.text}</span>
        </div>
    );
}
