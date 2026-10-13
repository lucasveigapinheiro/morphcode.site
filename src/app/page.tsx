import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import ProdutoDestaque from "@/components/clinica/ProdutoDestaque";
import Contact from "@/components/Contact";
import WhatsAppFloat from "@/components/WhatsAppFloat";

// Ordem: promessa, Morph Clínica, prova (sites no ar), o que vem incluso, como funciona,
// objeções e o pedido final.
export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo" className="pb-20 md:pb-0">
        <Hero />
        <ProdutoDestaque />
        <Projects />
        <Services />
        <Process />
        <Faq />
        <Contact />
      </main>
      <WhatsAppFloat />
    </>
  );
}
