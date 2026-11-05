// Conteúdo do produto Morph Clínica (sistema para clínicas de estética).
// Planos e textos seguem a apresentação comercial.

export const PRODUTO = "Morph Clínica";

export const APRESENTACAO_PDF = "/clinicas/apresentacao-morph-clinica.pdf";

// Sistema de demonstração: clínica e pacientes fictícios, login público.
export const DEMO = {
  url: "https://morph-clinica-demo.vercel.app/pages/login.html",
  usuario: "demo",
  senha: "BellaDemo2026",
};

export type Tela = { src: string; alt: string; width: number; height: number };

export const telas = {
  painel: { src: "/clinicas/telas/dashboard.png", alt: "Painel inicial do sistema com a identidade da clínica", width: 1406, height: 749 },
  pacientesNovo: { src: "/clinicas/telas/pacientes-novo.png", alt: "Lista de pacientes com ficha assinada, alertas de saúde e atalho para convênios", width: 2160, height: 1350 },
  estoque: { src: "/clinicas/telas/estoque.png", alt: "Estoque por lote e validade com alertas de reposição e vencimento", width: 2160, height: 1350 },
  financeiro: { src: "/clinicas/telas/financeiro.png", alt: "Financeiro com lançamentos de cartão parcelado, valores a receber e atrasados", width: 2160, height: 1350 },
  relatorio: { src: "/clinicas/telas/relatorio.png", alt: "Relatório de pacientes com procedimentos mais procurados e fichas assinadas", width: 2160, height: 1350 },
  pacientes: { src: "/clinicas/telas/pacientes.png", alt: "Lista de pacientes com status da ficha e do consentimento", width: 1406, height: 749 },
  agenda: { src: "/clinicas/telas/agenda.png", alt: "Agenda com calendário e horários do dia", width: 1406, height: 748 },
  cores: { src: "/clinicas/telas/cores.png", alt: "Configurações de cores e letras da clínica", width: 1100, height: 500 },
  editorFicha: { src: "/clinicas/telas/editor-ficha.png", alt: "Editor das perguntas da ficha de anamnese", width: 1000, height: 640 },
  alertas: { src: "/clinicas/telas/alertas.png", alt: "Prontuário com alerta de alergia em destaque", width: 1030, height: 600 },
  evolucao: { src: "/clinicas/telas/evolucao.png", alt: "Assinatura da ficha e evolução do atendimento com produto e lote", width: 1030, height: 460 },
  fichaCelular: { src: "/clinicas/telas/ficha-celular.png", alt: "Ficha de anamnese aberta no celular da paciente", width: 484, height: 749 },
  saudeCelular: { src: "/clinicas/telas/saude-celular.png", alt: "Perguntas de saúde respondidas no celular", width: 484, height: 749 },
  assinatura: { src: "/clinicas/telas/assinatura.png", alt: "Assinatura da paciente com o dedo", width: 484, height: 459 },
} satisfies Record<string, Tela>;

// O slide 12 traz um depoimento fictício, identificado como tal no próprio slide.
export const slides = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => ({
  src: `/clinicas/slides/slide-${String(n).padStart(2, "0")}.jpg`,
  alt: `Slide ${n} da apresentação do ${PRODUTO}`,
}));

export type Plano = {
  id: string;
  nome: string;
  preco: string;
  detalhe: string;
  cta: string;
  itens: string[];
  destaque: boolean;
};

export const planos: Plano[] = [
  {
    id: "mensal",
    nome: "Plano mensal",
    preco: "R$ 149/mês",
    detalhe: "+ implantação de R$ 497 (paga uma vez)",
    cta: "Quero o plano mensal",
    itens: [
      "Prontuário com ficha digital no celular",
      "Estoque FEFO e Financeiro inclusos",
      "Hospedagem, backup e suporte inclusos",
      "Sem fidelidade: aviso de 30 dias",
      "Após 48 meses, vira licença",
    ],
    destaque: false,
  },
  {
    id: "licenca",
    nome: "Licença vitalícia",
    preco: "R$ 2.700",
    detalhe: "à vista ou em 3x · depois R$ 97/mês de hospedagem",
    cta: "Quero a licença",
    itens: [
      "Implantação e personalização da marca",
      "Todos os módulos: Anamnese, Estoque e Financeiro",
      "12 meses de hospedagem e suporte",
      "Licença de uso sem prazo de validade",
      "Menor custo no longo prazo",
    ],
    destaque: true,
  },
];

// Passo a passo para instalar o sistema como aplicativo (PWA).
export const passosInstalarApp = [
  {
    id: "iphone",
    titulo: "iPhone e iPad",
    passos: [
      "Abra o link do sistema no Safari.",
      "Toque em Compartilhar (o quadrado com a seta para cima).",
      "Role a lista e toque em “Adicionar à Tela de Início”.",
      "Toque em “Adicionar”. O ícone da clínica aparece na tela inicial.",
    ],
  },
  {
    id: "android",
    titulo: "Android",
    passos: [
      "Abra o link do sistema no Chrome.",
      "Toque em “Instalar aplicativo” no aviso que aparece, ou abra o menu ⋮.",
      "No menu, toque em “Instalar aplicativo” ou “Adicionar à tela inicial”.",
      "Confirme em “Instalar”. O ícone da clínica aparece junto com os outros apps.",
    ],
  },
  {
    id: "computador",
    titulo: "Computador",
    passos: [
      "Abra o sistema no Chrome ou no Edge e faça login.",
      "Clique no ícone de instalar, no canto direito da barra de endereço.",
      "Ou, dentro do sistema, vá em Configurações e clique em “Instalar aplicativo”.",
      "Pronto: o sistema abre em janela própria, pelo menu Iniciar ou pela barra de tarefas.",
    ],
  },
];

export const faqClinica = [
  {
    q: "Preciso instalar alguma coisa?",
    a: "Não. O sistema abre no navegador do computador, do tablet e do celular, e pode virar aplicativo com a marca da clínica em poucos toques, sem loja de aplicativos. A paciente não instala nada: recebe um link pelo WhatsApp e preenche a ficha no próprio celular.",
  },
  {
    q: "A ficha assinada no celular tem valor?",
    a: "Cada ficha guarda a assinatura, a data, a hora e uma cópia exata dos termos e das perguntas que a paciente viu, com um código de verificação. Os textos jurídicos são ajustáveis e devem ser revisados pela assessoria da clínica.",
  },
  {
    q: "Como funciona o estoque?",
    a: "Os insumos ficam organizados por lote e validade. Ao registrar o atendimento, a baixa sai do lote que vence primeiro. Lote vencido não pode ser usado e exige descarte com motivo. Você define mínimo e ideal de cada produto e o sistema mostra o que precisa comprar.",
  },
  {
    q: "O financeiro calcula as taxas da maquininha?",
    a: "Sim. Você cadastra as taxas de débito e de crédito (à vista e parcelado) e o sistema mostra o valor líquido de cada recebimento. Cartão parcelado entra parcela a parcela, no mês em que cai. Também dá para registrar sinal no agendamento e desconto por convênio.",
  },
  {
    q: "Posso usar as perguntas da minha ficha de papel?",
    a: "Sim. Na implantação passamos a sua ficha para o sistema e, depois, você mesma cria, edita ou remove perguntas na tela de configurações.",
  },
  {
    q: "E se eu quiser sair?",
    a: "No plano mensal não há fidelidade: é só avisar com 30 dias, e o acesso vai até o fim do último mês pago. Seus dados são seus e você recebe uma cópia completa de tudo, incluindo fichas assinadas e fotos.",
  },
  {
    q: "Como funciona a oferta de fim de ano?",
    a: "Quem fechar até 23 de dezembro paga 50% a menos na taxa de implantação do plano mensal (R$ 248,50 em vez de R$ 497) ou leva a licença vitalícia por R$ 2.000 em vez de R$ 2.700. O restante de cada plano segue igual.",
  },
];
