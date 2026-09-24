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
    preco: "R$ 109/mês",
    detalhe: "+ implantação de R$ 497 (paga uma vez)",
    cta: "Quero o plano mensal",
    itens: ["Hospedagem e backup", "Suporte e atualizações inclusos", "Sem fidelidade: aviso de 30 dias", "Após 36 meses, vira licença"],
    destaque: false,
  },
  {
    id: "licenca",
    nome: "Licença vitalícia",
    preco: "R$ 2.700",
    detalhe: "à vista ou em 3x · depois R$ 69/mês de hospedagem",
    cta: "Quero a licença",
    itens: ["Implantação e personalização", "12 meses de hospedagem e suporte", "Licença de uso sem prazo", "Menor custo no longo prazo"],
    destaque: true,
  },
];

export const passosImplantacao = [
  { titulo: "Conversa", texto: "Entendemos seus serviços, sua ficha e sua rotina." },
  { titulo: "Configuração", texto: "Sua marca, cores, serviços e perguntas no sistema." },
  { titulo: "Treinamento", texto: "1 hora com você e a equipe, no computador e no celular." },
  { titulo: "Em uso", texto: "Primeiras pacientes com a ficha digital e suporte pelo WhatsApp." },
];

export const faqClinica = [
  {
    q: "Preciso instalar alguma coisa?",
    a: "Não. O sistema abre no navegador do computador, do tablet e do celular. A paciente também não instala nada: recebe um link pelo WhatsApp e preenche a ficha no próprio celular.",
  },
  {
    q: "A ficha assinada no celular tem valor?",
    a: "Cada ficha guarda a assinatura, a data, a hora e uma cópia exata dos termos e das perguntas que a paciente viu, com um código de verificação. Os textos jurídicos são ajustáveis e devem ser revisados pela assessoria da clínica.",
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
    q: "O que é a licença vitalícia?",
    a: "Você paga R$ 2.700 uma vez (à vista ou em 3x de R$ 900) e ganha o direito de usar o sistema sem prazo, com 12 meses de hospedagem inclusos. Depois, fica só a hospedagem de R$ 69/mês, que mantém o sistema no ar com backup, suporte e atualizações. O sistema continua sendo da Morph Code: a licença é o direito de uso.",
  },
  {
    q: "E se eu atrasar a hospedagem da licença?",
    a: "O sistema fica suspenso e volta exatamente como estava quando o pagamento é feito, sem precisar comprar a licença de novo. Seus dados continuam guardados e você pode pedir o backup completo a qualquer momento.",
  },
  {
    q: "O plano mensal vira licença?",
    a: "Sim. Depois de 36 mensalidades pagas, a clínica ganha a licença vitalícia e passa a pagar só a hospedagem de R$ 69/mês.",
  },
  {
    q: "Os lembretes de consulta são automáticos?",
    a: "O sistema mostra quem precisa ser lembrada amanhã e abre o WhatsApp com a mensagem pronta, em um toque. O envio totalmente automático pode ser contratado à parte, pela API oficial do WhatsApp.",
  },
];
