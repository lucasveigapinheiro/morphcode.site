"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Cena 3D leve para desktop da hero do Morph Leads:
 * - Placa metálica de planilha em verde-floresta com barras lima brilhantes
 * - Pin de localização 3D estilizado (Google Maps) em lima polido
 * - Esferas/cristais orbitais suaves
 * Iluminação via RoomEnvironment + PMREMGenerator, loop único no gsap.ticker,
 * DPR limitado a 2 e pausa automática quando fora da viewport ou em reduced-motion.
 */
export default function HeroLeads3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1024) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, host.clientWidth / Math.max(host.clientHeight, 1), 0.1, 60);
    camera.position.set(0, 0.2, 9.2);

    // Iluminação de estúdio via RoomEnvironment + PMREMGenerator (sem luzes soltas)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const disposables: { dispose: () => void }[] = [envTarget];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const matFloresta = track(
      new THREE.MeshStandardMaterial({
        color: 0x163300,
        metalness: 0.72,
        roughness: 0.24,
      }),
    );
    const matLima = track(
      new THREE.MeshStandardMaterial({
        color: 0x9fe870,
        metalness: 0.55,
        roughness: 0.2,
        emissive: 0x2b5910,
        emissiveIntensity: 0.28,
      }),
    );
    const matCromo = track(
      new THREE.MeshStandardMaterial({
        color: 0xe8ebe6,
        metalness: 0.85,
        roughness: 0.14,
      }),
    );
    const matEscuro = track(
      new THREE.MeshStandardMaterial({
        color: 0x0e0f0c,
        metalness: 0.65,
        roughness: 0.28,
      }),
    );

    const root = new THREE.Group();
    scene.add(root);

    // 1. Pin de localização 3D (Google Maps) no canto superior direito
    const pinGroup = new THREE.Group();
    pinGroup.position.set(3.45, 1.55, -0.4);
    const pinCone = new THREE.Mesh(track(new THREE.ConeGeometry(0.42, 0.95, 32)), matLima);
    pinCone.rotation.x = Math.PI;
    pinCone.position.y = -0.52;
    const pinHead = new THREE.Mesh(track(new THREE.SphereGeometry(0.46, 32, 32)), matLima);
    const pinCore = new THREE.Mesh(track(new THREE.SphereGeometry(0.18, 24, 24)), matFloresta);
    pinCore.position.z = 0.34;
    const pinRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.72, 0.045, 16, 48)), matCromo);
    pinRing.rotation.x = Math.PI / 2.4;
    pinRing.position.y = -0.92;
    pinGroup.add(pinCone, pinHead, pinCore, pinRing);
    root.add(pinGroup);

    // 2. Placa de planilha 3D flutuante à esquerda inferior (sutil profundidade)
    const sheetGroup = new THREE.Group();
    sheetGroup.position.set(-3.85, -1.65, -1.2);
    sheetGroup.rotation.set(0.24, 0.42, -0.1);
    const plate = new THREE.Mesh(track(new THREE.BoxGeometry(1.7, 1.15, 0.1)), matFloresta);
    sheetGroup.add(plate);

    const barGeo = track(new THREE.BoxGeometry(1.25, 0.13, 0.06));
    [-0.3, 0, 0.3].forEach((yPos, idx) => {
      const bar = new THREE.Mesh(barGeo, idx === 0 ? matLima : matCromo);
      bar.position.set(idx === 1 ? -0.08 : 0, yPos, 0.08);
      bar.scale.x = idx === 2 ? 0.72 : idx === 1 ? 0.86 : 1;
      sheetGroup.add(bar);
    });
    root.add(sheetGroup);

    // 3. Moeda/anel orbital + octaedros facetados no lado direito inferior
    const orbGroup = new THREE.Group();
    orbGroup.position.set(3.7, -1.65, -0.9);
    const torus = new THREE.Mesh(track(new THREE.TorusKnotGeometry(0.46, 0.13, 72, 16)), matEscuro);
    const innerOrb = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.24, 0)), matLima);
    orbGroup.add(torus, innerOrb);
    root.add(orbGroup);

    // 4. Pequena esfera metálica no topo esquerdo para equilibrar a composição
    const topOrb = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.32, 1)), matCromo);
    topOrb.position.set(-3.6, 1.85, -1.5);
    root.add(topOrb);

    // Mouse parallax suave
    const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
    const onPointerMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ResizeObserver para acompanhar o container sem distorção
    const ro = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = Math.max(host.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(host);

    // Pausa o render quando a hero sai da tela
    let visivel = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visivel = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    io.observe(host);

    const startTime = performance.now();
    const renderFrame = () => {
      if (!visivel || document.hidden) return;
      const t = (performance.now() - startTime) * 0.001;

      mouse.cx += (mouse.tx - mouse.cx) * 0.05;
      mouse.cy += (mouse.ty - mouse.cy) * 0.05;

      root.rotation.y = mouse.cx * 0.14;
      root.rotation.x = mouse.cy * 0.08;

      pinGroup.position.y = 1.55 + Math.sin(t * 1.4) * 0.18;
      pinGroup.rotation.y = t * 0.55;
      pinRing.rotation.z = t * 0.8;

      sheetGroup.position.y = -1.65 + Math.cos(t * 1.1) * 0.16;
      sheetGroup.rotation.y = 0.42 + Math.sin(t * 0.7) * 0.14;

      orbGroup.position.y = -1.65 + Math.sin(t * 1.2 + 1.2) * 0.15;
      torus.rotation.x = t * 0.38;
      torus.rotation.y = t * 0.5;
      innerOrb.rotation.y = -t * 0.9;

      topOrb.position.y = 1.85 + Math.cos(t * 1.3 + 0.6) * 0.14;
      topOrb.rotation.x = t * 0.4;
      topOrb.rotation.z = t * 0.3;

      renderer.render(scene, camera);
    };

    gsap.ticker.add(renderFrame);

    return () => {
      gsap.ticker.remove(renderFrame);
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      io.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden opacity-90 lg:block" />;
}
