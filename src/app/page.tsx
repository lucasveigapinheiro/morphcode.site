import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Projects from "@/components/Projects";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Marquee from "@/components/Marquee";
import TechStack from "@/components/TechStack";

const strip = ["Sites", "Sistemas", "Automação", "Design", "Performance", "Suporte"];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee items={strip} />
        <About />
        <TechStack />
        <Projects />
        <Services />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
