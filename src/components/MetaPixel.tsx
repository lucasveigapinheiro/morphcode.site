"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Evento padrão do Meta para o clique em um botão de WhatsApp. */
export function trackMetaContact(params: Record<string, string>) {
  window.fbq?.("track", "Contact", params);
}

/** Carrega o Meta Pixel e conta cada página vista. Só liga quando NEXT_PUBLIC_META_PIXEL_ID existe. */
export default function MetaPixel() {
  const pathname = usePathname();
  const primeira = useRef(true);

  // A primeira página é contada junto do `init`; aqui entram as trocas de rota sem recarregar.
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
