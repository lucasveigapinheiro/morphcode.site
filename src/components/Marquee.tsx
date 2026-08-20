export default function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-border py-4 bg-surface/40">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-10">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-10 shrink-0">
            <span className="text-sm tracking-wide text-muted whitespace-nowrap">{item}</span>
            <span className="text-gold text-sm">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
