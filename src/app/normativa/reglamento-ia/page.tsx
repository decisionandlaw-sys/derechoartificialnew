import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.derechoartificial.com/normativa",
    languages: {
      es: "https://www.derechoartificial.com/normativa",
      en: "https://decisionandlaw.com/",
    },
  },
};

export default function GuiaReglamentoIARedirectPage() {
  redirect("/normativa");
}
