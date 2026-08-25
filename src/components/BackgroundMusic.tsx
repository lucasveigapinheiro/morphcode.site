"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = 0.25;
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/lofi-relax.mp3" loop preload="none" />
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar música de fundo" : "Tocar música de fundo"}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mx-auto flex items-center gap-3 rounded-full border border-border bg-surface/80 backdrop-blur-md shadow-lg pl-4 pr-2 py-2 text-left hover:bg-surface transition-colors"
      >
        <span className="flex flex-col leading-tight">
          <span className="text-xs font-medium text-foreground">
            Relaxe enquanto navega pela Morph
          </span>
          <span className="text-[11px] text-muted">
            {playing ? "Tocando lo-fi" : "Ativar música ambiente"}
          </span>
        </span>

        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-background">
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.span
                key="pause"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <FaPause size={12} />
              </motion.span>
            ) : (
              <motion.span
                key="play"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <FaPlay size={12} className="translate-x-[1px]" />
              </motion.span>
            )}
          </AnimatePresence>

          {playing && (
            <motion.span
              className="absolute inset-0 rounded-full bg-gold"
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </span>
      </motion.button>
    </>
  );
}
