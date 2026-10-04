type Props = {
  src: string;
  alt: string;
  caption: string;
  eager?: boolean;
  multiply?: boolean;
  className?: string;
  captionClassName?: string;
};

/** Site illustration: natural 3:2, 2px ink border, 4px corners, DM Mono caption. */
export function Illustration({ src, alt, caption, eager, multiply, className = "", captionClassName = "text-muted-foreground" }: Props) {
  return (
    <figure className={`w-full ${className}`}>
      <div className="overflow-hidden rounded-[4px] border-2 border-foreground bg-background">
        <img
          src={src}
          alt={alt}
          width={1536}
          height={1024}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          {...(eager ? { fetchPriority: "high" as const } : {})}
          className="block aspect-[3/2] h-auto w-full object-cover"
          style={multiply ? { mixBlendMode: "multiply" } : undefined}
        />
      </div>
      <figcaption className={`mt-3 font-mono text-[12px] uppercase tracking-[0.14em] ${captionClassName}`}>{caption}</figcaption>
    </figure>
  );
}
