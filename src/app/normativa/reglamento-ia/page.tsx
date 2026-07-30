import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://derechoartificial.com/normativa",
    languages: {
      es: "https://derechoartificial.com/normativa",
      en: "https://derechoartificial.com/en/blog/eu-ai-act-guide-2026",
    },
  },
};

export default function GuiaReglamentoIARedirectPage() {
  redirect("/normativa");
}
