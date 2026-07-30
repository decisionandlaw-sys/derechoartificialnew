"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface Term {
  id: string;
  term: string;
  definition: string;
}

const terms: Term[] = [
  {
    id: "sistemas-alto-riesgo",
    term: "Sistemas de Alto Riesgo",
    definition: "Sistemas de IA que suponen una amenaza para la seguridad o derechos fundamentales, sujetos a evaluación de conformidad según el EU AI Act."
  },
  {
    id: "sesgo-algoritmico",
    term: "Sesgo Algorítmico",
    definition: "Errores sistemáticos en el procesamiento de datos que generan resultados discriminatorios, prohibidos bajo el marco de ética digital europea."
  },
  {
    id: "sandbox-regulatorio",
    term: "Sandbox Regulatorio",
    definition: "Entorno controlado facilitado por la AESIA para probar sistemas de IA innovadores antes de su comercialización."
  },
  {
    id: "explicabilidad",
    term: "Explicabilidad (XAI)",
    definition: "Capacidad de un sistema de IA para presentar sus procesos de toma de decisiones de forma comprensible para humanos y autoridades legales."
  },
  {
    id: "ia-generativa",
    term: "Sistema de IA Generativa",
    definition: "Modelos de IA capaces de generar contenido (texto, imágenes, código) en respuesta a un prompt, sujetos a obligaciones específicas de transparencia bajo el AI Act."
  },
  {
    id: "deepfake",
    term: "Deepfake",
    definition: "Contenido multimedia sintético generado o manipulado por IA que parece auténtico, sujeto a obligaciones de etiquetado y transparencia."
  },
  {
    id: "evaluacion-impacto-derechos-fundamentales",
    term: "Evaluación de Impacto en los Derechos Fundamentales (FRIA)",
    definition: "Análisis obligatorio para desplegadores de sistemas de alto riesgo sobre cómo la IA afectará a los derechos de las personas antes de su puesta en uso."
  },
  {
    id: "oficina-ia",
    term: "Oficina de IA (AI Office)",
    definition: "Nuevo organismo de la Comisión Europea encargado de supervisar los modelos de IA de propósito general y coordinar la política de IA entre los Estados miembros."
  },
  {
    id: "modelo-proposito-general",
    term: "Modelo de Propósito General (GPAI)",
    definition: "Modelo de IA entrenado con gran cantidad de datos que puede realizar una amplia gama de tareas distintas y sirve como base para otros sistemas."
  },
  {
    id: "legal-prompt-engineering",
    term: "Legal Prompt Engineering",
    definition: "Técnica de diseño de instrucciones precisas y estructuradas para obtener resultados jurídicos fiables, seguros y verificables de modelos de lenguaje (LLM)."
  },
  {
    id: "gobernanza-datos",
    term: "Gobernanza de Datos",
    definition: "Conjunto de procesos y estándares que aseguran la calidad, integridad y legalidad de los datos utilizados para entrenar y operar sistemas de IA."
  },
  {
    id: "derecho-a-no-ser-objeto-de-decisiones-automatizadas",
    term: "Derecho a no ser objeto de decisiones automatizadas",
    definition: "Derecho recogido en el RGPD (Art. 22) que protege a las personas de decisiones basadas únicamente en el tratamiento automatizado que produzcan efectos jurídicos."
  }
];

export function GlossaryList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTerms = useMemo(() => {
    return terms.filter(t => 
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <>
      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto mb-16">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="Buscar término (ej: Sesgo, Riesgo...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Glossary List */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto">
          {filteredTerms.length > 0 ? (
            <dl className="space-y-12">
              {filteredTerms.map((item) => (
                <div 
                  key={item.id} 
                  id={item.id}
                  className="relative pl-8 md:pl-0 group scroll-mt-32"
                >
                  {/* Decorative line for mobile */}
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-border md:hidden"></div>
                  
                  <dt className="font-display font-bold text-2xl md:text-3xl text-foreground mb-4 tracking-tight group-hover:text-foreground transition-colors">
                    {item.term}
                  </dt>
                  <dd className="text-lg text-muted-foreground leading-relaxed border-l-0 md:border-l-2 md:border-border md:pl-6 md:group-hover:border-primary transition-all">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No se encontraron resultados para "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 text-primary hover:underline font-medium"
              >
                Ver todos los términos
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
