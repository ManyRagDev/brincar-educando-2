import { Suspense } from "react";
import { ActivitySearch } from "@/components/journey/ActivitySearch";
import { ActivityGrid } from "@/components/journey/ActivityGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Biblioteca de Brincadeiras | Brincar Educando",
    description: "Encontre atividades educativas e divertidas para seu filho. Filtre por idade, energia e tipo de desenvolvimento.",
};

export default function AtividadesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Header */}
            <section className="relative pt-24 pb-12 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10" />

                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Biblioteca de <span className="text-primary">Brincadeiras</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore nossa coleção de atividades para despertar a criatividade,
                        gastar energia e criar momentos inesquecíveis.
                    </p>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="px-6 pb-8 sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b">
                <ActivitySearch />
            </section>

            {/* Results Grid */}
            <section className="container mx-auto px-6 py-8">
                <Suspense fallback={
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-[300px] w-full bg-muted/20 rounded-xl animate-pulse" />
                        ))}
                    </div>
                }>
                    <ActivityGrid searchParams={searchParams} />
                </Suspense>
            </section>
        </main>
    );
}
