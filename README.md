# Morph Code — Site profissional

Site da Morph Code, meu estúdio de desenvolvimento web para pequenos negócios. Apresenta serviços, projetos entregues, depoimentos e um orçamento rápido que leva o cliente direto ao WhatsApp.

🔗 **No ar:** [morphcodesite.vercel.app](https://morphcodesite.vercel.app)

## Destaques técnicos

- **Next.js (App Router)** com React 19 e TypeScript
- **16 componentes reutilizáveis** (Hero, Serviços, Projetos, Stack, Depoimentos, FAQ, Contato e outros)
- **Calculadora de orçamento** que monta a mensagem e abre o WhatsApp com o pedido pronto
- **Animações** com Motion: revelação no scroll, botões magnéticos, contador animado, letreiro e brilho que segue o cursor
- **Imagem Open Graph gerada dinamicamente** (`opengraph-image.tsx`) para compartilhamento em redes sociais
- Estilização com **Tailwind CSS v4**, layout responsivo mobile-first
- Qualidade de código com **ESLint**
- **Deploy contínuo na Vercel** a cada push

## Tecnologias

Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · Motion · React Icons · ESLint · Vercel

## Como rodar

```bash
npm install
npm run dev     # ambiente de desenvolvimento em http://localhost:3000
npm run build   # build de produção
npm run lint    # análise estática
```

## Estrutura

```
src/
  app/          # layout, página principal, ícone e imagem Open Graph
  components/   # componentes da página
  lib/          # utilitários (mensagens do WhatsApp)
public/         # imagens e arquivos estáticos
```

## Autor

Lucas Veiga Pinheiro — [LinkedIn](https://www.linkedin.com/in/lucas-veiga-pinheiro-5001653b0/) · [GitHub](https://github.com/lucasveigapinheiro)
