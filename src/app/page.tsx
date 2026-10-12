import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Faq from "@/components/Faq";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Marquee from "@/components/Marquee";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ProdutoDestaque from "@/components/clinica/ProdutoDestaque";

const strip = ["Sites", "Sistemas", "Design", "SEO", "Performance", "Suporte"];

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo" className="pb-20 md:pb-0">
        <Hero />
        <Marquee items={strip} />
        <ProdutoDestaque />
        <Projects />
        <Services />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <WhatsAppFloat />
    </>
  );
}
