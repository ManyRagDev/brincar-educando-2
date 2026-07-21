import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ShoppingBag } from "lucide-react";

interface ProductEmbedProps {
  title: string;
  description?: string;
  image?: string;
  price?: string;
  href: string;
  store?: string;
}

export default function ProductEmbed({
  title,
  description,
  image,
  price,
  href,
  store = "Loja",
}: ProductEmbedProps) {
  return (
    <div className="my-8 card-theme overflow-hidden">
      <div className="flex gap-4 p-4">
        {image && (
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--color-muted)]">
            <Image
              src={image}
              alt={title}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-secondary)] flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" /> {store}
            </p>
            {price && (
              <span className="text-sm font-bold text-[var(--color-primary)]">
                {price}
              </span>
            )}
          </div>
          <h4 className="font-bold text-base text-[var(--color-foreground)] mb-1 line-clamp-2">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-2 mb-3">
              {description}
            </p>
          )}
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
          >
            Ver produto <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
