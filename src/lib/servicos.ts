// Uma página por serviço: o Google ranqueia página, não site. Cada uma responde a uma busca
// ("criação de sites", "landing page", "sistema web") com conteúdo próprio, não com o texto da home trocado.
import { estimateMessage } from "./whatsapp";

export type Servico = {
  slug: string;
  nome: string;
  /** <title> da página, com o termo que as pessoas buscam. */
  titulo: string;
  descricao: string;
  h1: string;
  intro: string;
  prazo: string;
  paraQuem: string;
  incluso: { titulo: string; texto: string }[];
  /** Categorias de projeto (src/lib/projetos.ts) que servem de exemplo deste serviço. */
  categoriasProjeto: string[];
  faq: { q: string; a: string }[];
  mensagem: string;
};

export const servicos: Servico[] = [
  {
    slug: "criacao-de-sites",
    nome: "Criação de sites",
    titulo: "Criação de Sites Institucionais Sob Medida | Morph Code",
    descricao:
      "Criação de site institucional sob medida para pequenos negócios: aparece no Google, recebe orçamento pelo WhatsApp e fica no ar em cerca de 7 dias.",
    h1: "Criação de sites para o cliente achar você no Google e chamar no WhatsApp",
    intro:
      "Um site institucional com a cara do seu negócio, feito para quem procura o seu serviço na região. Domínio, hospedagem e publicação inclusos, e você fala direto com quem faz.",
    prazo: "Cerca de 7 dias",
    paraQuem: "Oficinas, estéticas, clínicas, lojas e prestadores de serviço que recebem pedidos pelo WhatsApp.",
    incluso: [
      { titulo: "WhatsApp em todas as páginas", texto: "O cliente aperta um botão e já cai na sua conversa, sem formulário." },
      { titulo: "SEO local", texto: "Título, textos e dados da empresa organizados para aparecer para quem busca o seu serviço na sua cidade." },
      { titulo: "Feito primeiro para o celular", texto: "Rápido e fácil de usar na tela onde o seu cliente está." },
      { titulo: "Design da sua marca", texto: "Sem template pronto. Cores, fotos e textos do seu negócio." },
      { titulo: "Domínio e publicação", texto: "Cuidamos do endereço .com.br, da hospedagem e de colocar o site no ar." },
      { titulo: "Suporte depois da entrega", texto: "Você segue falando com quem fez para ajustes e evoluções." },
    ],
    categoriasProjeto: ["Site institucional"],
    faq: [
      {
        q: "Quanto custa criar um site?",
        a: "Depende do número de páginas, dos textos e das fotos. Você conta o seu negócio pelo WhatsApp e recebe valor e prazo antes de fechar, sem compromisso.",
      },
      {
        q: "Em quanto tempo o site fica pronto?",
        a: "Um site institucional fica no ar em cerca de 7 dias. O prazo exato é combinado no início do projeto.",
      },
      {
        q: "Preciso já ter domínio e hospedagem?",
        a: "Não. Cuidamos do domínio, da hospedagem e da publicação. Se você já tem um domínio, usamos o seu.",
      },
      {
        q: "O site aparece no Google?",
        a: "O site é entregue com a estrutura que o Google lê: títulos, descrição, dados da empresa e mapa do site. A posição depende também da concorrência e do seu Perfil da Empresa no Google.",
      },
      {
        q: "Posso pedir alterações depois que o site estiver no ar?",
        a: "Sim. Depois da entrega há período de suporte e planos de manutenção para ajustes e evoluções.",
      },
    ],
    mensagem: estimateMessage("site institucional"),
  },
  {
    slug: "landing-page",
    nome: "Landing page",
    titulo: "Criação de Landing Page para Vender pelo WhatsApp | Morph Code",
    descricao:
      "Landing page sob medida para anúncios e link da bio: uma página focada em uma oferta, com botão de WhatsApp, rápida no celular e no ar em cerca de 7 dias.",
    h1: "Landing page para transformar visita em pedido de orçamento",
    intro:
      "Uma página só, focada em uma oferta, para quem chega por anúncio do Google ou do Instagram ou pelo link da bio. Cada parte leva ao mesmo lugar: a conversa no seu WhatsApp.",
    prazo: "Cerca de 7 dias",
    paraQuem: "Quem anuncia um produto ou serviço e quer que o clique vire conversa, não visita perdida.",
    incluso: [
      { titulo: "Uma oferta, uma ação", texto: "Sem menu que distrai: benefícios, prova e oferta, em ordem, até o botão de WhatsApp." },
      { titulo: "Pronta para anúncio", texto: "Página leve, rápida no celular e com endereço próprio para usar no Google Ads e no Instagram." },
      { titulo: "Depoimentos e prova", texto: "Espaço para fotos, resultados e o que os seus clientes dizem." },
      { titulo: "Design da sua marca", texto: "Sem template pronto. Cores, fotos e textos do seu produto." },
      { titulo: "Domínio e publicação", texto: "Cuidamos do endereço, da hospedagem e de colocar a página no ar." },
      { titulo: "Ajustes depois do anúncio", texto: "Os primeiros resultados mostram o que mudar; você fala direto com quem fez." },
    ],
    categoriasProjeto: ["Landing page"],
    faq: [
      {
        q: "Qual a diferença entre site e landing page?",
        a: "O site apresenta o negócio inteiro, com várias páginas. A landing page é uma página só, sobre uma oferta, feita para quem chega por anúncio ou link e já está pronto para pedir.",
      },
      {
        q: "Quanto custa uma landing page?",
        a: "Depende das seções, dos textos e das fotos. Você conta a oferta pelo WhatsApp e recebe valor e prazo antes de fechar, sem compromisso.",
      },
      {
        q: "Em quanto tempo a landing page fica pronta?",
        a: "Cerca de 7 dias. O prazo exato é combinado no início do projeto.",
      },
      {
        q: "Serve para anúncio no Google e no Instagram?",
        a: "Sim. É o uso mais comum: a página tem endereço próprio para colocar no anúncio ou na bio, e o botão leva direto ao seu WhatsApp.",
      },
    ],
    mensagem: estimateMessage("landing page"),
  },
  {
    slug: "sistemas-web",
    nome: "Sistemas web",
    titulo: "Sistema Web Sob Medida para Pequenas Empresas | Morph Code",
    descricao:
      "Sistema web sob medida para tirar a empresa do papel e da planilha: ordens de serviço, agenda, cadastro de clientes e painel de gestão. Pronto em 2 a 3 semanas.",
    h1: "Sistema web sob medida para tirar o seu negócio do papel e da planilha",
    intro:
      "Ordens de serviço, agenda, cadastro de clientes, histórico e painel de gestão, do jeito que a sua equipe já trabalha. Funciona no navegador, no computador e no celular.",
    prazo: "2 a 3 semanas",
    paraQuem: "Oficinas, clínicas e empresas que controlam atendimento, agenda ou estoque no papel, no caderno ou em planilhas soltas.",
    incluso: [
      { titulo: "Feito para o seu processo", texto: "Telas e campos pensados para a rotina da sua equipe, não um sistema genérico para adaptar." },
      { titulo: "Tudo em um lugar", texto: "Entrada de clientes, orçamentos, status e histórico, sem procurar em papel ou planilha." },
      { titulo: "Acesso com login", texto: "Cada pessoa entra com a própria conta, no computador ou no celular." },
      { titulo: "Painel de gestão", texto: "Números do dia e do mês na primeira tela." },
      { titulo: "Hospedagem inclusa", texto: "Cuidamos do servidor e da publicação. Você só abre e usa." },
      { titulo: "Evolui com o negócio", texto: "Novas telas e funções conforme a empresa precisa, falando direto com quem fez." },
    ],
    categoriasProjeto: ["Sistema sob medida", "Aplicativo web"],
    faq: [
      {
        q: "Quanto custa um sistema sob medida?",
        a: "Depende das telas, das funções e das integrações. Você conta como o seu negócio funciona hoje pelo WhatsApp e recebe valor e prazo antes de fechar, sem compromisso.",
      },
      {
        q: "Em quanto tempo o sistema fica pronto?",
        a: "Em média de 2 a 3 semanas, conforme as funções e integrações. O prazo exato é combinado no início do projeto.",
      },
      {
        q: "Funciona no celular?",
        a: "Sim. O sistema roda no navegador, então abre no computador, no tablet e no celular.",
      },
      {
        q: "Vocês têm algum sistema pronto?",
        a: "Sim, o Morph Clínica, para clínicas de estética: ficha de anamnese assinada no celular, prontuário, agenda com lembretes pelo WhatsApp e LGPD.",
      },
    ],
    mensagem: estimateMessage("sistema sob medida"),
  },
];

export function servico(slug: string) {
  const s = servicos.find((s) => s.slug === slug);
  if (!s) throw new Error(`Serviço desconhecido: ${slug}`);
  return s;
}
