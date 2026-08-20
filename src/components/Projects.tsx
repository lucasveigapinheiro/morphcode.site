export type Project = {
  title: string;
  category: string;
  image?: string;
  href?: string;
};

// Adicione seus projetos reais aqui — a estrutura já está pronta para receber imagem, título, categoria e link.
export const projects: Project[] = [];

export default function Projects() {
  return (
    <section id="projetos" className="section-border py-24 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4">Projetos</p>
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl max-w-xl">
          Alguns trabalhos que já colocamos no ar
        </h2>

        {projects.length === 0 ? (
          <div className="mt-14 rounded-2xl border border-dashed border-border p-16 text-center">
            <p className="text-muted text-sm">
              Em breve, projetos reais entregues pela Morph Code aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <a
                key={p.title}
                href={p.href ?? "#"}
                target={p.href ? "_blank" : undefined}
                rel={p.href ? "noopener noreferrer" : undefined}
                className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-gold/50 transition-colors"
              >
                <div className="aspect-video bg-surface-2" />
                <div className="p-5">
                  <p className="text-xs text-gold uppercase tracking-wide">{p.category}</p>
                  <h3 className="mt-1 font-medium">{p.title}</h3>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
