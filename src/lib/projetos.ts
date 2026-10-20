// Sites e sistemas no ar. Fica fora dos componentes para as páginas de serviço também listarem.
export type Project = {
  title: string;
  category: string;
  description: string;
  href: string;
  image: string;
  techs: string[];
};

export const projects: Project[] = [
  {
    title: "2B Estética Automotiva",
    category: "Site institucional",
    description:
      "Estética automotiva da Zona Norte de São Paulo. Orçamento direto pelo WhatsApp, domínio próprio e SEO local para aparecer para quem busca na região.",
    href: "https://2bestéticaautomotiva.com.br/",
    image: "/projects/2b-estetica.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "GMG Equilíbrio",
    category: "Landing page",
    description: "Landing page de vendas para suplemento em cápsulas, com ativos, benefícios, depoimentos e oferta.",
    href: "https://gmg-site-beta.vercel.app/",
    image: "/projects/gmg-site.jpg",
    techs: ["HTML5", "Tailwind CSS", "JavaScript"],
  },
  {
    title: "Mecânica Rossi",
    category: "Site institucional",
    description: "Vitrine digital da oficina, com identidade visual própria e um botão de WhatsApp que leva direto ao orçamento.",
    href: "https://lucasveigapinheiro.github.io/MecanicaRossi/",
    image: "/projects/mecanica-rossi.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Sistema de Ordens de Serviço",
    category: "Sistema sob medida",
    description:
      "Uma oficina que controlava tudo no papel. Agora entrada de veículos, orçamentos, status de reparo e histórico de clientes ficam em um só lugar.",
    href: "https://lucasveigapinheiro.github.io/sistemaos/",
    image: "/projects/sistema-os.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Morph Clínica (Gestão para Clínicas)",
    category: "SaaS / Sistema sob medida",
    description: "Plataforma clínica completa: anamnese assinada no celular, controle de estoque com FEFO e validades, financeiro com taxas de maquininha e novo estilo caderno de bem-estar.",
    href: "/clinicas",
    image: "/projects/labessie.jpg",
    techs: ["Next.js", "Node.js", "Turso LibSQL", "Tailwind CSS"],
  },
  {
    title: "Orçamento Pessoal",
    category: "Aplicativo web",
    description: "Uma planilha de gastos que virou aplicativo web, com login, receitas, despesas e saldo mês a mês salvos automaticamente.",
    href: "https://lucasveigapinheiro.github.io/planilha-de-gastos",
    image: "/projects/orcamento-pessoal-v2.jpg",
    techs: ["HTML5", "Tailwind CSS", "JavaScript"],
  },
];
