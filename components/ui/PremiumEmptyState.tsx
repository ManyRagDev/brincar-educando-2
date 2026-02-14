import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoveLeft, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PremiumEmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionLink?: string;
    imageSrc?: string;
    className?: string;
}

export function PremiumEmptyState({
    title,
    description,
    actionLabel,
    actionLink,
    imageSrc,
    className
}: PremiumEmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center text-center p-8 min-h-[400px] animate-in fade-in zoom-in duration-500",
            className
        )}>
            <div className="relative w-48 h-48 mb-6">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt="Empty state"
                        fill
                        className="object-contain drop-shadow-xl"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-full">
                        <SearchX className="w-20 h-20 text-muted-foreground/50" />
                    </div>
                )}

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-blue-400 rounded-full blur-xl opacity-30" />
            </div>

            <h3 className="text-2xl font-bold tracking-tight mb-2 max-w-lg">
                {title}
            </h3>

            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                {description}
            </p>

            {actionLabel && actionLink && (
                <Button asChild variant="default" size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <Link href={actionLink}>
                        {actionLabel === "back" ? <MoveLeft className="mr-2 h-4 w-4" /> : null}
                        {actionLabel === "back" ? "Voltar" : actionLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
}
