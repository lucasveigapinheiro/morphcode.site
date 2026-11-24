"use client";

import { useEffect, useRef } from "react";

/** Largura máxima do bloco de texto da hero (max-w-4xl): os objetos ficam nas laterais, fora dele. */
const LARGURA_TEXTO = 896;
/** Altura da faixa onde a cena aparece: só a parte do título, acima da planilha da hero. */
const ALTURA_CENA = 600;

/**
 * Cena 3D da hero do Morph Leads, só em telas a partir de 1280px:
 * pin do Google Maps, planilha com a linha prioritária em destaque e balão de conversa.
 * O three.js é carregado sob demanda, então celular e tablet não baixam a biblioteca.
 * Os objetos são posicionados em pixels nas margens laterais, sem cobrir o texto.
 * Para de renderizar fora da tela e não roda com prefers-reduced-motion.
 */
export default function HeroLeads3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1280px)").matches) return;

    let cancelado = false;
    let limpar: (() => void) | undefined;

    const iniciar = async () => {
      const [THREE, { RoomEnvironment }, { default: gsap }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
        import("gsap"),
      ]);
      if (cancelado) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      const canvas = renderer.domElement;
      canvas.style.cssText = "display:block;width:100%;height:100%;opacity:0";
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, host.clientWidth / Math.max(host.clientHeight, 1), 0.1, 60);
      camera.position.set(0, 0, 9);

      const descartar: { dispose: () => void }[] = [];
      const g = <T extends { dispose: () => void }>(item: T): T => {
        descartar.push(item);
        return item;
      };

      const pmrem = new THREE.PMREMGenerator(renderer);
      const sala = new RoomEnvironment();
      const ambiente = g(pmrem.fromScene(sala, 0.04));
      scene.environment = ambiente.texture;
      sala.dispose();
      pmrem.dispose();

      // Paleta da página: lima, verde-floresta, tinta e branco.
      const lima = g(new THREE.MeshStandardMaterial({ color: 0x9fe870, metalness: 0.35, roughness: 0.28, emissive: 0x2b5910, emissiveIntensity: 0.2 }));
      const floresta = g(new THREE.MeshStandardMaterial({ color: 0x163300, metalness: 0.55, roughness: 0.3 }));
      const tinta = g(new THREE.MeshStandardMaterial({ color: 0x0e0f0c, metalness: 0.5, roughness: 0.35 }));
      const branco = g(new THREE.MeshStandardMaterial({ color: 0xf4f6f2, metalness: 0.15, roughness: 0.32 }));
      const celula = g(new THREE.MeshStandardMaterial({ color: 0xd1d6ce, metalness: 0.2, roughness: 0.4 }));
      type Material = typeof lima;

      // Pin do mapa: gota feita por revolução (cabeça redonda + ponta), com o furo escuro na frente.
      const criarPin = (material: Material) => {
        const r = 0.5;
        const cy = 0.35;
        const perfil = [new THREE.Vector2(0.001, -0.8)];
        for (let i = 0; i <= 24; i++) {
          const a = -Math.PI / 3 + (i / 24) * ((Math.PI * 5) / 6);
          perfil.push(new THREE.Vector2(Math.max(0.001, r * Math.cos(a)), cy + r * Math.sin(a)));
        }
        const grupo = new THREE.Group();
        grupo.add(new THREE.Mesh(g(new THREE.LatheGeometry(perfil, 48)), material));
        const furo = new THREE.Mesh(g(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 32)), material === tinta ? lima : tinta);
        furo.rotation.x = Math.PI / 2;
        furo.position.set(0, cy, r - 0.02);
        grupo.add(furo);
        return grupo;
      };

      // Retângulo arredondado para o balão de conversa, com a ponta no canto inferior esquerdo.
      const formaBalao = (w: number, h: number, r: number) => {
        const s = new THREE.Shape();
        const x = -w / 2;
        const y = -h / 2;
        s.moveTo(x + r, y);
        s.lineTo(x + w - r, y);
        s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r);
        s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h);
        s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r);
        s.lineTo(x - 0.22, y - 0.2);
        s.lineTo(x + r, y);
        return s;
      };

      // 1. Pin grande, lado esquerdo, alto.
      const pin = criarPin(lima);

      // 2. Planilha, lado direito: placa escura, cabeçalho lima e a primeira linha (prioridade alta) acesa.
      const planilha = new THREE.Group();
      planilha.add(new THREE.Mesh(g(new THREE.BoxGeometry(1.9, 1.4, 0.12)), floresta));
      const cabecalho = new THREE.Mesh(g(new THREE.BoxGeometry(1.7, 0.16, 0.05)), lima);
      cabecalho.position.set(0, 0.5, 0.08);
      planilha.add(cabecalho);
      const caixaCelula = g(new THREE.BoxGeometry(0.5, 0.16, 0.04));
      for (let linha = 0; linha < 4; linha++) {
        for (let coluna = 0; coluna < 3; coluna++) {
          const m = new THREE.Mesh(caixaCelula, linha === 0 ? lima : celula);
          m.position.set(-0.57 + coluna * 0.57, 0.24 - linha * 0.25, 0.08);
          if (linha === 0) m.scale.set(1, 1, 1.6);
          planilha.add(m);
        }
      }

      // 3. Balão de conversa, lado esquerdo, embaixo, com três pontos de "digitando".
      const balao = new THREE.Group();
      const geoBalao = g(
        new THREE.ExtrudeGeometry(formaBalao(1.45, 0.9, 0.3), {
          depth: 0.16,
          bevelEnabled: true,
          bevelSize: 0.05,
          bevelThickness: 0.05,
          bevelSegments: 4,
          curveSegments: 16,
        }),
      );
      geoBalao.translate(0, 0, -0.08);
      balao.add(new THREE.Mesh(geoBalao, branco));
      const ponto = g(new THREE.SphereGeometry(0.085, 20, 20));
      const pontos = [-0.32, 0, 0.32].map((x) => {
        const m = new THREE.Mesh(ponto, floresta);
        m.position.set(x, 0, 0.16);
        balao.add(m);
        return m;
      });

      // 4. Pin pequeno escuro, lado direito, alto: mais um negócio no mapa.
      const pinPequeno = criarPin(tinta);

      // Cada peça: lado da tela, altura em fração da faixa, profundidade, escala base e giro base.
      type Peca = { obj: typeof pin; lado: -1 | 1; fy: number; z: number; escala: number; giro: [number, number, number] };
      const pecas: Peca[] = [
        { obj: pin, lado: -1, fy: 0.3, z: 0, escala: 1, giro: [0.05, 0.35, 0.08] },
        { obj: balao, lado: -1, fy: 0.76, z: -0.6, escala: 0.9, giro: [0.12, 0.45, 0.04] },
        { obj: planilha, lado: 1, fy: 0.6, z: -0.4, escala: 0.95, giro: [0.2, -0.5, 0.06] },
        { obj: pinPequeno, lado: 1, fy: 0.2, z: -1.2, escala: 0.55, giro: [0.05, -0.3, -0.1] },
      ];
      pecas.forEach((p) => {
        p.obj.rotation.set(...p.giro);
        p.obj.scale.setScalar(0.0001);
        scene.add(p.obj);
      });
      const base = pecas.map(() => ({ x: 0, y: 0, s: 1 }));

      const posicionar = () => {
        const w = host.clientWidth;
        const h = Math.max(host.clientHeight, 1);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        // Centro da margem lateral livre, ao lado do texto; a escala acompanha a largura dessa margem.
        const margem = Math.max(0, (w - LARGURA_TEXTO) / 2);
        const fator = Math.min(1.2, Math.max(0.65, margem / 260));
        pecas.forEach((p, i) => {
          const meiaAltura = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (camera.position.z - p.z);
          const meiaLargura = meiaAltura * camera.aspect;
          const px = p.lado < 0 ? margem / 2 : w - margem / 2;
          base[i].x = (px / w - 0.5) * 2 * meiaLargura;
          base[i].y = -(p.fy - 0.5) * 2 * meiaAltura;
          base[i].s = p.escala * fator;
        });
      };
      posicionar();
      const ro = new ResizeObserver(posicionar);
      ro.observe(host);

      // Entrada: cada peça cresce do zero, em sequência, e o canvas aparece junto.
      const entrada = { t: 0 };
      const molaEntrada = gsap.parseEase("back.out(1.6)");
      gsap.to(canvas, { opacity: 0.95, duration: 0.6, ease: "power2.out" });
      gsap.to(entrada, { t: 1, duration: 1.4, ease: "none" });
      const crescer = (i: number) => molaEntrada(Math.min(1, Math.max(0, entrada.t * 1.6 - i * 0.18)));

      const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
      const onPointerMove = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      let visivel = true;
      const io = new IntersectionObserver(([entry]) => (visivel = entry.isIntersecting), { threshold: 0.01 });
      io.observe(host);

      const inicio = performance.now();
      const quadro = () => {
        if (!visivel || document.hidden) return;
        const t = (performance.now() - inicio) * 0.001;
        mouse.cx += (mouse.tx - mouse.cx) * 0.05;
        mouse.cy += (mouse.ty - mouse.cy) * 0.05;

        pecas.forEach((p, i) => {
          const fase = i * 1.3;
          // Peças mais próximas reagem mais ao mouse, o que dá profundidade.
          const perto = 1 + p.z * 0.35;
          p.obj.position.set(
            base[i].x + mouse.cx * 0.18 * perto,
            base[i].y + Math.sin(t * 1.1 + fase) * 0.12 - mouse.cy * 0.12 * perto,
            p.z,
          );
          p.obj.rotation.x = p.giro[0] + mouse.cy * 0.12 + Math.sin(t * 0.8 + fase) * 0.05;
          p.obj.rotation.y = p.giro[1] + mouse.cx * 0.25 + Math.sin(t * 0.6 + fase) * 0.22;
          p.obj.scale.setScalar(Math.max(0.0001, base[i].s * crescer(i)));
        });
        // Pontos do balão pulando em sequência, como alguém digitando.
        pontos.forEach((m, i) => (m.position.y = Math.max(0, Math.sin(t * 5 - i * 0.7)) * 0.08));

        renderer.render(scene, camera);
      };
      gsap.ticker.add(quadro);

      limpar = () => {
        gsap.ticker.remove(quadro);
        gsap.killTweensOf([canvas, entrada]);
        window.removeEventListener("pointermove", onPointerMove);
        ro.disconnect();
        io.disconnect();
        descartar.forEach((d) => d.dispose());
        renderer.dispose();
        canvas.remove();
      };
    };

    // Espera o navegador ficar livre: a cena não pode atrasar o título nem o botão.
    const temIdle = typeof window.requestIdleCallback === "function";
    const espera = temIdle
      ? window.requestIdleCallback(() => void iniciar(), { timeout: 1500 })
      : window.setTimeout(() => void iniciar(), 300);

    return () => {
      cancelado = true;
      if (temIdle) window.cancelIdleCallback(espera);
      else window.clearTimeout(espera);
      limpar?.();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 hidden overflow-hidden xl:block"
      style={{ height: ALTURA_CENA }}
    />
  );
}
