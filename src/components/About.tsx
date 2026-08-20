import Reveal from "./Reveal";

const items = [
  {
    n: "01",
    title: "Código que gera resultado",
    text: "Cada projeto é construído com foco em performance, conversão e retorno real para o seu negócio.",
  },
  {
    n: "02",
    title: "Comunicação direta",
    text: "Sem intermediários. Você fala direto com quem desenvolve, do briefing à entrega.",
  },
  {
    n: "03",
    title: "Design + tecnologia",
    text: "Interfaces modernas aliadas a uma base técnica sólida, escalável e segura.",
  },
  {
    n: "04",
    title: "Suporte contínuo",
    text: "Acompanhamento após a entrega para ajustes, evolução e novas funcionalidades.",
  },
];

export default function About() {
  return (
    <section id="sobre" className="section-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4">Sobre a Morph Code</p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl leading-tight">
              Grandes negócios não nascem prontos. Eles são construídos com tecnologia.
            </h2>
            <p className="mt-5 text-muted max-w-md">
              Somos uma empresa de desenvolvimento web focada em ajudar negócios a saírem do
              papel — ou do improviso — com sites e sistemas que realmente funcionam.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <p className="font-[var(--font-display)] text-3xl text-gold/25 mb-2">{item.n}</p>
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
