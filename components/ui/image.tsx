import NextImage from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function Image({ src, alt, caption, className }: ImageProps) {
  return (
    <figure className="my-8">
      <div className={`relative w-full overflow-hidden rounded-xl ${className ?? ""}`}>
        <NextImage
          src={src}
          alt={alt}
          width={800}
          height={450}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-[var(--color-muted-foreground)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
