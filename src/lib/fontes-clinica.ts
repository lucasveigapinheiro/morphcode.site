import { Fraunces, Manrope } from "next/font/google";

// Mesmas fontes do sistema Morph Clínica, usadas na página e na seção do produto.
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

export const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const fontesClinica = `${fraunces.variable} ${manrope.variable}`;
