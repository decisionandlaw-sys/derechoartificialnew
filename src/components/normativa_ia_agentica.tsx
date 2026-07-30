"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const T = {
  navy: "#0D1B2E",
  navy2: "#132340",
  navy3: "#1A2F52",
  gold: "#C9A245",
  gold2: "#E8C870",
  white: "#F4F1EB",
  silver: "#8A9BB5",
  muted: "#4A5568",
  red: "#C0392B",
  green: "#1A6B3C",
  blue: "#2B6CB0",
  purple: "#6B46C1",
};

const INSTRUMENTS = [
  {
    id: "rgpd",
    sigla: "RGPD",
    nombre: "Reglamento General de Protección de Datos",
    ref: "Reglamento (UE) 2016/679",
    vigencia: "En vigor desde 2018",
    dot: T.gold,
    articulos: [
      {
        num: "Art. 4(1)",
        desc: "Definición de dato personal — determina el ámbito de aplicación sobre cualquier información tratada por el agente.",
      },
      {
        num: "Art. 4(2)",
        desc: "Definición amplia de tratamiento — abarca cada operación ejecutada por el sistema, incluidas las intermedias no visibles.",
      },
      {
        num: "Art. 5",
        desc: "Principios del tratamiento: licitud, minimización, limitación de finalidad, exactitud, limitación del plazo de conservación, integridad y confidencialidad. La arquitectura agéntica intensifica la exigencia de todos ellos.",
      },
      {
        num: "Art. 6",
        desc: "Bases jurídicas — la reutilización de datos almacenados en memoria persistente puede requerir base jurídica independiente de la original.",
      },
      {
        num: "Art. 9",
        desc: "Categorías especiales — la acumulación longitudinal puede generar tratamiento de datos sensibles inferidos sin recogida explícita.",
      },
      {
        num: "Art. 13–14",
        desc: "Derecho de información y transparencia — la opacidad de los flujos intermedios agénticos tensiona el cumplimiento efectivo.",
      },
      {
        num: "Art. 17",
        desc: "Derecho de supresión — requiere arquitectura de memoria que permita eliminación selectiva y verificable.",
      },
      {
        num: "Art. 22",
        desc: "Decisiones exclusivamente automatizadas — aplicable cuando la cadena de razonamiento agéntica produce efectos jurídicos o significativos sobre el interesado.",
      },
      {
        num: "Art. 25",
        desc: "Privacidad desde el diseño y por defecto — fundamento del compliance by architecture en sistemas agénticos.",
      },
      {
        num: "Art. 30",
        desc: "Registro de actividades de tratamiento — debe reflejar la arquitectura distribuida y los nodos de almacenamiento intermedios.",
      },
      {
        num: "Art. 32",
        desc: "Seguridad del tratamiento — la multiplicación de nodos eleva la superficie de exposición y exige medidas proporcionales.",
      },
      {
        num: "Art. 35",
        desc: "Evaluación de impacto (EIPD) — obligatoria cuando concurren autonomía elevada, tratamiento longitudinal y efectos potencialmente significativos.",
      },
    ],
  },
  {
    id: "ria",
    sigla: "RIA",
    nombre: "Reglamento de Inteligencia Artificial",
    ref: "Reglamento (UE) 2024/1689",
    vigencia: "Aplicación escalonada 2024–2027",
    dot: "#7C3AED",
    articulos: [
      {
        num: "Art. 3",
        desc: "Definiciones clave: sistema de IA, proveedor, implementador, operador. La arquitectura multiagente puede implicar múltiples roles simultáneos.",
      },
      {
        num: "Art. 5",
        desc: "Prácticas de IA prohibidas — los sistemas agénticos con capacidad de manipulación subliminal o explotación de vulnerabilidades quedan expresamente vetados.",
      },
      {
        num: "Art. 6 + Anexo III",
        desc: "Clasificación de alto riesgo — los sistemas agénticos en sectores críticos (empleo, crédito, infraestructuras esenciales) califican como alto riesgo.",
      },
      {
        num: "Art. 9",
        desc: "Sistema de gestión de riesgos — debe ser continuo e iterativo, coherente con la naturaleza evolutiva de la IA agéntica.",
      },
      {
        num: "Art. 10",
        desc: "Gobernanza de datos de entrenamiento — la memoria persistente como fuente de datos operativos exige gestión equivalente.",
      },
      {
        num: "Art. 11–12",
        desc: "Documentación técnica y registro automático de eventos — trazabilidad de la cadena de razonamiento como exigencia normativa expresa.",
      },
      {
        num: "Art. 13",
        desc: "Transparencia e información a los usuarios — aplicable a los resultados producidos por sistemas agénticos con efectos sobre personas físicas.",
      },
      {
        num: "Art. 14",
        desc: "Supervisión humana — exige que el diseño permita la intervención efectiva de operadores humanos, no meramente formal.",
      },
      {
        num: "Art. 17",
        desc: "Sistema de gestión de calidad — el proveedor debe documentar la arquitectura del sistema, incluyendo componentes de memoria y herramientas externas.",
      },
      {
        num: "Art. 51–55",
        desc: "Modelos de IA de uso general (GPAI) — los LLM subyacentes en sistemas agénticos quedan sujetos a obligaciones específicas de transparencia y evaluación.",
      },
      {
        num: "Art. 72",
        desc: "Supervisión de mercado — la AEPD es designada autoridad competente en España para sistemas de IA que traten datos personales.",
      },
    ],
  },
  {
    id: "lopdgdd",
    sigla: "LOPDGDD",
    nombre: "Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales",
    ref: "LO 3/2018, de 5 de diciembre",
    vigencia: "En vigor desde diciembre 2018",
    dot: "#D97706",
    articulos: [
      {
        num: "Art. 4",
        desc: "Exactitud de los datos — especialmente relevante cuando la memoria acumulativa puede consolidar información no actualizada o inferida de fuentes heterogéneas.",
      },
      {
        num: "Art. 11",
        desc: "Transparencia e información al interesado — el responsable debe articular información comprensible sobre la lógica agéntica aplicada.",
      },
      {
        num: "Art. 25",
        desc: "Derecho a la portabilidad — en sistemas con memoria persistente, requiere mecanismos de exportación estructurada de datos acumulados.",
      },
      {
        num: "Art. 41",
        desc: "Funciones del Delegado de Protección de Datos — el DPO debe comprender la arquitectura técnica de los sistemas agénticos desplegados.",
      },
      {
        num: "Art. 48",
        desc: "Reclamaciones ante la AEPD — vía de tutela específica en materia de decisiones automatizadas y tratamientos opacos.",
      },
      {
        num: "Art. 89",
        desc: "Derecho a la intimidad ante el uso de dispositivos de videovigilancia — aplicable cuando agentes con capacidades de percepción visual operan en entornos físicos.",
      },
      {
        num: "Arts. 93–97",
        desc: "Derechos digitales en el entorno laboral — limitación del uso de IA agéntica en contextos de monitorización de trabajadores.",
      },
    ],
  },
  {
    id: "soft",
    sigla: "Soft Law",
    nombre: "Directrices, Dictámenes y Guías de Autoridades",
    ref: "CEPD · AEPD · OCDE · UNESCO",
    vigencia: "Vigencia continua — actualización periódica",
    dot: T.green,
    articulos: [
      {
        num: "CEPD — Directrices 02/2022",
        desc: "Sobre listas negras relativas a decisiones basadas exclusivamente en tratamiento automatizado. Interpretación aplicable al art. 22 RGPD en contextos agénticos.",
      },
      {
        num: "CEPD — Directrices 06/2020",
        desc: "Sobre conceptos de responsable y encargado del tratamiento. Relevantes para la asignación de roles en arquitecturas multiagente.",
      },
      {
        num: "CEPD — Dictamen 28/2024",
        desc: "Sobre el tratamiento de datos personales en el contexto de los modelos de IA. Primera orientación específica sobre tratamiento de datos en sistemas de IA de gran escala.",
      },
      {
        num: "AEPD — Guía sobre IA y protección de datos (2020)",
        desc: "Marco de referencia nacional para el análisis de riesgos de sistemas de IA desde la perspectiva del RGPD. Pendiente de actualización para arquitecturas agénticas.",
      },
      {
        num: "AEPD — Circular 1/2023",
        desc: "Sobre procedimientos en materia de evaluación de impacto. Aplicable a sistemas agénticos de alto riesgo desplegados en España.",
      },
      {
        num: "Principios de IA de la OCDE (2019, rev. 2024)",
        desc: "Marco internacional de referencia: transparencia, explicabilidad, robustez, seguridad y rendición de cuentas. Incorporados al RIA como referencia interpretativa.",
      },
      {
        num: "Recomendación UNESCO sobre ética de la IA (2021)",
        desc: "Instrumento internacional no vinculante sobre principios éticos aplicables al ciclo de vida de los sistemas de IA, incluyendo la supervisión humana.",
      },
    ],
  },
];

const INTERACTIONS = [
  {
    par: "RGPD ↔ RIA",
    color: "#3B6EA5",
    desc: "El cumplimiento del RIA no exime del RGPD. Ambos se aplican de forma acumulativa. El art. 9 RIA (gestión de riesgos) y el art. 35 RGPD (EIPD) son complementarios y deben articularse de manera coordinada. El responsable puede integrarlos en un único instrumento de evaluación.",
    tension:
      "La EIPD del RGPD analiza el impacto sobre personas físicas; la gestión de riesgos del RIA se centra en la seguridad y el rendimiento del sistema. En la práctica agéntica, ambas dimensiones son inseparables.",
  },
  {
    par: "RGPD ↔ LOPDGDD",
    color: "#D97706",
    desc: "La LOPDGDD es la norma de desarrollo del RGPD en España. Añade especificidades en materia de derechos digitales laborales, menores, y vías de tutela ante la AEPD. En entornos agénticos desplegados en el ámbito laboral, los arts. 87–91 LOPDGDD imponen límites adicionales al alcance del tratamiento.",
    tension:
      "La fragmentación territorial del desarrollo normativo puede generar incertidumbre cuando el sistema agéntico opera en múltiples jurisdicciones de la UE con distintas normas de desarrollo.",
  },
  {
    par: "RIA ↔ Soft Law",
    color: "#1A6B3C",
    desc: "Las directrices del CEPD y las guías de la AEPD, aunque no vinculantes en sentido estricto, son altamente influyentes en la práctica supervisora y sancionadora. El RIA remite expresamente a normas armonizadas y estándares técnicos que aún están en elaboración por organismos como CEN/CENELEC.",
    tension:
      "La ausencia de estándares técnicos armonizados específicos para IA agéntica genera una laguna normativa que las autoridades supervisan con los instrumentos de soft law disponibles hasta la aprobación de normas armonizadas.",
  },
  {
    par: "Art. 22 RGPD ↔ Art. 14 RIA",
    color: "#6B46C1",
    desc: "El art. 22 RGPD exige supervisión humana real en decisiones exclusivamente automatizadas con efectos significativos. El art. 14 RIA establece obligaciones de supervisión humana para sistemas de alto riesgo. En arquitecturas agénticas, ambos convergen: el diseño debe garantizar que la supervisión sea sustantiva, no formal.",
    tension:
      "El umbral de 'efectos jurídicos o significativos' del art. 22 RGPD puede alcanzarse en sistemas agénticos con alta autonomía aunque el resultado final no adopte la forma clásica de 'decisión', sino de recomendación operativamente determinante.",
  },
];

const TIMELINE = [
  {
    fecha: "Mayo 2018",
    hito: "Aplicación plena del RGPD",
    norma: "RGPD",
    color: T.gold,
    desc: "El RGPD es plenamente aplicable a cualquier sistema de IA agéntica que trate datos personales de residentes en la UE, independientemente de dónde esté establecido el proveedor.",
  },
  {
    fecha: "Diciembre 2018",
    hito: "Entrada en vigor de la LOPDGDD",
    norma: "LOPDGDD",
    color: "#D97706",
    desc: "Complementa el RGPD con especificidades españolas. Los derechos digitales de los artículos 87–97 son directamente aplicables a sistemas agénticos en contextos laborales.",
  },
  {
    fecha: "Agosto 2024",
    hito: "Entrada en vigor del RIA",
    norma: "RIA",
    color: "#7C3AED",
    desc: "El Reglamento de IA entra en vigor 20 días después de su publicación en el DOUE. El período de adaptación es escalonado.",
  },
  {
    fecha: "Febrero 2025",
    hito: "Aplicación de las prohibiciones del RIA",
    norma: "RIA",
    color: "#7C3AED",
    desc: "Las prácticas de IA prohibidas (art. 5 RIA) son directamente aplicables. Los sistemas agénticos que incurran en manipulación subliminal o explotación de vulnerabilidades deben cesar.",
  },
  {
    fecha: "Agosto 2025",
    hito: "Aplicación plena a modelos GPAI",
    norma: "RIA",
    color: "#7C3AED",
    desc: "Las obligaciones sobre modelos de IA de uso general (arts. 51–55 RIA) son plenamente aplicables. Los LLM subyacentes en sistemas agénticos quedan sujetos a requisitos de transparencia y evaluación.",
  },
  {
    fecha: "Agosto 2026",
    hito: "Aplicación a sistemas de alto riesgo (Anexo I)",
    norma: "RIA",
    color: "#7C3AED",
    desc: "Las obligaciones relativas a sistemas de IA de alto riesgo listados en el Anexo I del RIA son plenamente aplicables.",
  },
  {
    fecha: "Agosto 2027",
    hito: "Aplicación plena del RIA",
    norma: "RIA",
    color: "#7C3AED",
    desc: "La totalidad del Reglamento de IA es aplicable, incluyendo los sistemas de alto riesgo del Anexo III que sean ampliaciones de sistemas preexistentes.",
  },
];

const OBLIGATIONS = [
  {
    actor: "Proveedor del sistema agéntico",
    color: T.gold,
    items: [
      "Diseñar el sistema conforme a los principios del art. 25 RGPD desde el origen",
      "Elaborar documentación técnica que describa arquitectura, memoria y herramientas (art. 11 RIA)",
      "Implementar sistema de gestión de riesgos iterativo (art. 9 RIA)",
      "Garantizar supervisión humana técnicamente efectiva (art. 14 RIA)",
      "Registrar automáticamente los eventos relevantes del sistema (art. 12 RIA)",
      "Cumplir obligaciones de transparencia sobre la lógica aplicada (art. 13 RIA)",
    ],
  },
  {
    actor: "Responsable del tratamiento",
    color: "#3B6EA5",
    items: [
      "Realizar EIPD cuando el sistema agéntico implique alto riesgo (art. 35 RGPD)",
      "Mantener el registro de actividades de tratamiento actualizado con la arquitectura agéntica (art. 30 RGPD)",
      "Designar DPO cuando el tratamiento sea a gran escala o sistemático (art. 37 RGPD)",
      "Establecer contratos de encargo con todos los proveedores de herramientas externas (art. 28 RGPD)",
      "Garantizar el ejercicio de los derechos de los interesados sobre datos almacenados en memoria",
      "Notificar brechas de seguridad en los plazos del art. 33 RGPD",
    ],
  },
  {
    actor: "Implementador / Operador",
    color: "#1A6B3C",
    items: [
      "No modificar el sistema de manera que comprometa la supervisión humana establecida",
      "Garantizar que el uso se ajusta a la finalidad para la que el sistema fue autorizado",
      "Suspender el uso si se detectan riesgos no evaluados previamente",
      "Conservar los registros de funcionamiento durante el plazo exigido",
      "Informar al proveedor de incidentes o comportamientos anómalos detectados",
    ],
  },
  {
    actor: "Delegado de Protección de Datos",
    color: "#6B46C1",
    items: [
      "Asesorar sobre la EIPD de sistemas agénticos (art. 39 RGPD)",
      "Supervisar el cumplimiento del RGPD respecto al tratamiento agéntico",
      "Actuar como punto de contacto con la AEPD",
      "Comprender la arquitectura técnica del sistema para ejercer su función con rigor",
      "Evaluar la adecuación de los controles de memoria y trazabilidad implementados",
    ],
  },
];

function SecInstrumentos() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-amber-200 bg-amber-50/80 px-4 py-4 text-sm text-body shadow-[0_4px_14px_rgba(15,23,42,0.08)]">
        <p className="font-serif text-[0.95rem] leading-relaxed text-slate-900">
          “La IA agéntica no introduce nuevas categorías jurídicas, pero sí transforma la morfología del tratamiento de
          datos. El marco normativo existente es suficiente para encuadrar el fenómeno; insuficiente si se aplica sin
          penetrar en la arquitectura técnica.”
        </p>
        <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.24em] text-amber-700">
          Artículo doctrinal — Sección III
        </p>
      </div>

      <div>
        <h3 className="font-serif text-xl md:text-2xl text-foreground mb-1">Instrumentos jurídicos aplicables</h3>
        <p className="text-sm md:text-[0.95rem] text-body/90 italic">
          Marco normativo vigente aplicable a sistemas de IA agéntica. Despliega cada bloque para ver los artículos más
          relevantes y su impacto práctico.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {INSTRUMENTS.map((inst) => {
          const isOpen = open === inst.id;
          return (
            <div
              key={inst.id}
              className={`rounded-sm border bg-card/90 transition-all duration-300 ${
                isOpen ? "border-primary/60 shadow-sm" : "border-border"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : inst.id)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`${inst.nombre} - ${isOpen ? 'Contraer' : 'Expandir'} detalles`}
              >
                <div
                  className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: inst.dot }}
                />
                <div className="flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-amber-700 uppercase">
                        {inst.sigla}
                      </span>
                      <span className="font-serif text-[0.95rem] font-semibold text-foreground">
                        {inst.nombre}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.16em] text-caption uppercase">
                      {inst.vigencia}
                    </span>
                  </div>
                  <p className="text-xs text-body/80 italic">{inst.ref}</p>
                </div>
                <span
                  className={`ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] text-amber-700 transition-transform ${
                    isOpen ? "rotate-180 border-amber-400 bg-amber-50" : "border-border bg-background"
                  }`}
                >
                  ▾
                </span>
              </button>
              <div
                className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="min-h-0 border-t border-border/60 bg-muted/30 px-4 py-3">
                  <div className="space-y-2">
                    {inst.articulos.map((a, i) => (
                      <div
                        key={a.num}
                        className={`flex gap-3 border-b border-border/40 pb-2 text-[13px] last:border-0 last:pb-0 ${
                          i === 0 ? "pt-0" : "pt-2"
                        }`}
                      >
                        <div className="w-32 flex-shrink-0 font-mono text-[11px] tracking-[0.04em] text-amber-700">
                          {a.num}
                        </div>
                        <div className="flex-1 text-body/90 leading-relaxed">{a.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SecInteracciones() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl md:text-2xl text-foreground mb-1">Interacciones y tensiones normativas</h3>
        <p className="text-sm md:text-[0.95rem] text-body/90 italic">
          Los instrumentos no operan en silos. Su aplicación conjunta genera articulaciones complejas en entornos
          agénticos que deben ser tenidas en cuenta al diseñar la arquitectura y la gobernanza.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {INTERACTIONS.map((inter) => (
          <div
            key={inter.par}
            className="rounded-sm border bg-card/90 p-4 shadow-sm transition-all hover:shadow-md"
            style={{ borderLeft: `4px solid ${inter.color}` }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
              style={{ color: inter.color }}
            >
              {inter.par}
            </p>
            <p className="text-sm text-body/90 mb-3 leading-relaxed">{inter.desc}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-caption mb-1">
              Tensión normativa identificada
            </p>
            <p className="border-l border-border/60 pl-3 text-xs text-body/90 italic leading-relaxed">
              {inter.tension}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-2 rounded-sm border border-red-200 bg-red-50/80 p-4 text-sm leading-relaxed text-slate-900">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-700 mb-1">
          Laguna normativa destacada
        </p>
        <p className="text-[13px] text-slate-800">
          Ninguno de los instrumentos vigentes regula específicamente la gobernanza de la memoria persistente en
          sistemas agénticos ni establece criterios concretos de segmentación, supresión selectiva o auditoría de la
          memoria acumulativa. Esta laguna es un vector central de incertidumbre jurídica hasta la aprobación de
          estándares técnicos armonizados.
        </p>
      </div>
    </div>
  );
}

function SecCalendario() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl md:text-2xl text-foreground mb-1">Calendario de aplicación</h3>
        <p className="text-sm md:text-[0.95rem] text-body/90 italic">
          Cronología de obligaciones vigentes y en aplicación progresiva. Cada hito permite visualizar qué norma entra
          en juego y cómo afecta a proyectos de IA agéntica.
        </p>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-amber-400 to-amber-200/10" />
        <div className="space-y-4">
          {TIMELINE.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <button
                key={item.fecha}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group relative w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`${item.fecha} - ${isOpen ? 'Contraer' : 'Expandir'} detalles`}
              >
                <div
                  className="absolute left-0 top-2 h-3 w-3 -translate-x-1 rounded-full border-2 bg-background transition-all group-hover:scale-110"
                  style={{ borderColor: item.color, backgroundColor: isOpen ? item.color : "var(--background)" }}
                />
                <div className="pl-4">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-amber-700 uppercase">
                    {item.fecha}
                  </p>
                  <p className="font-serif text-[0.95rem] font-semibold text-foreground">{item.hito}</p>
                  <span
                    className="mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em]"
                    style={{
                      backgroundColor: `${item.color}20`,
                      borderColor: `${item.color}66`,
                      color: item.color,
                    }}
                  >
                    {item.norma}
                  </span>
                  <div
                    className="overflow-hidden text-xs text-body/90 transition-[max-height] duration-300"
                    style={{ maxHeight: isOpen ? 120 : 0 }}
                  >
                    <p className="mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SecObligaciones() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl md:text-2xl text-foreground mb-1">Mapa de obligaciones por actor</h3>
        <p className="text-sm md:text-[0.95rem] text-body/90 italic">
          Distribución de responsabilidades en el ecosistema de la IA agéntica. Útil como checklist operativo para
          cada rol implicado.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {OBLIGATIONS.map((obl) => (
          <div
            key={obl.actor}
            className="rounded-sm border bg-card/90 p-4 shadow-sm"
            style={{ borderTop: `3px solid ${obl.color}` }}
          >
            <p className="font-serif text-[0.95rem] font-semibold mb-3" style={{ color: obl.color }}>
              {obl.actor}
            </p>
            <ul className="space-y-2 text-sm text-body/90">
              {obl.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-xs" style={{ color: obl.color }}>
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-2 rounded-sm border border-amber-200 bg-amber-50/80 p-4 text-sm leading-relaxed text-slate-900">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-700 mb-1">
          Principio transversal
        </p>
        <p className="font-serif text-[13px] text-slate-900 italic">
          “La complejidad técnica no reduce la responsabilidad; la intensifica. La multiplicidad de actores y la
          fragmentación de funciones no diluyen las obligaciones, sino que exigen claridad organizativa proporcional a
          la complejidad del sistema.”
        </p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-slate-700">
          Arts. 5(2) y 25 RGPD · Art. 17 RIA
        </p>
      </div>
    </div>
  );
}

function SecLegeFerenda() {
  const proposals = [
    {
      num: "I",
      title: "Regulación específica de la memoria persistente",
      color: T.gold,
      desc: "El legislador europeo debería adoptar directrices vinculantes sobre los criterios de incorporación, conservación, segmentación y supresión de datos en sistemas de memoria persistente de IA agéntica, articuladas como desarrollo del art. 5(1)(e) RGPD y del art. 10 RIA.",
      fundamento:
        "Laguna normativa identificada — ningún instrumento vigente establece criterios específicos para la gobernanza de la memoria acumulativa agéntica.",
    },
    {
      num: "II",
      title: "Estándares de trazabilidad para arquitecturas multiagente",
      color: "#3B6EA5",
      desc: "CEN/CENELEC debería desarrollar, en el marco del mandato de estandarización del RIA, normas técnicas armonizadas específicas para la trazabilidad y reproducibilidad de cadenas de razonamiento en sistemas multiagente, como condición para la presunción de conformidad del art. 40 RIA.",
      fundamento:
        "La ausencia de estándares técnicos concretos de trazabilidad para arquitecturas agénticas impide la verificación efectiva del cumplimiento.",
    },
    {
      num: "III",
      title: "Categoría de evaluación de impacto agéntica",
      color: "#1A6B3C",
      desc: "El CEPD debería emitir directrices específicas sobre la metodología de EIPD para sistemas agénticos, incorporando la evaluación de los cuatro riesgos estructurales identificados (ampliación funcional, acumulación longitudinal, opacidad distribuida, irreversibilidad operativa) como contenido mínimo obligatorio.",
      fundamento:
        "Las directrices existentes sobre EIPD no contemplan la morfología específica del tratamiento agéntico ni los riesgos derivados de la memoria persistente.",
    },
    {
      num: "IV",
      title: "Registro específico de sistemas agénticos",
      color: "#6B46C1",
      desc: "El art. 71 RIA, que establece la base de datos de la UE para sistemas de alto riesgo, debería incluir una categoría específica para sistemas agénticos, con campos obligatorios que describan el nivel de autonomía, la capacidad de memoria persistente y las herramientas externas accesibles.",
      fundamento:
        "La supervisión de mercado efectiva requiere visibilidad sobre las características específicas de los sistemas agénticos que los distinguen de otros sistemas automatizados.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl md:text-2xl text-foreground mb-1">Propuestas de lege ferenda</h3>
        <p className="text-sm md:text-[0.95rem] text-body/90 italic">
          Carencias del marco normativo vigente y propuestas de desarrollo desde una perspectiva doctrinal centrada en
          la IA agéntica.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {proposals.map((prop) => (
          <div
            key={prop.num}
            className="grid grid-cols-[40px,1fr] gap-4 rounded-sm border border-border bg-card/90 p-4 shadow-sm transition-all hover:shadow-md"
            style={{ borderLeft: `4px solid ${prop.color}` }}
          >
            <div className="flex items-start justify-center text-2xl font-serif" style={{ color: prop.color }}>
              {prop.num}
            </div>
            <div>
              <p className="font-serif text-[0.95rem] font-semibold text-foreground mb-2">{prop.title}</p>
              <p className="text-sm text-body/90 leading-relaxed mb-3">{prop.desc}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: prop.color }}>
                Fundamento
              </p>
              <p className="mt-1 border-l border-border/60 pl-3 text-xs text-body/90 italic leading-relaxed">
                {prop.fundamento}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "instrumentos", label: "Marco normativo", Component: SecInstrumentos },
  { id: "interacciones", label: "Interacciones", Component: SecInteracciones },
  { id: "calendario", label: "Calendario", Component: SecCalendario },
  { id: "obligaciones", label: "Obligaciones por actor", Component: SecObligaciones },
  { id: "ferenda", label: "De lege ferenda", Component: SecLegeFerenda },
];

export default function NormativaIA() {
  return (
    <section className="section-spacing border-t border-border/40 bg-muted/20">
      <div className="container-wide">
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-caption mb-2">
            Complemento normativo · Artículo doctrinal
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground">
            Marco jurídico aplicable a la IA agéntica
          </h2>
          <p className="mt-2 text-sm md:text-base text-body">
            RGPD, Reglamento (UE) 2024/1689 de Inteligencia Artificial, LOPDGDD, soft law europeo y propuestas de
            desarrollo legislativo, alineados con el análisis doctrinal del artículo.
          </p>
        </div>

        <Tabs defaultValue="instrumentos" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-2 overflow-x-auto">
            {SECTIONS.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="text-[11px] tracking-[0.16em] uppercase">
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 space-y-6">
            {SECTIONS.map((section) => (
              <TabsContent key={section.id} value={section.id} className="mt-0">
                <section.Component />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
