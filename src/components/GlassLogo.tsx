"use client";

import { useEffect, useRef } from "react";

// Mesmos polígonos do MorphLogo.tsx (viewBox 1254), agora extrudados em 3D.
const M = [394, 384, 625, 612, 856, 384, 856, 812, 805, 853, 805, 507, 625, 686, 445, 507, 445, 664, 394, 702];
const COLCHETE_E = [355, 787, 473, 693, 473, 735, 407, 787, 473, 832, 473, 878];
const COLCHETE_D = [1017, 680, 886, 571, 886, 613, 963, 680, 886, 737, 886, 785];
const BARRA = [637, 738, 665, 738, 612, 878, 584, 878];
const CENTRO_X = 625;
const CENTRO_Y = 630;
const ESCALA = 0.0019;

/**
 * Objeto surreal da seção de projetos: o logo em gesso e ouro, suspenso dentro de um cubo de
 * vidro que flutua. O vidro e o logo giram em ritmos diferentes; o mouse inclina o conjunto e a
 * rolagem o faz girar. Carrega o three.js só no navegador e só desenha quando está na tela.
 */
export default function GlassLogo({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // Só em tela grande: no celular o objeto seria pequeno e o three.js pesaria no 4G.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    let cancelado = false;
    let limpar = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      const { RoundedBoxGeometry } = await import("three/addons/geometries/RoundedBoxGeometry.js");
      if (cancelado) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        return; // Sem WebGL: o objeto é só decoração, a seção funciona sem ele.
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = ambiente;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 0, 6.3);

      const key = new THREE.DirectionalLight(0xfff1d6, 1.4);
      key.position.set(3, 4, 5);
      const rim = new THREE.DirectionalLight(0xd4a94a, 2.2);
      rim.position.set(-4, -1, -3);
      scene.add(key, rim);

      const conjunto = new THREE.Group();
      scene.add(conjunto);

      // Logo: o M em gesso, colchetes, barra e anel em ouro.
      const gesso = new THREE.MeshStandardMaterial({ color: 0xeee8de, roughness: 0.78, metalness: 0 });
      const ouro = new THREE.MeshStandardMaterial({ color: 0xd4a94a, roughness: 0.26, metalness: 1 });
      const geometrias: import("three").BufferGeometry[] = [];

      const peca = (pts: number[], profundidade: number, material: import("three").Material) => {
        const forma = new THREE.Shape();
        for (let i = 0; i < pts.length; i += 2) {
          const x = (pts[i] - CENTRO_X) * ESCALA;
          const y = -(pts[i + 1] - CENTRO_Y) * ESCALA;
          if (i === 0) forma.moveTo(x, y);
          else forma.lineTo(x, y);
        }
        const g = new THREE.ExtrudeGeometry(forma, {
          depth: profundidade,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.012,
          bevelSegments: 3,
        });
        g.translate(0, 0, -profundidade / 2);
        geometrias.push(g);
        return new THREE.Mesh(g, material);
      };

      const logo = new THREE.Group();
      logo.add(peca(M, 0.2, gesso), peca(COLCHETE_E, 0.12, ouro), peca(COLCHETE_D, 0.12, ouro), peca(BARRA, 0.12, ouro));

      // Anel aberto do logo: começa em ~15° e dá ~307° de volta, como no SVG.
      const anelGeo = new THREE.TorusGeometry(430 * ESCALA, 0.022, 16, 120, (306.6 * Math.PI) / 180);
      geometrias.push(anelGeo);
      const anel = new THREE.Mesh(anelGeo, ouro);
      anel.rotation.z = (14.8 * Math.PI) / 180;
      logo.add(anel);
      conjunto.add(logo);

      // Cubo de vidro sem "névoa": as faces de frente ficam quase invisíveis e só as bordas e os
      // reflexos acendem (efeito Fresnel), somados à cena em vez de cobri-la de cinza.
      const cuboGeo = new RoundedBoxGeometry(2.1, 2.1, 2.1, 6, 0.16);
      geometrias.push(cuboGeo);
      const fresnel = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        vertexShader: `
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
            vec3 cor = mix(vec3(1.0, 0.96, 0.88), vec3(0.91, 0.78, 0.46), f);
            gl_FragColor = vec4(cor * (0.02 + f * 0.42), 1.0);
          }`,
      });
      const reflexo = new THREE.MeshStandardMaterial({
        color: 0x3a3632,
        metalness: 1,
        roughness: 0.08,
        envMapIntensity: 1.2,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const cuboBorda = new THREE.Mesh(cuboGeo, fresnel);
      const cuboReflexo = new THREE.Mesh(cuboGeo, reflexo);
      cuboBorda.renderOrder = 1;
      cuboReflexo.renderOrder = 2;
      conjunto.add(cuboBorda, cuboReflexo);

      // Arestas finas para o cubo ler como vidro e não como névoa.
      const arestasGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.06, 2.06, 2.06));
      geometrias.push(arestasGeo);
      const arestasMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
      conjunto.add(new THREE.LineSegments(arestasGeo, arestasMat));

      const tamanho = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      tamanho();

      const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      let giroRolagem = 0;
      let raf = 0;
      let visivel = false;
      const inicio = performance.now();

      const desenhar = () => {
        const t = (performance.now() - inicio) / 1000;
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        const r = el.getBoundingClientRect();
        const alvoRolagem = (r.top + r.height / 2) / window.innerHeight;
        giroRolagem += (alvoRolagem - giroRolagem) * 0.08;

        conjunto.position.y = quieto ? 0 : Math.sin(t * 0.8) * 0.07;
        conjunto.rotation.set(0.32 + mouse.y * 0.25, -0.55 + (quieto ? 0 : t * 0.18) + mouse.x * 0.45 - giroRolagem * 1.1, -0.12);
        // O logo gira devagar no sentido contrário, como se flutuasse solto dentro do vidro.
        logo.rotation.y = quieto ? 0.35 : 0.35 - t * 0.32;
        logo.position.y = quieto ? 0 : Math.sin(t * 1.1 + 1) * 0.04;

        renderer.render(scene, camera);
        raf = visivel && !quieto ? requestAnimationFrame(desenhar) : 0;
      };

      const io = new IntersectionObserver(([e]) => {
        visivel = e.isIntersecting;
        if (visivel && !raf) raf = requestAnimationFrame(desenhar);
      });
      io.observe(el);

      const ro = new ResizeObserver(() => {
        tamanho();
        if (!raf) desenhar();
      });
      ro.observe(el);

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // Com "reduzir movimento" a cena fica parada, então redesenha só quando a página rola.
      const onScroll = () => {
        if (quieto && visivel) desenhar();
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      limpar = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        geometrias.forEach((g) => g.dispose());
        [gesso, ouro, fresnel, reflexo, arestasMat].forEach((m) => m.dispose());
        ambiente.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      cancelado = true;
      limpar();
    };
  }, []);

  return <div ref={box} aria-hidden className={className} />;
}
