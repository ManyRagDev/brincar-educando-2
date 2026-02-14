"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NextImage from "next/image";

const coresFavoritas = [
    { value: "rosa", label: "Rosa", color: "bg-pink-400" },
    { value: "azul", label: "Azul", color: "bg-blue-400" },
    { value: "verde", label: "Verde", color: "bg-green-400" },
    { value: "amarelo", label: "Amarelo", color: "bg-yellow-400" },
    { value: "roxo", label: "Roxo", color: "bg-purple-400" },
    { value: "laranja", label: "Laranja", color: "bg-orange-400" },
];

const interessesOpcoes = [
    "Animais", "Música", "Natureza", "Esportes", "Arte",
    "Ciência", "Dinossauros", "Carros", "Princesas", "Super-heróis"
];

const avataresPremium = [
    { id: "boy", src: "/images/avatars/boy.png", label: "Menino" },
    { id: "girl", src: "/images/avatars/girl.png", label: "Menina" },
    { id: "star", src: "/images/avatars/star.png", label: "Estrela" },
    { id: "fox", src: "/images/avatars/fox.png", label: "Raposa" },
    { id: "dino", src: "/images/avatars/dino.png", label: "Dino" },
    { id: "boy2", src: "/images/avatars/boy2.png", label: "Aventureiro" },
];

interface PerfilCriancaFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export function PerfilCriancaForm({ initialData, isEditing = false }: PerfilCriancaFormProps) {
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState(initialData?.nome || "");
    const [dataNascimento, setDataNascimento] = useState(initialData?.data_nascimento || "");
    const [genero, setGenero] = useState(initialData?.genero || "");
    const [corFavorita, setCorFavorita] = useState(initialData?.cor_favorita || "azul");
    const [interesses, setInteresses] = useState<string[]>(initialData?.interesses || []);
    const [avatarId, setAvatarId] = useState(initialData?.avatar_id || "boy");

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        if (initialData) {
            setNome(initialData.nome || "");
            setDataNascimento(initialData.data_nascimento || "");
            setGenero(initialData.genero || "");
            setCorFavorita(initialData.cor_favorita || "azul");
            setInteresses(initialData.interesses || []);
            setAvatarId(initialData.avatar_id || "boy");
        }
    }, [initialData]);

    const handleInteresseToggle = (interesse: string) => {
        setInteresses(prev =>
            prev.includes(interesse)
                ? prev.filter(i => i !== interesse)
                : [...prev, interesse]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing && initialData?.id) {
                const { error } = await supabase
                    .from("criancas")
                    .update({
                        nome,
                        data_nascimento: dataNascimento,
                        genero,
                        cor_favorita: corFavorita,
                        interesses,
                        avatar_id: avatarId
                    })
                    .eq("id", initialData.id);

                if (error) throw error;
                toast.success("Perfil atualizado! ✨");
            } else {
                const { data, error } = await supabase.rpc("upsert_child_with_profile", {
                    p_nome: nome,
                    p_data_nascimento: dataNascimento,
                    p_genero: genero,
                    p_cor_favorita: corFavorita,
                    p_interesses: interesses,
                    p_avatar_id: avatarId
                });

                if (error) throw error;
                toast.success("Perfil da criança criado! ✨");
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar perfil");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                {/* Avatar Selection */}
                <div className="space-y-4">
                    <Label className="text-center block text-xl font-black text-[var(--color-primary)]">
                        Escolha um Avatar 3D Mágico ✨
                    </Label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {avataresPremium.map((avatar) => (
                            <button
                                key={avatar.id}
                                type="button"
                                onClick={() => setAvatarId(avatar.id)}
                                className={cn(
                                    "relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 border-4",
                                    avatarId === avatar.id
                                        ? "border-[var(--color-primary)] scale-110 shadow-xl"
                                        : "border-white bg-[var(--color-muted)]/50 opacity-60 hover:opacity-100"
                                )}
                            >
                                <NextImage
                                    src={avatar.src}
                                    alt={avatar.label}
                                    fill
                                    className="object-contain p-1"
                                />
                                {avatarId === avatar.id && (
                                    <div className="absolute inset-0 bg-[var(--color-primary)]/10" />
                                )}
                            </button>
                        ))}
                    </div>
                    <p className="text-center text-xs text-[var(--color-muted-foreground)] font-medium">
                        Arraste para o lado se estiver no celular para ver todos!
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Criança</Label>
                    <Input
                        id="nome"
                        placeholder="Ex: Maria"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className="bg-[var(--color-input)] h-12 text-lg font-medium"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="nascimento">Data de Nascimento</Label>
                        <Input
                            id="nascimento"
                            type="date"
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            required
                            className="bg-[var(--color-input)] h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Gênero</Label>
                        <Select value={genero} onValueChange={setGenero} required>
                            <SelectTrigger className="bg-[var(--color-input)] h-12">
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="menino">Menino</SelectItem>
                                <SelectItem value="menina">Menina</SelectItem>
                                <SelectItem value="neutro">Prefiro não informar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>Cor Favorita</Label>
                    <RadioGroup
                        value={corFavorita}
                        onValueChange={setCorFavorita}
                        className="flex flex-wrap gap-4"
                    >
                        {coresFavoritas.map((c) => (
                            <div key={c.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={c.value} id={`color-${c.value}`} className="sr-only" />
                                <Label
                                    htmlFor={`color-${c.value}`}
                                    className={cn(
                                        "w-12 h-12 rounded-full cursor-pointer border-4 transition-all hover:scale-110 shadow-sm",
                                        c.color,
                                        corFavorita === c.value ? "border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/20" : "border-white"
                                    )}
                                />
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-3">
                    <Label>Interesses (selecione o que ela mais gosta)</Label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 bg-[var(--color-muted)]/20 p-5 rounded-3xl border-2 border-dashed border-[var(--color-border)]">
                        {interessesOpcoes.map((item) => (
                            <div key={item} className="flex items-center space-x-2 group">
                                <Checkbox
                                    id={item}
                                    checked={interesses.includes(item)}
                                    onCheckedChange={() => handleInteresseToggle(item)}
                                    className="rounded-md"
                                />
                                <label
                                    htmlFor={item}
                                    className="text-sm font-bold text-[var(--color-foreground)] leading-none cursor-pointer group-hover:text-[var(--color-primary)] transition-colors"
                                >
                                    {item}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full btn-primary-theme gap-2 h-16 text-xl font-black rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-6 h-6" />}
                {isEditing ? "Salvar Alterações ✨" : "Criar Perfil Mágico ✨"}
            </Button>
        </form>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
