import { useState, useEffect, useRef } from "react";

const NAVY = "#0D1B2E";
const NAVY2 = "#132340";
const NAVY3 = "#1A2F52";
const GOLD = "#C9A245";
const GOLD2 = "#E8C870";
const WHITE = "#F4F1EB";
const SILVER = "#8A9BB5";
const RED = "#C0392B";
const GREEN = "#1A6B3C";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
  
  * { box-sizing: border-box; }
  
  body { margin: 0; background: ${NAVY}; }
  
  .app {
    font-family: 'Crimson Pro', Georgia, serif;
    background: ${NAVY};
    min-height: 100vh;
    color: ${WHITE};
    overflow-x: hidden;
  }

  .header {
    padding: 32px 40px 24px;
    border-bottom: 1px solid rgba(201,162,69,0.3);
    position: relative;
  }

  .header::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${GOLD}, ${GOLD2}, ${GOLD});
  }

  .header-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    color: ${GOLD};
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 600;
    color: ${WHITE};
    line-height: 1.3;
    margin: 0;
  }

  .header-sub {
    font-family: 'Crimson Pro', serif;
    font-size: 14px;
    color: ${SILVER};
    font-style: italic;
    margin-top: 4px;
  }

  .tabs {
    display: flex;
    padding: 0 40px;
    border-bottom: 1px solid rgba(138,155,181,0.2);
    overflow-x: auto;
    gap: 0;
  }

  .tab {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 14px 18px;
    cursor: pointer;
    color: ${SILVER};
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: all 0.2s;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .tab:hover { color: ${WHITE}; }

  .tab.active {
    color: ${GOLD};
    border-bottom: 2px solid ${GOLD};
  }

  .content {
    padding: 40px;
  }

  /* ── Diagram 1: Linear vs Agéntico ── */
  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr 60px 1fr;
    gap: 0;
    align-items: start;
  }

  .diagram-label {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 600;
    color: ${GOLD};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .node {
    background: ${NAVY2};
    border: 1px solid rgba(201,162,69,0.25);
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 10px;
    position: relative;
    transition: all 0.25s;
  }

  .node:hover {
    border-color: ${GOLD};
    background: ${NAVY3};
  }

  .node-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${GOLD};
    margin-bottom: 4px;
  }

  .node-text {
    font-family: 'Crimson Pro', serif;
    font-size: 13px;
    color: ${WHITE};
    line-height: 1.4;
  }

  .node.risk {
    border-color: rgba(192,57,43,0.4);
    background: rgba(192,57,43,0.08);
  }

  .node.risk:hover { border-color: ${RED}; }

  .arrow-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 50px;
  }

  .vs-badge {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: ${GOLD};
    opacity: 0.7;
    writing-mode: vertical-rl;
    letter-spacing: 4px;
  }

  /* ── Diagram 2: 4 Fases Operativas ── */
  .phases-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    max-width: 900px;
    margin: 0 auto;
  }

  .phase-card {
    background: ${NAVY2};
    border: 1px solid rgba(201,162,69,0.2);
    border-radius: 10px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }

  .phase-card:hover {
    border-color: ${GOLD};
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }

  .phase-card::before {
    content: attr(data-num);
    position: absolute;
    right: -10px;
    top: -15px;
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    font-weight: 700;
    color: rgba(201,162,69,0.06);
    line-height: 1;
  }

  .phase-num {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: ${GOLD};
    text-transform: uppercase;
  }

  .phase-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 600;
    color: ${WHITE};
    margin: 8px 0 14px;
  }

  .phase-items {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .phase-item {
    font-family: 'Crimson Pro', serif;
    font-size: 13px;
    color: ${SILVER};
    padding: 5px 0 5px 16px;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    line-height: 1.4;
  }

  .phase-item::before {
    content: '→';
    position: absolute;
    left: 0;
    color: ${GOLD};
    font-size: 11px;
  }

  .phase-connector {
    text-align: center;
    grid-column: 1 / -1;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    color: ${GOLD};
    opacity: 0.5;
    padding: 4px;
  }

  /* ── Diagram 3: 4 Riesgos Estructurales ── */
  .risks-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    max-width: 900px;
    margin: 0 auto;
  }

  .risk-card {
    background: ${NAVY2};
    border-radius: 10px;
    padding: 24px;
    border-left: 4px solid;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }

  .risk-card:hover {
    transform: translateX(4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  }

  .risk-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%);
    pointer-events: none;
  }

  .risk-icon {
    font-size: 28px;
    margin-bottom: 12px;
    display: block;
  }

  .risk-num {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.6;
    margin-bottom: 6px;
  }

  .risk-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 600;
    color: ${WHITE};
    margin-bottom: 10px;
  }

  .risk-desc {
    font-family: 'Crimson Pro', serif;
    font-size: 13px;
    color: ${SILVER};
    line-height: 1.55;
    margin-bottom: 14px;
  }

  .risk-effects {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .risk-tag {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.5px;
    padding: 3px 8px;
    border-radius: 20px;
    background: rgba(255,255,255,0.07);
    color: ${SILVER};
    text-transform: uppercase;
  }

  /* ── Diagram 4: Supervisión y Umbrales ── */
  .flow-container {
    max-width: 820px;
    margin: 0 auto;
  }

  .flow-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .flow-box {
    flex: 1;
    background: ${NAVY2};
    border: 1px solid rgba(201,162,69,0.2);
    border-radius: 8px;
    padding: 14px 18px;
    transition: all 0.25s;
  }

  .flow-box:hover { border-color: ${GOLD}; }

  .flow-box.decision {
    background: rgba(201,162,69,0.08);
    border-color: rgba(201,162,69,0.4);
    clip-path: polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%);
    padding: 14px 28px;
    text-align: center;
  }

  .flow-box.ok {
    border-color: rgba(26,107,60,0.5);
    background: rgba(26,107,60,0.08);
  }

  .flow-box.alert {
    border-color: rgba(192,57,43,0.5);
    background: rgba(192,57,43,0.08);
  }

  .flow-arrow {
    color: ${GOLD};
    font-size: 18px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .flow-label {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .flow-text {
    font-family: 'Crimson Pro', serif;
    font-size: 13px;
    color: ${WHITE};
    line-height: 1.4;
  }

  .flow-sub {
    font-family: 'Crimson Pro', serif;
    font-size: 11px;
    color: ${SILVER};
    font-style: italic;
    margin-top: 3px;
  }

  .flow-vertical-arrow {
    text-align: center;
    color: ${GOLD};
    font-size: 20px;
    opacity: 0.6;
    margin: 2px 0;
    margin-left: 40px;
  }

  .flow-branch {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 16px;
    align-items: start;
    margin-top: 8px;
  }

  .branch-label {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    letter-spacing: 1px;
    color: ${GOLD};
    opacity: 0.7;
    margin-bottom: 6px;
    text-align: center;
  }

  /* ── Diagram 5: 5 Pilares ── */
  .pillars-wrap {
    max-width: 960px;
    margin: 0 auto;
  }

  .pillars-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    align-items: end;
  }

  .pillar {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }

  .pillar:hover .pillar-body { transform: translateY(-6px); }

  .pillar-top {
    width: 100%;
    background: ${GOLD};
    border-radius: 4px 4px 0 0;
    height: 6px;
    margin-bottom: 0;
  }

  .pillar-body {
    width: 100%;
    border-radius: 0 0 6px 6px;
    padding: 18px 12px;
    text-align: center;
    transition: all 0.3s;
    border: 1px solid rgba(201,162,69,0.2);
    border-top: none;
    position: relative;
    overflow: hidden;
  }

  .pillar-body::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(180deg, rgba(201,162,69,0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  .pillar-num {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    letter-spacing: 2px;
    color: ${GOLD};
    margin-bottom: 10px;
  }

  .pillar-title {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    font-weight: 700;
    color: ${WHITE};
    margin-bottom: 10px;
    line-height: 1.3;
  }

  .pillar-desc {
    font-family: 'Crimson Pro', serif;
    font-size: 11.5px;
    color: ${SILVER};
    line-height: 1.5;
  }

  .pillar-base {
    width: calc(100% + 24px);
    height: 4px;
    background: rgba(201,162,69,0.15);
    margin-top: 0;
  }

  .arch-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${GOLD};
    text-align: center;
    margin-top: 24px;
    padding-top: 12px;
    border-top: 1px solid rgba(201,162,69,0.3);
  }

  /* ── Common ── */
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    color: ${WHITE};
    margin-bottom: 6px;
  }

  .section-sub {
    font-family: 'Crimson Pro', serif;
    font-size: 14px;
    color: ${SILVER};
    font-style: italic;
    margin-bottom: 32px;
  }

  .eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 2.5px;
    color: ${GOLD};
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .connector-line {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,162,69,0.3), transparent);
    margin: 16px 0;
  }

  /* Fade in animation */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-in {
    animation: fadeInUp 0.5s ease forwards;
  }

  .animate-in:nth-child(2) { animation-delay: 0.05s; }
  .animate-in:nth-child(3) { animation-delay: 0.1s; }
  .animate-in:nth-child(4) { animation-delay: 0.15s; }
  .animate-in:nth-child(5) { animation-delay: 0.2s; }
`;

// ─── TAB DEFINITIONS ─────────────────────────────────────────────────────────
const TABS = [
  { id: 1, label: "I · Mutación del Tratamiento" },
  { id: 2, label: "II · Marco Operativo" },
  { id: 3, label: "III · Riesgos Estructurales" },
  { id: 4, label: "IV · Supervisión Humana" },
  { id: 5, label: "V · Cinco Pilares" },
];

// ─── DIAGRAM 1 ───────────────────────────────────────────────────────────────
function Diagram1() {
  const linear = [
    { label: "Entrada", text: "Instrucción puntual del usuario" },
    { label: "Procesamiento", text: "Operación única predefinida sobre datos estructurados" },
    { label: "Salida", text: "Resultado determinista e identificable" },
  ];
  const agentico = [
    { label: "Objetivo", text: "Meta compleja con subtareas dinámicas" },
    { label: "Planificación Autónoma", text: "Cadena de razonamiento → subtareas → herramientas" },
    { label: "Memoria Persistente", text: "Integración de contexto entre sesiones y finalidades" },
    { label: "Interacción Externa", text: "Invocación de APIs, servicios y bases de datos terceros" },
    { label: "Reevaluación", text: "Ajuste dinámico de la planificación en tiempo real" },
    { label: "Ejecución Continua", text: "Resultado emergente no totalmente previsible" },
  ];

  return (
    <div className="animate-in">
      <div className="eyebrow">Flujo 01</div>
      <div className="section-title">Mutación Estructural del Tratamiento de Datos</div>
      <div className="section-sub">Del modelo lineal-reactivo al ecosistema agéntico distribuido</div>

      <div className="comparison-grid">
        {/* LEFT */}
        <div>
          <div className="diagram-label">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <rect x="1" y="1" width="12" height="12" rx="2" fill="none" stroke={GOLD} strokeWidth="1.5"/>
              <line x1="7" y1="4" x2="7" y2="10" stroke={GOLD} strokeWidth="1.5"/>
              <line x1="4" y1="7" x2="10" y2="7" stroke={GOLD} strokeWidth="1.5"/>
            </svg>
            Tratamiento Convencional
          </div>
          {linear.map((n, i) => (
            <div key={i}>
              <div className="node">
                <div className="node-label">{n.label}</div>
                <div className="node-text">{n.text}</div>
              </div>
              {i < linear.length - 1 && (
                <div style={{ textAlign: "center", color: GOLD, fontSize: 18, opacity: 0.5, margin: "2px 0" }}>↓</div>
              )}
            </div>
          ))}
          <div style={{
            marginTop: 20,
            padding: "14px 16px",
            background: "rgba(26,107,60,0.1)",
            border: "1px solid rgba(26,107,60,0.3)",
            borderRadius: 6
          }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 1.5, color: "#4CAF7D", textTransform: "uppercase", marginBottom: 4 }}>
              Perfil de riesgo
            </div>
            <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 12.5, color: SILVER, lineHeight: 1.5 }}>
              Perímetro estático · Trazabilidad directa · Finalidad delimitada · Supervisión factible
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="arrow-col">
          <div className="vs-badge">vs</div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="diagram-label" style={{ color: GOLD2 }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6" fill="none" stroke={GOLD2} strokeWidth="1.5"/>
              <path d="M4 7 Q7 3 10 7 Q7 11 4 7" fill="none" stroke={GOLD2} strokeWidth="1.2"/>
              <circle cx="7" cy="7" r="1.5" fill={GOLD2}/>
            </svg>
            IA Agéntica
          </div>
          {agentico.map((n, i) => (
            <div key={i}>
              <div className="node">
                <div className="node-label" style={{ color: GOLD2 }}>{n.label}</div>
                <div className="node-text">{n.text}</div>
              </div>
              {i < agentico.length - 1 && (
                <div style={{ textAlign: "center", color: GOLD2, fontSize: 18, opacity: 0.5, margin: "2px 0" }}>↓</div>
              )}
            </div>
          ))}
          <div className="node risk" style={{ marginTop: 20 }}>
            <div className="node-label" style={{ color: "#E57373" }}>Perfil de riesgo intensificado</div>
            <div className="node-text" style={{ fontSize: 12.5, color: SILVER, lineHeight: 1.5 }}>
              Perímetro dinámico · Flujos invisibles · Memoria acumulativa · Finalidad potencialmente expansiva · Supervisión compleja
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DIAGRAM 2 ───────────────────────────────────────────────────────────────
function Diagram2() {
  const phases = [
    {
      num: "Fase I",
      title: "Cartografía Arquitectónica",
      color: "#3A6EA8",
      items: [
        "Identificación de todos los agentes del sistema",
        "Descripción de cadenas de razonamiento posibles",
        "Inventario de herramientas externas y condiciones de acceso",
        "Mapeo de tipos de memoria persistente y características operativas",
      ]
    },
    {
      num: "Fase II",
      title: "Evaluación Estructural de Riesgos",
      color: "#C9A245",
      items: [
        "Análisis del riesgo de ampliación funcional",
        "Evaluación del riesgo de acumulación longitudinal",
        "Identificación de irreversibilidades operativas",
        "Valoración de la opacidad distribuida en sistemas multiagente",
      ]
    },
    {
      num: "Fase III",
      title: "Diseño de Controles Técnicos y Organizativos",
      color: "#4A9E6A",
      items: [
        "Segmentación de memoria por finalidad",
        "Implementación de registro automático de decisiones",
        "Establecimiento de umbrales de validación humana",
        "Control de versiones y monitorización continua",
      ]
    },
    {
      num: "Fase IV",
      title: "Revisión Adaptativa Periódica",
      color: "#8E6DB0",
      items: [
        "Auditoría del funcionamiento real del sistema",
        "Análisis de desviaciones respecto a parámetros",
        "Actualización de la evaluación de riesgos",
        "Ajuste de arquitectura cuando sea necesario",
      ]
    },
  ];

  return (
    <div className="animate-in">
      <div className="eyebrow">Flujo 02</div>
      <div className="section-title">Marco Operativo de Gobernanza Dinámica</div>
      <div className="section-sub">Ciclo iterativo de cuatro fases para sistemas agénticos — Art. 25 RGPD</div>

      {/* Cycle indicator */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, marginBottom: 28,
        background: "rgba(201,162,69,0.07)",
        border: "1px solid rgba(201,162,69,0.15)",
        borderRadius: 8, padding: "10px 20px"
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: GOLD }}>
          CICLO ITERATIVO CONTINUO
        </span>
        <span style={{ color: GOLD, fontSize: 16 }}>⟳</span>
        <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: 12, color: SILVER, fontStyle: "italic" }}>
          La evaluación se actualiza ante cada cambio arquitectónico relevante
        </span>
      </div>

      <div className="phases-container">
        {phases.map((p, i) => (
          <div key={i} className="phase-card" data-num={i + 1}
            style={{ borderTop: `3px solid ${p.color}` }}>
            <div className="phase-num" style={{ color: p.color }}>{p.num}</div>
            <div className="phase-title">{p.title}</div>
            <ul className="phase-items">
              {p.items.map((item, j) => (
                <li key={j} className="phase-item" style={{ color: SILVER }}
                  onMouseEnter={e => e.currentTarget.style.color = WHITE}
                  onMouseLeave={e => e.currentTarget.style.color = SILVER}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="phase-connector">
          ↑ · Fase IV retroalimenta Fase I · Gobernanza como proceso vivo · ↑
        </div>
      </div>
    </div>
  );
}

// ─── DIAGRAM 3 ───────────────────────────────────────────────────────────────
function Diagram3() {
  const risks = [
    {
      num: "Riesgo 01",
      title: "Ampliación Funcional",
      color: "#E67E22",
      icon: "⤢",
      desc: "La planificación autónoma puede conducir a la ejecución de acciones no previstas explícitamente, accediendo a fuentes adicionales y desbordando la finalidad declarada.",
      tags: ["Exceso de finalidad", "Acceso no previsto", "Herramientas no anticipadas"],
    },
    {
      num: "Riesgo 02",
      title: "Acumulación Longitudinal",
      color: "#C0392B",
      icon: "⏳",
      desc: "La memoria persistente introduce perfilado progresivo no declarado, reutilización transversal de datos e integración de contextos que el interesado considera separados.",
      tags: ["Perfilado implícito", "Retención indefinida", "Contaminación contextual"],
    },
    {
      num: "Riesgo 03",
      title: "Opacidad Distribuida",
      color: "#7D3C98",
      icon: "◈",
      desc: "En arquitecturas multiagente, la cadena de razonamiento fragmentada genera dificultades de trazabilidad y problemas de reproducibilidad que comprometen la rendición de cuentas.",
      tags: ["Caja negra operativa", "No reproducibilidad", "Auditoría comprometida"],
    },
    {
      num: "Riesgo 04",
      title: "Irreversibilidad Operativa",
      color: "#1A6B8A",
      icon: "⚑",
      desc: "Acciones externas ejecutadas autónomamente pueden generar consecuencias que la intervención humana ex post no puede corregir completamente.",
      tags: ["Daño materializado", "Corrección incompleta", "Acción unilateral externa"],
    },
  ];

  return (
    <div className="animate-in">
      <div className="eyebrow">Flujo 03</div>
      <div className="section-title">Los Cuatro Riesgos Estructurales de la IA Agéntica</div>
      <div className="section-sub">Categorías de riesgo inherentes a la arquitectura — no dependientes del contenido de los datos</div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "rgba(201,162,69,0.06)", border: "1px solid rgba(201,162,69,0.15)",
        borderRadius: 8, padding: "10px 18px", marginBottom: 28
      }}>
        <span style={{ fontSize: 16 }}>⚠</span>
        <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: 13, color: SILVER, lineHeight: 1.5 }}>
          El foco ya no se limita a <em style={{ color: WHITE }}>"¿qué datos se tratan?"</em>. 
          Se desplaza a <em style={{ color: WHITE }}>"¿cómo se tratan?"</em> y <em style={{ color: WHITE }}>"¿cómo puede evolucionar ese tratamiento?"</em>
        </span>
      </div>

      <div className="risks-grid">
        {risks.map((r, i) => (
          <div key={i} className="risk-card" style={{ borderLeftColor: r.color }}>
            <span className="risk-icon" style={{ color: r.color }}>{r.icon}</span>
            <div className="risk-num" style={{ color: r.color }}>{r.num}</div>
            <div className="risk-title">{r.title}</div>
            <div className="risk-desc">{r.desc}</div>
            <div className="risk-effects">
              {r.tags.map((t, j) => (
                <span key={j} className="risk-tag" style={{ borderLeft: `2px solid ${r.color}` }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div style={{
        marginTop: 24, padding: "14px 18px",
        borderTop: "1px solid rgba(201,162,69,0.2)",
        fontFamily: "'Crimson Pro', serif", fontSize: 13, color: SILVER, fontStyle: "italic", lineHeight: 1.6
      }}>
        <span style={{ color: GOLD, fontStyle: "normal", fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 1 }}>PRINCIPIO ↗</span>
        {" "}La proporcionalidad de los controles debe calibrarse en función de la intensidad de cada categoría de riesgo en el caso concreto, no en función del tipo de dato tratado únicamente.
      </div>
    </div>
  );
}

// ─── DIAGRAM 4 ───────────────────────────────────────────────────────────────
function Diagram4() {
  return (
    <div className="animate-in">
      <div className="eyebrow">Flujo 04</div>
      <div className="section-title">Supervisión Humana: Del Control Formal al Control Sustantivo</div>
      <div className="section-sub">Árbol de decisión para la validación humana en sistemas agénticos</div>

      <div className="flow-container">

        {/* START */}
        <div className="flow-row">
          <div className="flow-box" style={{ background: NAVY3, borderColor: "rgba(201,162,69,0.5)", textAlign: "center" }}>
            <div className="flow-label" style={{ color: GOLD }}>Acción identificada</div>
            <div className="flow-text">El agente propone o inicia una operación</div>
          </div>
        </div>

        <div className="flow-vertical-arrow">↓</div>

        {/* DECISION 1 */}
        <div className="flow-row">
          <div className="flow-box decision">
            <div className="flow-label" style={{ color: GOLD }}>Evaluación de umbral</div>
            <div className="flow-text">¿La acción supera el umbral de intervención humana?</div>
            <div className="flow-sub">Impacto · Sensibilidad · Irreversibilidad · Incertidumbre</div>
          </div>
        </div>

        {/* Branch */}
        <div className="flow-branch" style={{ marginTop: 10 }}>
          {/* NO branch */}
          <div>
            <div className="branch-label" style={{ color: "#4CAF7D" }}>NO → Ejecución Automática</div>
            <div className="flow-box ok">
              <div className="flow-label" style={{ color: "#4CAF7D" }}>Parámetros dentro del rango</div>
              <div className="flow-text">El agente ejecuta la acción autónomamente</div>
              <div className="flow-sub">Registro automático obligatorio de la operación</div>
            </div>
            <div style={{ textAlign: "center", color: "#4CAF7D", margin: "8px 0", fontSize: 16 }}>↓</div>
            <div className="flow-box ok">
              <div className="flow-label" style={{ color: "#4CAF7D" }}>Supervisión ex post</div>
              <div className="flow-text">Revisión periódica de registros y patrones</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 20 }}>
            <div style={{ width: 1, height: 120, background: "rgba(201,162,69,0.2)" }}></div>
          </div>

          {/* YES branch */}
          <div>
            <div className="branch-label" style={{ color: RED }}>SÍ → Validación Requerida</div>
            <div className="flow-box alert">
              <div className="flow-label" style={{ color: "#E57373" }}>Punto de fricción deliberado</div>
              <div className="flow-text">El sistema pausa y solicita validación humana</div>
              <div className="flow-sub">El humano debe comprender la lógica del proceso</div>
            </div>
            <div style={{ textAlign: "center", color: RED, margin: "8px 0", fontSize: 16 }}>↓</div>
            <div className="flow-box decision" style={{ clipPath: "none", borderRadius: 8, borderColor: "rgba(192,57,43,0.4)", background: "rgba(192,57,43,0.06)" }}>
              <div className="flow-label" style={{ color: "#E57373" }}>¿El humano aprueba?</div>
              <div className="flow-text">Evaluación informada con acceso a registros completos</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              <div>
                <div className="branch-label" style={{ color: "#4CAF7D", fontSize: 7 }}>APRUEBA</div>
                <div className="flow-box ok" style={{ padding: "10px 12px" }}>
                  <div className="flow-text" style={{ fontSize: 12 }}>Ejecución autorizada con registro de aprobación</div>
                </div>
              </div>
              <div>
                <div className="branch-label" style={{ color: RED, fontSize: 7 }}>RECHAZA / MODIFICA</div>
                <div className="flow-box alert" style={{ padding: "10px 12px" }}>
                  <div className="flow-text" style={{ fontSize: 12 }}>Corrección de parámetros o interrupción de ejecución</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="connector-line" style={{ marginTop: 20 }}></div>

        {/* Bottom row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 4
        }}>
          {[
            { label: "Trazabilidad", text: "Todo resultado —automático o validado— queda registrado con timestamp y parámetros activos" },
            { label: "Documentación", text: "La supervisión debe ser demostrable. Lo no verificable carece de fuerza jurídica" },
            { label: "Gobernanza Adaptativa", text: "Los umbrales se revisan periódicamente conforme evoluciona la capacidad del sistema" },
          ].map((c, i) => (
            <div key={i} style={{
              background: NAVY2, borderRadius: 8, padding: "12px 14px",
              borderTop: `2px solid ${GOLD}`, opacity: 0.85
            }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 1.5, color: GOLD, marginBottom: 6 }}>
                {c.label}
              </div>
              <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 12, color: SILVER, lineHeight: 1.5 }}>
                {c.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DIAGRAM 5 ───────────────────────────────────────────────────────────────
function Diagram5() {
  const [active, setActive] = useState(null);

  const pillars = [
    {
      num: "I",
      title: "Delimitación Estructural",
      color: "#3A6EA8",
      desc: "Las herramientas accesibles, la capacidad de almacenamiento y las rutas de planificación deben estar técnicamente limitadas. La finalidad no puede depender solo de declaraciones formales.",
      height: 220,
    },
    {
      num: "II",
      title: "Trazabilidad Integral",
      color: "#4A9E6A",
      desc: "Cada fase debe ser registrable, reconstruible, auditable y versionada. La cadena de razonamiento no puede operar como caja negra.",
      height: 240,
    },
    {
      num: "III",
      title: "Memoria Controlada",
      color: GOLD,
      desc: "Criterios explícitos de incorporación, límites temporales, supresión selectiva y diferenciación entre datos originales e inferencias del sistema.",
      height: 260,
    },
    {
      num: "IV",
      title: "Intervención Humana Sustantiva",
      color: "#C0876A",
      desc: "Umbrales de validación operativos, puntos de interrupción técnicos, revisión periódica y formación especializada de los equipos supervisores.",
      height: 240,
    },
    {
      num: "V",
      title: "Evaluación Iterativa",
      color: "#8E6DB0",
      desc: "La evaluación de riesgos debe actualizarse ante cada cambio arquitectónico: nuevas herramientas, ampliación de memoria, modificación de parámetros o incremento de autonomía.",
      height: 220,
    },
  ];

  return (
    <div className="animate-in">
      <div className="eyebrow">Flujo 05</div>
      <div className="section-title">Los Cinco Pilares de la Gobernanza Arquitectónica</div>
      <div className="section-sub">Modelo de cumplimiento integrado desde el diseño — Compliance by Architecture</div>

      <div className="pillars-wrap">

        {/* Entablature */}
        <div style={{
          background: NAVY3, border: "1px solid rgba(201,162,69,0.3)",
          borderRadius: "8px 8px 0 0", padding: "16px 24px", textAlign: "center",
          borderBottom: `3px solid ${GOLD}`, marginBottom: 0
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: WHITE }}>
            Gobernanza Arquitectónica de la IA Agéntica
          </div>
          <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 12, color: SILVER, fontStyle: "italic", marginTop: 4 }}>
            El cumplimiento no se superpone a la arquitectura · debe penetrar en ella
          </div>
        </div>

        {/* Pillars */}
        <div className="pillars-grid" style={{ alignItems: "end" }}>
          {pillars.map((p, i) => (
            <div
              key={i}
              className="pillar"
              onClick={() => setActive(active === i ? null : i)}
              style={{ cursor: "pointer" }}
            >
              <div className="pillar-top" style={{ background: p.color }}></div>
              <div
                className="pillar-body"
                style={{
                  height: p.height,
                  background: active === i ? NAVY3 : NAVY2,
                  borderColor: active === i ? p.color : "rgba(201,162,69,0.2)",
                  borderLeft: `1px solid ${active === i ? p.color : "rgba(201,162,69,0.2)"}`,
                  borderRight: `1px solid ${active === i ? p.color : "rgba(201,162,69,0.2)"}`,
                  borderBottom: `1px solid ${active === i ? p.color : "rgba(201,162,69,0.2)"}`,
                  justifyContent: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="pillar-num" style={{ color: p.color }}>Pilar {p.num}</div>
                <div className="pillar-title">{p.title}</div>
                <div className="pillar-desc" style={{ fontSize: active === i ? 12 : 11, color: active === i ? SILVER : "#5A6B85" }}>
                  {p.desc}
                </div>
              </div>
              <div className="pillar-base" style={{ background: p.color, opacity: 0.2, width: "100%" }}></div>
            </div>
          ))}
        </div>

        {/* Stylobate / base */}
        <div style={{
          background: `linear-gradient(180deg, ${NAVY3} 0%, ${NAVY2} 100%)`,
          border: "1px solid rgba(201,162,69,0.2)",
          borderTop: `3px solid rgba(201,162,69,0.4)`,
          borderRadius: "0 0 8px 8px",
          padding: "14px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 2, color: GOLD }}>
            ART. 25 RGPD · PRIVACY BY DESIGN
          </span>
          <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: 12, color: SILVER, fontStyle: "italic" }}>
            La arquitectura como objeto de regulación
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 2, color: GOLD }}>
            REGLAMENTO IA 2024/1689
          </span>
        </div>

        {active !== null && (
          <div style={{
            marginTop: 16, padding: "14px 20px",
            background: NAVY3, borderRadius: 8,
            border: `1px solid ${pillars[active].color}`,
            animation: "fadeInUp 0.3s ease"
          }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: pillars[active].color, marginBottom: 6 }}>
              Pilar {pillars[active].num} — {pillars[active].title}
            </div>
            <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 13.5, color: WHITE, lineHeight: 1.7 }}>
              {pillars[active].desc}
            </div>
          </div>
        )}

        {active !== null && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: SILVER, letterSpacing: 1 }}>
              clic sobre el pilar para expandir · clic de nuevo para colapsar
            </span>
          </div>
        )}
        {active === null && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: SILVER, opacity: 0.5, letterSpacing: 1 }}>
              clic sobre cualquier pilar para ver detalle
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState(1);

  const diagrams = { 1: Diagram1, 2: Diagram2, 3: Diagram3, 4: Diagram4, 5: Diagram5 };
  const ActiveDiagram = diagrams[activeTab];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-eyebrow">Harvard Law Review · Derecho Digital · Infografías Doctrinales</div>
          <h1 className="header-title">
            IA Agéntica, Autonomía Operativa y Protección de Datos
          </h1>
          <div className="header-sub">
            Flujos de trabajo derivados del análisis doctrinal · RGPD · Reglamento de IA 2024/1689
          </div>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="content">
          <ActiveDiagram key={activeTab} />
        </div>

        <div style={{
          padding: "12px 40px",
          borderTop: "1px solid rgba(138,155,181,0.15)",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 1.5, color: SILVER, opacity: 0.5 }}>
            Artículo doctrinal · Gobernanza arquitectónica de la IA agéntica
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 1.5, color: SILVER, opacity: 0.5 }}>
            {activeTab} / 5
          </span>
        </div>
      </div>
    </>
  );
}
