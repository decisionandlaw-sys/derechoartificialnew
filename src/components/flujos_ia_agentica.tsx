"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const NAVY2 = "#132340";
const NAVY3 = "#1A2F52";
const GOLD = "#C9A245";
const GOLD2 = "#E8C870";
const WHITE = "#F4F1EB";
const SILVER = "#8A9BB5";
const RED = "#C0392B";
const GREEN = "#1A6B3C";

const FLOW_TABS = [
  { id: "1", label: "I · Mutación del tratamiento" },
  { id: "2", label: "II · Marco operativo" },
  { id: "3", label: "III · Riesgos estructurales" },
  { id: "4", label: "IV · Supervisión humana" },
  { id: "5", label: "V · Cinco pilares" },
];

function Diagram1() {
  const linear = [
    { label: "Entrada", text: "Instrucción puntual del usuario." },
    { label: "Procesamiento", text: "Operación única predefinida sobre datos estructurados." },
    { label: "Salida", text: "Resultado determinista e identificable." },
  ];

  const agentic = [
    { label: "Objetivo", text: "Meta compleja con subtareas dinámicas." },
    { label: "Planificación autónoma", text: "Cadena de razonamiento, subtareas y herramientas." },
    { label: "Memoria persistente", text: "Integración de contexto entre sesiones y finalidades." },
    { label: "Interacción externa", text: "Invocación de APIs, servicios y bases de datos de terceros." },
    { label: "Reevaluación", text: "Ajuste dinámico de la planificación en tiempo real." },
    { label: "Ejecución continua", text: "Resultado emergente no totalmente previsible." },
  ];

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-caption">Flujo 01</p>
      <h2 className="font-serif text-xl md:text-2xl text-foreground">
        Mutación estructural del tratamiento de datos
      </h2>
      <p className="text-sm md:text-[0.95rem] text-body/90 italic">
        Del modelo lineal-reactivo al ecosistema agéntico distribuido.
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr),auto,minmax(0,1fr)] items-start">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700">
            <svg width="14" height="14" viewBox="0 0 14 14" className="text-amber-700">
              <rect
                x="1"
                y="1"
                width="12"
                height="12"
                rx="2"
                fill="none"
                stroke={GOLD}
                strokeWidth="1.5"
              />
              <line x1="7" y1="4" x2="7" y2="10" stroke={GOLD} strokeWidth="1.5" />
              <line x1="4" y1="7" x2="10" y2="7" stroke={GOLD} strokeWidth="1.5" />
            </svg>
            Tratamiento convencional
          </div>
          {linear.map((n, index) => (
            <div key={n.label}>
              <div className="rounded-sm border border-border bg-card/90 p-3 mb-2 transition-colors hover:border-amber-400">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-700 mb-1">{n.label}</p>
                <p className="text-xs sm:text-sm text-body/90 leading-relaxed">{n.text}</p>
              </div>
              {index < linear.length - 1 && (
                <div className="text-center text-amber-600 text-lg opacity-60 mb-2 w-full">
                  ↓
                </div>
              )}
            </div>
          ))}
          <div className="mt-4 rounded-sm border border-emerald-200 bg-emerald-50/80 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700 mb-1">
              Perfil de riesgo
            </p>
            <p className="text-xs text-slate-800 leading-relaxed">
              Perímetro estático, trazabilidad directa, finalidad delimitada y supervisión factible.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center">
          <span className="font-serif text-3xl font-semibold uppercase tracking-[0.4em]" style={{ color: GOLD }}>
            vs
          </span>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: GOLD2 }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6" fill="none" stroke={GOLD2} strokeWidth="1.5" />
              <path
                d="M4 7 Q7 3 10 7 Q7 11 4 7"
                fill="none"
                stroke={GOLD2}
                strokeWidth="1.2"
              />
              <circle cx="7" cy="7" r="1.5" fill={GOLD2} />
            </svg>
            IA agéntica
          </div>
          {agentic.map((n, index) => (
            <div key={n.label}>
              <div className="rounded-sm border border-border bg-card/90 p-3 mb-2 transition-colors hover:border-amber-400">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.16em] mb-1"
                  style={{ color: GOLD2 }}
                >
                  {n.label}
                </p>
                <p className="text-xs sm:text-sm text-body/90 leading-relaxed">{n.text}</p>
              </div>
              {index < agentic.length - 1 && (
                <div className="text-center text-amber-600 text-lg opacity-60 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">↓</div>
              )}
            </div>
          ))}
          <div className="mt-4 rounded-sm border border-red-200 bg-red-50/80 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-700 mb-1">
              Perfil de riesgo intensificado
            </p>
            <p className="text-xs text-slate-800 leading-relaxed">
              Perímetro dinámico, flujos invisibles, memoria acumulativa, finalidad potencialmente expansiva y
              supervisión compleja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Diagram2() {
  const phases = [
    {
      num: "Fase I",
      title: "Cartografía arquitectónica",
      color: "#3A6EA8",
      items: [
        "Identificación de todos los agentes del sistema.",
        "Descripción de cadenas de razonamiento posibles.",
        "Inventario de herramientas externas y condiciones de acceso.",
        "Mapeo de tipos de memoria persistente y características operativas.",
      ],
    },
    {
      num: "Fase II",
      title: "Evaluación estructural de riesgos",
      color: GOLD,
      items: [
        "Análisis del riesgo de ampliación funcional.",
        "Evaluación del riesgo de acumulación longitudinal.",
        "Identificación de irreversibilidades operativas.",
        "Valoración de la opacidad distribuida en sistemas multiagente.",
      ],
    },
    {
      num: "Fase III",
      title: "Diseño de controles técnicos y organizativos",
      color: "#4A9E6A",
      items: [
        "Segmentación de memoria por finalidad.",
        "Implementación de registro automático de decisiones.",
        "Establecimiento de umbrales de validación humana.",
        "Control de versiones y monitorización continua.",
      ],
    },
    {
      num: "Fase IV",
      title: "Revisión adaptativa periódica",
      color: "#8E6DB0",
      items: [
        "Auditoría del funcionamiento real del sistema.",
        "Análisis de desviaciones respecto a parámetros.",
        "Actualización de la evaluación de riesgos.",
        "Ajuste de arquitectura cuando sea necesario.",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-caption">Flujo 02</p>
      <h2 className="font-serif text-xl md:text-2xl text-foreground">
        Marco operativo de gobernanza dinámica
      </h2>
      <p className="text-sm md:text-[0.95rem] text-body/90 italic">
        Ciclo iterativo de cuatro fases para sistemas agénticos, alineado con el art. 25 RGPD.
      </p>

      <div className="mb-4 flex flex-col items-center justify-center gap-2 rounded-sm border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>
          Ciclo iterativo continuo
        </span>
        <span className="text-lg" style={{ color: GOLD }}>
          ⟳
        </span>
        <span className="text-[11px] text-slate-800 italic">
          La evaluación se actualiza ante cada cambio arquitectónico relevante.
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {phases.map((p, index) => (
          <div
            key={p.num}
            className="relative rounded-sm border border-border bg-card/90 p-4 shadow-sm"
          >
            <div
              className="pointer-events-none absolute right-3 top-1 text-6xl font-serif font-bold opacity-[0.06]"
              style={{ color: p.color }}
            >
              {index + 1}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: p.color }}>
              {p.num}
            </p>
            <p className="font-serif text-[0.95rem] font-semibold text-foreground mb-2">{p.title}</p>
            <ul className="space-y-1 text-sm text-body/90">
              {p.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-xs" style={{ color: p.color }}>
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-2 flex items-center justify-center text-[11px] font-mono uppercase tracking-[0.2em] text-caption">
          Fase IV retroalimenta Fase I · la gobernanza es un proceso vivo
        </div>
      </div>
    </div>
  );
}

function Diagram3() {
  const risks = [
    {
      num: "Riesgo 01",
      title: "Ampliación funcional",
      color: "#E67E22",
      icon: "⤢",
      desc: "La planificación autónoma puede conducir a la ejecución de acciones no previstas explícitamente, accediendo a fuentes adicionales y desbordando la finalidad declarada.",
      tags: ["Exceso de finalidad", "Acceso no previsto", "Herramientas no anticipadas"],
    },
    {
      num: "Riesgo 02",
      title: "Acumulación longitudinal",
      color: RED,
      icon: "⏳",
      desc: "La memoria persistente introduce perfilado progresivo no declarado, reutilización transversal de datos e integración de contextos que el interesado considera separados.",
      tags: ["Perfilado implícito", "Retención indefinida", "Contaminación contextual"],
    },
    {
      num: "Riesgo 03",
      title: "Opacidad distribuida",
      color: "#7D3C98",
      icon: "◈",
      desc: "En arquitecturas multiagente, la cadena de razonamiento fragmentada genera dificultades de trazabilidad y problemas de reproducibilidad que comprometen la rendición de cuentas.",
      tags: ["Caja negra operativa", "No reproducibilidad", "Auditoría comprometida"],
    },
    {
      num: "Riesgo 04",
      title: "Irreversibilidad operativa",
      color: "#1A6B8A",
      icon: "⚑",
      desc: "Acciones externas ejecutadas autónomamente pueden generar consecuencias que la intervención humana ex post no puede corregir completamente.",
      tags: ["Daño materializado", "Corrección incompleta", "Acción unilateral externa"],
    },
  ];

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-caption">Flujo 03</p>
      <h2 className="font-serif text-xl md:text-2xl text-foreground">
        Los cuatro riesgos estructurales de la IA agéntica
      </h2>
      <p className="text-sm md:text-[0.95rem] text-body/90 italic">
        Categorías de riesgo inherentes a la arquitectura, no dependientes del contenido concreto de los datos.
      </p>

      <div className="mb-4 flex items-start gap-3 rounded-sm border border-amber-200 bg-amber-50/70 px-4 py-3">
        <span className="text-lg">⚠</span>
        <p className="text-[13px] text-slate-900 leading-relaxed">
          El foco ya no se limita a{" "}
          <span className="font-semibold text-slate-900">“qué datos se tratan”</span>. Se desplaza a{" "}
          <span className="font-semibold text-slate-900">“cómo se tratan”</span> y{" "}
          <span className="font-semibold text-slate-900">“cómo puede evolucionar ese tratamiento”.</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {risks.map((r) => (
          <div
            key={r.num}
            className="relative rounded-sm border bg-card/90 p-4 shadow-sm transition-all hover:translate-x-1 hover:shadow-md"
            style={{ borderLeft: `4px solid ${r.color}` }}
          >
            <span className="mb-2 block text-2xl" style={{ color: r.color }}>
              {r.icon}
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: r.color }}>
              {r.num}
            </p>
            <p className="font-serif text-[0.95rem] font-semibold text-foreground mb-2">{r.title}</p>
            <p className="text-sm text-body/90 leading-relaxed mb-3">{r.desc}</p>
            <div className="flex flex-wrap gap-2">
              {r.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-slate-900/5 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.08em] text-caption"
                  style={{ borderLeft: `2px solid ${r.color}` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-amber-200/70 pt-3 text-xs text-body/90 italic leading-relaxed">
        <span className="font-mono text-[10px] tracking-[0.16em] text-amber-700 not-italic">Principio ↗</span>{" "}
        La proporcionalidad de los controles debe calibrarse en función de la intensidad de cada categoría de riesgo en
        el caso concreto, no solo del tipo de dato tratado.
      </div>
    </div>
  );
}

function Diagram4() {
  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-caption">Flujo 04</p>
      <h3 className="font-serif text-xl md:text-2xl text-foreground">
        Supervisión humana: del control formal al control sustantivo
      </h3>
      <p className="text-sm md:text-[0.95rem] text-body/90 italic">
        Árbol de decisión para la validación humana en sistemas agénticos.
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="flex-1 rounded-sm border px-4 py-3 text-sm leading-relaxed"
            style={{ backgroundColor: NAVY3, borderColor: "rgba(201,162,69,0.5)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: GOLD }}>
              Acción identificada
            </p>
            <p className="text-[13px]" style={{ color: WHITE }}>
              El agente propone o inicia una operación.
            </p>
          </div>
        </div>

        <div className="text-center text-amber-600 text-lg opacity-60 mb-2 w-full">
          ↓
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex-1 rounded-sm border px-4 py-4 text-sm leading-relaxed"
            style={{
              backgroundColor: "rgba(201,162,69,0.08)",
              borderColor: "rgba(201,162,69,0.4)",
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: GOLD }}>
              Evaluación de umbral
            </p>
            <p className="text-[13px]" style={{ color: WHITE }}>
              ¿La acción supera el umbral de intervención humana?
            </p>
            <p className="mt-1 text-[11px] italic" style={{ color: SILVER }}>
              Impacto, sensibilidad, irreversibilidad e incertidumbre.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),auto,minmax(0,1fr)] items-start mt-2">
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: GREEN }}>
              No → ejecución automática
            </p>
            <div
              className="rounded-sm border px-3 py-3 text-xs leading-relaxed"
              style={{
                borderColor: "rgba(26,107,60,0.5)",
                backgroundColor: "rgba(26,107,60,0.08)",
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: GREEN }}>
                Parámetros dentro de rango
              </p>
              <p className="text-[13px]" style={{ color: WHITE }}>
                El agente propone o inicia una operación.
              </p>
            </div>
            <div className="text-center text-green-600 text-base w-full">
              ↓
            </div>
            <div
              className="rounded-sm border px-3 py-3 text-xs leading-relaxed"
              style={{
                borderColor: "rgba(26,107,60,0.4)",
                backgroundColor: "rgba(26,107,60,0.06)",
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: GREEN }}>
                Supervisión ex post
              </p>
              <p style={{ color: WHITE }}>Revisión periódica de registros y patrones.</p>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="h-24 w-px bg-amber-200/60" />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: RED }}>
              Sí → validación requerida
            </p>
            <div
              className="rounded-sm border px-3 py-3 text-xs leading-relaxed"
              style={{
                borderColor: "rgba(192,57,43,0.5)",
                backgroundColor: "rgba(192,57,43,0.08)",
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "#E57373" }}>
                Punto de fricción deliberado
              </p>
              <p style={{ color: WHITE }}>El sistema pausa y solicita validación humana.</p>
              <p className="mt-1 text-[11px] italic" style={{ color: SILVER }}>
                El humano debe comprender la lógica del proceso.
              </p>
            </div>
            <div className="text-center text-red-600 text-base w-full">
              ↓
            </div>
            <div
              className="rounded-sm border px-3 py-3 text-xs leading-relaxed"
              style={{
                borderColor: "rgba(192,57,43,0.4)",
                backgroundColor: "rgba(192,57,43,0.06)",
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "#E57373" }}>
                ¿El humano aprueba?
              </p>
              <p style={{ color: WHITE }}>Evaluación informada con acceso a registros completos.</p>
            </div>

            <div className="grid gap-2 md:grid-cols-2 mt-2">
              <div
                className="rounded-sm border px-3 py-2 text-xs leading-relaxed"
                style={{
                  borderColor: "rgba(26,107,60,0.5)",
                  backgroundColor: "rgba(26,107,60,0.08)",
                }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] mb-1" style={{ color: GREEN }}>
                  Aprueba
                </p>
                <p style={{ color: WHITE }}>Ejecución autorizada con registro de aprobación.</p>
              </div>
              <div
                className="rounded-sm border px-3 py-2 text-xs leading-relaxed"
                style={{
                  borderColor: "rgba(192,57,43,0.5)",
                  backgroundColor: "rgba(192,57,43,0.08)",
                }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] mb-1" style={{ color: RED }}>
                  Rechaza / modifica
                </p>
                <p style={{ color: WHITE }}>Corrección de parámetros o interrupción de la ejecución.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            {
              label: "Trazabilidad",
              text: "Todo resultado, automático o validado, queda registrado con timestamp y parámetros activos.",
            },
            {
              label: "Documentación",
              text: "La supervisión debe ser demostrable. Lo no verificable carece de fuerza jurídica.",
            },
            {
              label: "Gobernanza adaptativa",
              text: "Los umbrales se revisan periódicamente a medida que evoluciona la capacidad del sistema.",
            },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-sm border bg-card/90 px-3 py-3 text-xs leading-relaxed"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: GOLD }}>
                {c.label}
              </p>
              <p className="text-[12px] text-body/90">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Diagram5() {
  const [active, setActive] = useState<number | null>(null);

  const pillars = [
    {
      num: "I",
      title: "Delimitación estructural",
      color: "#3A6EA8",
      desc: "Las herramientas accesibles, la capacidad de almacenamiento y las rutas de planificación deben estar técnicamente limitadas. La finalidad no puede depender solo de declaraciones formales.",
      height: 220,
    },
    {
      num: "II",
      title: "Trazabilidad integral",
      color: "#4A9E6A",
      desc: "Cada fase debe ser registrable, reconstruible, auditable y versionada. La cadena de razonamiento no puede operar como caja negra.",
      height: 240,
    },
    {
      num: "III",
      title: "Memoria controlada",
      color: GOLD,
      desc: "Criterios explícitos de incorporación, límites temporales, supresión selectiva y diferenciación entre datos originales e inferencias del sistema.",
      height: 260,
    },
    {
      num: "IV",
      title: "Intervención humana sustantiva",
      color: "#C0876A",
      desc: "Umbrales de validación operativos, puntos de interrupción técnicos, revisión periódica y formación especializada de los equipos supervisores.",
      height: 240,
    },
    {
      num: "V",
      title: "Evaluación iterativa",
      color: "#8E6DB0",
      desc: "La evaluación de riesgos debe actualizarse ante cada cambio arquitectónico: nuevas herramientas, ampliación de memoria, modificación de parámetros o incremento de autonomía.",
      height: 220,
    },
  ];

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-caption">Flujo 05</p>
      <h2 className="font-serif text-xl md:text-2xl text-foreground">
        Los cinco pilares de la gobernanza arquitectónica
      </h2>
      <p className="text-sm md:text-[0.95rem] text-body/90 italic">
        Modelo de cumplimiento integrado desde el diseño: compliance by architecture.
      </p>

      <div className="space-y-4">
        <div
          className="rounded-t-sm border border-border bg-card/90 px-4 py-3 text-center"
          style={{ borderBottomWidth: 3, borderBottomColor: GOLD }}
        >
          <p className="font-serif text-[1rem] font-semibold text-foreground">
            Gobernanza arquitectónica de la IA agéntica
          </p>
          <p className="mt-1 text-[12px] text-body/90 italic">
            El cumplimiento no se superpone a la arquitectura: debe penetrar en ella.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-5 items-end">
          {pillars.map((p, index) => {
            const isActive = active === index;
            return (
              <button
                key={p.num}
                type="button"
                onClick={() => setActive(isActive ? null : index)}
                className="flex flex-col items-center transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Pilar ${p.num}: ${p.title}`}
              >
                <div
                  className="w-full rounded-t-sm"
                  style={{ backgroundColor: p.color, height: 6 }}
                />
                <div
                  className="flex w-full flex-col justify-start rounded-b-sm border px-3 py-3"
                  style={{
                    height: p.height,
                    backgroundColor: isActive ? NAVY3 : NAVY2,
                    borderColor: isActive ? p.color : "rgba(201,162,69,0.25)",
                  }}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: p.color }}>
                    Pilar {p.num}
                  </p>
                  <p className="font-serif text-[0.85rem] font-semibold mb-2" style={{ color: WHITE }}>
                    {p.title}
                  </p>
                  <p
                    className="text-[11px] leading-snug"
                    style={{ color: isActive ? SILVER : "#5A6B85" }}
                  >
                    {p.desc}
                  </p>
                </div>
                <div
                  className="mt-0.5 h-1 w-[115%]"
                  style={{ backgroundColor: p.color, opacity: 0.2 }}
                />
              </button>
            );
          })}
        </div>

        <div
          className="flex items-center justify-between rounded-b-sm border border-border bg-card/90 px-4 py-3"
          style={{ borderTopWidth: 3, borderTopColor: "rgba(201,162,69,0.5)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>
            Art. 25 RGPD · Privacy by design
          </span>
          <span className="text-[12px] text-body/90 italic">
            La arquitectura como objeto de regulación.
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>
            Reglamento IA 2024/1689
          </span>
        </div>

        {active !== null && (
          <div
            className="rounded-sm border px-4 py-3 text-sm leading-relaxed"
            style={{
              borderColor: pillars[active].color,
              backgroundColor: NAVY3,
            }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: pillars[active].color }}
            >
              Pilar {pillars[active].num} — {pillars[active].title}
            </p>
            <p style={{ color: WHITE }}>{pillars[active].desc}</p>
          </div>
        )}

        <div className="text-center">
          <p className="font-mono text-[9px] text-caption tracking-[0.16em]">
            {active === null
              ? "Clic sobre cualquier pilar para ver detalle."
              : "Clic de nuevo sobre el pilar para colapsar."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FlujosIA() {
  return (
    <section className="section-spacing border-t border-border/40">
      <div className="container-wide">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
          Flujos de datos y gobernanza en IA agéntica
        </h2>
        <p className="text-sm md:text-base text-body mb-6">
          Visualiza los flujos clave que deben mapearse en cualquier proyecto de IA agéntica para poder justificar el
          cumplimiento de RGPD, AI Act y LOPDGDD ante autoridades de control y auditorías internas.
        </p>

        <Tabs defaultValue="1" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-2 overflow-x-auto">
            {FLOW_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-[11px] tracking-[0.16em] uppercase">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 space-y-6">
            <TabsContent value="1" className="mt-0">
              <Diagram1 />
            </TabsContent>
            <TabsContent value="2" className="mt-0">
              <Diagram2 />
            </TabsContent>
            <TabsContent value="3" className="mt-0">
              <Diagram3 />
            </TabsContent>
            <TabsContent value="4" className="mt-0">
              <Diagram4 />
            </TabsContent>
            <TabsContent value="5" className="mt-0">
              <Diagram5 />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
