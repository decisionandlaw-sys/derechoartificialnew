import { useState } from "react";

// ─── TOKENS ───────────────────────────────────────────────────────────────
const T = {
  navy:   "#0D1B2E",
  navy2:  "#132340",
  navy3:  "#1A2F52",
  gold:   "#C9A245",
  gold2:  "#E8C870",
  white:  "#F4F1EB",
  silver: "#8A9BB5",
  muted:  "#4A5568",
  red:    "#C0392B",
  green:  "#1A6B3C",
  blue:   "#2B6CB0",
  purple: "#6B46C1",
};

// ─── DATA ─────────────────────────────────────────────────────────────────

const INSTRUMENTS = [
  {
    id: "rgpd",
    sigla: "RGPD",
    nombre: "Reglamento General de Protección de Datos",
    ref: "Reglamento (UE) 2016/679",
    vigencia: "En vigor desde 2018",
    dot: T.gold,
    articulos: [
      { num: "Art. 4(1)", desc: "Definición de dato personal — determina el ámbito de aplicación sobre cualquier información tratada por el agente." },
      { num: "Art. 4(2)", desc: "Definición amplia de tratamiento — abarca cada operación ejecutada por el sistema, incluidas las intermedias no visibles." },
      { num: "Art. 5", desc: "Principios del tratamiento: licitud, minimización, limitación de finalidad, exactitud, limitación del plazo de conservación, integridad y confidencialidad. La arquitectura agéntica intensifica la exigencia de todos ellos." },
      { num: "Art. 6", desc: "Bases jurídicas — la reutilización de datos almacenados en memoria persistente puede requerir base jurídica independiente de la original." },
      { num: "Art. 9", desc: "Categorías especiales — la acumulación longitudinal puede generar tratamiento de datos sensibles inferidos sin recogida explícita." },
      { num: "Art. 13–14", desc: "Derecho de información y transparencia — la opacidad de los flujos intermedios agénticos tensiona el cumplimiento efectivo." },
      { num: "Art. 17", desc: "Derecho de supresión — requiere arquitectura de memoria que permita eliminación selectiva y verificable." },
      { num: "Art. 22", desc: "Decisiones exclusivamente automatizadas — aplicable cuando la cadena de razonamiento agéntica produce efectos jurídicos o significativos sobre el interesado." },
      { num: "Art. 25", desc: "Privacidad desde el diseño y por defecto — fundamento del compliance by architecture en sistemas agénticos." },
      { num: "Art. 30", desc: "Registro de actividades de tratamiento — debe reflejar la arquitectura distribuida y los nodos de almacenamiento intermedios." },
      { num: "Art. 32", desc: "Seguridad del tratamiento — la multiplicación de nodos eleva la superficie de exposición y exige medidas proporcionales." },
      { num: "Art. 35", desc: "Evaluación de impacto (EIPD) — obligatoria cuando concurren autonomía elevada, tratamiento longitudinal y efectos potencialmente significativos." },
    ]
  },
  {
    id: "ria",
    sigla: "RIA",
    nombre: "Reglamento de Inteligencia Artificial",
    ref: "Reglamento (UE) 2024/1689",
    vigencia: "Aplicación escalonada 2024–2027",
    dot: "#7C3AED",
    articulos: [
      { num: "Art. 3", desc: "Definiciones clave: sistema de IA, proveedor, implementador, operador. La arquitectura multiagente puede implicar múltiples roles simultáneos." },
      { num: "Art. 5", desc: "Prácticas de IA prohibidas — los sistemas agénticos con capacidad de manipulación subliminal o explotación de vulnerabilidades quedan expresamente vetados." },
      { num: "Art. 6 + Anexo III", desc: "Clasificación de alto riesgo — los sistemas agénticos en sectores críticos (empleo, crédito, infraestructuras esenciales) califican como alto riesgo." },
      { num: "Art. 9", desc: "Sistema de gestión de riesgos — debe ser continuo e iterativo, coherente con la naturaleza evolutiva de la IA agéntica." },
      { num: "Art. 10", desc: "Gobernanza de datos de entrenamiento — la memoria persistente como fuente de datos operativos exige gestión equivalente." },
      { num: "Art. 11–12", desc: "Documentación técnica y registro automático de eventos — trazabilidad de la cadena de razonamiento como exigencia normativa expresa." },
      { num: "Art. 13", desc: "Transparencia e información a los usuarios — aplicable a los resultados producidos por sistemas agénticos con efectos sobre personas físicas." },
      { num: "Art. 14", desc: "Supervisión humana — exige que el diseño permita la intervención efectiva de operadores humanos, no meramente formal." },
      { num: "Art. 17", desc: "Sistema de gestión de calidad — el proveedor debe documentar la arquitectura del sistema, incluyendo componentes de memoria y herramientas externas." },
      { num: "Art. 51–55", desc: "Modelos de IA de uso general (GPAI) — los LLM subyacentes en sistemas agénticos quedan sujetos a obligaciones específicas de transparencia y evaluación." },
      { num: "Art. 72", desc: "Supervisión de mercado — la AEPD es designada autoridad competente en España para sistemas de IA que traten datos personales." },
    ]
  },
  {
    id: "lopdgdd",
    sigla: "LOPDGDD",
    nombre: "Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales",
    ref: "LO 3/2018, de 5 de diciembre",
    vigencia: "En vigor desde diciembre 2018",
    dot: "#D97706",
    articulos: [
      { num: "Art. 4", desc: "Exactitud de los datos — especialmente relevante cuando la memoria acumulativa puede consolidar información no actualizada o inferida de fuentes heterogéneas." },
      { num: "Art. 11", desc: "Transparencia e información al interesado — el responsable debe articular información comprensible sobre la lógica agéntica aplicada." },
      { num: "Art. 25", desc: "Derecho a la portabilidad — en sistemas con memoria persistente, requiere mecanismos de exportación estructurada de datos acumulados." },
      { num: "Art. 41", desc: "Funciones del Delegado de Protección de Datos — el DPO debe comprender la arquitectura técnica de los sistemas agénticos desplegados." },
      { num: "Art. 48", desc: "Reclamaciones ante la AEPD — vía de tutela específica en materia de decisiones automatizadas y tratamientos opacos." },
      { num: "Art. 89", desc: "Derecho a la intimidad ante el uso de dispositivos de videovigilancia — aplicable cuando agentes con capacidades de percepción visual operan en entornos físicos." },
      { num: "Arts. 93–97", desc: "Derechos digitales en el entorno laboral — limitación del uso de IA agéntica en contextos de monitorización de trabajadores." },
    ]
  },
  {
    id: "soft",
    sigla: "Soft Law",
    nombre: "Directrices, Dictámenes y Guías de Autoridades",
    ref: "CEPD · AEPD · OCDE · UNESCO",
    vigencia: "Vigencia continua — actualización periódica",
    dot: T.green,
    articulos: [
      { num: "CEPD — Directrices 02/2022", desc: "Sobre listas negras relativas a decisiones basadas exclusivamente en tratamiento automatizado. Interpretación aplicable al art. 22 RGPD en contextos agénticos." },
      { num: "CEPD — Directrices 06/2020", desc: "Sobre conceptos de responsable y encargado del tratamiento. Relevantes para la asignación de roles en arquitecturas multiagente." },
      { num: "CEPD — Dictamen 28/2024", desc: "Sobre el tratamiento de datos personales en el contexto de los modelos de IA. Primera orientación específica sobre tratamiento de datos en sistemas de IA de gran escala." },
      { num: "AEPD — Guía sobre IA y protección de datos (2020)", desc: "Marco de referencia nacional para el análisis de riesgos de sistemas de IA desde la perspectiva del RGPD. Pendiente de actualización para arquitecturas agénticas." },
      { num: "AEPD — Circular 1/2023", desc: "Sobre procedimientos en materia de evaluación de impacto. Aplicable a sistemas agénticos de alto riesgo desplegados en España." },
      { num: "Principios de IA de la OCDE (2019, rev. 2024)", desc: "Marco internacional de referencia: transparencia, explicabilidad, robustez, seguridad y rendición de cuentas. Incorporados al RIA como referencia interpretativa." },
      { num: "Recomendación UNESCO sobre ética de la IA (2021)", desc: "Instrumento internacional no vinculante sobre principios éticos aplicables al ciclo de vida de los sistemas de IA, incluyendo la supervisión humana." },
    ]
  },
];

const INTERACTIONS = [
  {
    par: "RGPD ↔ RIA",
    color: "#3B6EA5",
    desc: "El cumplimiento del RIA no exime del RGPD. Ambos se aplican de forma acumulativa. El art. 9 RIA (gestión de riesgos) y el art. 35 RGPD (EIPD) son complementarios y deben articularse de manera coordinada. El responsable puede integrarlos en un único instrumento de evaluación.",
    tension: "La EIPD del RGPD analiza el impacto sobre personas físicas; la gestión de riesgos del RIA se centra en la seguridad y el rendimiento del sistema. En la práctica agéntica, ambas dimensiones son inseparables.",
  },
  {
    par: "RGPD ↔ LOPDGDD",
    color: "#D97706",
    desc: "La LOPDGDD es la norma de desarrollo del RGPD en España. Añade especificidades en materia de derechos digitales laborales, menores, y vías de tutela ante la AEPD. En entornos agénticos desplegados en el ámbito laboral, los arts. 87–91 LOPDGDD imponen límites adicionales al alcance del tratamiento.",
    tension: "La fragmentación territorial del desarrollo normativo puede generar incertidumbre cuando el sistema agéntico opera en múltiples jurisdicciones de la UE con distintas normas de desarrollo.",
  },
  {
    par: "RIA ↔ Soft Law",
    color: "#1A6B3C",
    desc: "Las directrices del CEPD y las guías de la AEPD, aunque no vinculantes en sentido estricto, son altamente influyentes en la práctica supervisora y sancionadora. El RIA remite expresamente a normas armonizadas y estándares técnicos que aún están en elaboración por organismos como CEN/CENELEC.",
    tension: "La ausencia de estándares técnicos armonizados específicos para IA agéntica genera una laguna normativa que las autoridades supervisan con los instrumentos de soft law disponibles hasta la aprobación de normas armonizadas.",
  },
  {
    par: "Art. 22 RGPD ↔ Art. 14 RIA",
    color: "#6B46C1",
    desc: "El art. 22 RGPD exige supervisión humana real en decisiones exclusivamente automatizadas con efectos significativos. El art. 14 RIA establece obligaciones de supervisión humana para sistemas de alto riesgo. En arquitecturas agénticas, ambos convergen: el diseño debe garantizar que la supervisión sea sustantiva, no formal.",
    tension: "El umbral de 'efectos jurídicos o significativos' del art. 22 RGPD puede alcanzarse en sistemas agénticos con alta autonomía aunque el resultado final no adopte la forma clásica de 'decisión', sino de recomendación operativamente determinante.",
  },
];

const TIMELINE = [
  { fecha: "Mayo 2018", hito: "Aplicación plena del RGPD", norma: "RGPD", color: T.gold, desc: "El RGPD es plenamente aplicable a cualquier sistema de IA agéntica que trate datos personales de residentes en la UE, independientemente de dónde esté establecido el proveedor." },
  { fecha: "Diciembre 2018", hito: "Entrada en vigor de la LOPDGDD", norma: "LOPDGDD", color: "#D97706", desc: "Complementa el RGPD con especificidades españolas. Los derechos digitales de los artículos 87–97 son directamente aplicables a sistemas agénticos en contextos laborales." },
  { fecha: "Agosto 2024", hito: "Entrada en vigor del RIA", norma: "RIA", color: "#7C3AED", desc: "El Reglamento de IA entra en vigor 20 días después de su publicación en el DOUE. El período de adaptación es escalonado." },
  { fecha: "Febrero 2025", hito: "Aplicación de las prohibiciones del RIA", norma: "RIA", color: "#7C3AED", desc: "Las prácticas de IA prohibidas (art. 5 RIA) son directamente aplicables. Los sistemas agénticos que incurran en manipulación subliminal o explotación de vulnerabilidades deben cesar." },
  { fecha: "Agosto 2025", hito: "Aplicación plena a modelos GPAI", norma: "RIA", color: "#7C3AED", desc: "Las obligaciones sobre modelos de IA de uso general (arts. 51–55 RIA) son plenamente aplicables. Los LLM subyacentes en sistemas agénticos quedan sujetos a requisitos de transparencia y evaluación." },
  { fecha: "Agosto 2026", hito: "Aplicación a sistemas de alto riesgo (Anexo I)", norma: "RIA", color: "#7C3AED", desc: "Las obligaciones relativas a sistemas de IA de alto riesgo listados en el Anexo I del RIA son plenamente aplicables." },
  { fecha: "Agosto 2027", hito: "Aplicación plena del RIA", norma: "RIA", color: "#7C3AED", desc: "La totalidad del Reglamento de IA es aplicable, incluyendo los sistemas de alto riesgo del Anexo III que sean ampliaciones de sistemas preexistentes." },
];

const OBLIGATIONS = [
  { actor: "Proveedor del sistema agéntico", color: T.gold, items: ["Diseñar el sistema conforme a los principios del art. 25 RGPD desde el origen", "Elaborar documentación técnica que describa arquitectura, memoria y herramientas (art. 11 RIA)", "Implementar sistema de gestión de riesgos iterativo (art. 9 RIA)", "Garantizar supervisión humana técnicamente efectiva (art. 14 RIA)", "Registrar automáticamente los eventos relevantes del sistema (art. 12 RIA)", "Cumplir obligaciones de transparencia sobre la lógica aplicada (art. 13 RIA)"] },
  { actor: "Responsable del tratamiento", color: "#3B6EA5", items: ["Realizar EIPD cuando el sistema agéntico implique alto riesgo (art. 35 RGPD)", "Mantener el registro de actividades de tratamiento actualizado con la arquitectura agéntica (art. 30 RGPD)", "Designar DPO cuando el tratamiento sea a gran escala o sistemático (art. 37 RGPD)", "Establecer contratos de encargo con todos los proveedores de herramientas externas (art. 28 RGPD)", "Garantizar el ejercicio de los derechos de los interesados sobre datos almacenados en memoria", "Notificar brechas de seguridad en los plazos del art. 33 RGPD"] },
  { actor: "Implementador / Operador", color: "#1A6B3C", items: ["No modificar el sistema de manera que comprometa la supervisión humana establecida", "Garantizar que el uso se ajusta a la finalidad para la que el sistema fue autorizado", "Suspender el uso si se detectan riesgos no evaluados previamente", "Conservar los registros de funcionamiento durante el plazo exigido", "Informar al proveedor de incidentes o comportamientos anómalos detectados"] },
  { actor: "Delegado de Protección de Datos", color: "#6B46C1", items: ["Asesorar sobre la EIPD de sistemas agénticos (art. 39 RGPD)", "Supervisar el cumplimiento del RGPD respecto al tratamiento agéntico", "Actuar como punto de contacto con la AEPD", "Comprender la arquitectura técnica del sistema para ejercer su función con rigor", "Evaluar la adecuación de los controles de memoria y trazabilidad implementados"] },
];

// ─── STYLES ──────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:${T.navy};}

.norm-root{
  font-family:'Crimson Pro',Georgia,serif;
  background:${T.navy};
  color:${T.white};
  min-height:100vh;
  line-height:1.6;
}

/* ── HEADER ── */
.norm-header{
  padding:36px 44px 28px;
  border-bottom:1px solid rgba(201,162,69,.25);
  position:relative;
}
.norm-header::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,${T.gold},${T.gold2},${T.gold});
}
.norm-eyebrow{
  font-family:'Space Mono',monospace;font-size:9px;letter-spacing:3px;
  color:${T.gold};text-transform:uppercase;margin-bottom:10px;
}
.norm-title{
  font-family:'Playfair Display',serif;font-size:24px;font-weight:700;
  color:${T.white};line-height:1.25;margin-bottom:6px;
}
.norm-subtitle{
  font-family:'Crimson Pro',serif;font-size:14px;color:${T.silver};font-style:italic;
}
.norm-badge{
  display:inline-block;margin-top:14px;
  font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;
  padding:4px 12px;border:1px solid rgba(201,162,69,.4);border-radius:20px;
  color:${T.gold};text-transform:uppercase;
}

/* ── NAV PILLS ── */
.norm-nav{
  display:flex;gap:6px;padding:20px 44px;
  border-bottom:1px solid rgba(138,155,181,.15);flex-wrap:wrap;
}
.norm-pill{
  font-family:'Space Mono',monospace;font-size:8.5px;letter-spacing:1px;
  text-transform:uppercase;padding:7px 14px;border-radius:20px;cursor:pointer;
  border:1px solid rgba(138,155,181,.3);color:${T.silver};
  background:transparent;transition:all .2s;white-space:nowrap;
}
.norm-pill:hover{color:${T.white};border-color:rgba(201,162,69,.5);}
.norm-pill.active{
  background:rgba(201,162,69,.12);border-color:${T.gold};color:${T.gold};
}

/* ── CONTENT ── */
.norm-body{padding:36px 44px;}
.norm-section-h{
  font-family:'Playfair Display',serif;font-size:20px;font-weight:600;
  color:${T.white};margin-bottom:6px;
}
.norm-section-sub{
  font-family:'Crimson Pro',serif;font-size:13.5px;color:${T.silver};
  font-style:italic;margin-bottom:28px;line-height:1.5;
}

/* ── INSTRUMENTO CARD ── */
.inst-grid{display:flex;flex-direction:column;gap:14px;}
.inst-card{
  background:${T.navy2};border:1px solid rgba(138,155,181,.15);
  border-radius:10px;overflow:hidden;transition:all .25s;
}
.inst-card.open{border-color:rgba(201,162,69,.35);}
.inst-header{
  display:flex;align-items:center;gap:14px;padding:18px 22px;
  cursor:pointer;
}
.inst-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
.inst-sigla{
  font-family:'Space Mono',monospace;font-size:11px;font-weight:700;
  letter-spacing:1.5px;color:${T.gold};min-width:70px;
}
.inst-nombre{
  font-family:'Playfair Display',serif;font-size:14.5px;font-weight:600;
  color:${T.white};flex:1;
}
.inst-meta{
  font-family:'Space Mono',monospace;font-size:8px;letter-spacing:1px;
  color:${T.silver};text-align:right;white-space:nowrap;
}
.inst-chevron{color:${T.gold};font-size:14px;transition:transform .25s;flex-shrink:0;}
.inst-chevron.open{transform:rotate(180deg);}

.inst-body{
  border-top:1px solid rgba(138,155,181,.1);
  padding:0 22px;max-height:0;overflow:hidden;
  transition:max-height .4s ease,padding .3s;
}
.inst-body.open{max-height:900px;padding:18px 22px 22px;}

.art-row{
  display:flex;gap:12px;padding:10px 0;
  border-bottom:1px solid rgba(255,255,255,.04);
}
.art-row:last-child{border-bottom:none;}
.art-num{
  font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.5px;
  color:${T.gold};min-width:110px;padding-top:2px;flex-shrink:0;
}
.art-desc{
  font-family:'Crimson Pro',serif;font-size:13px;color:${T.silver};line-height:1.55;
}

/* ── INTERACTIONS ── */
.inter-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.inter-card{
  background:${T.navy2};border-radius:10px;padding:22px;
  border-left:4px solid;transition:all .25s;
}
.inter-card:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.4);}
.inter-par{
  font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;
  text-transform:uppercase;margin-bottom:10px;
}
.inter-desc{
  font-family:'Crimson Pro',serif;font-size:13px;color:${T.silver};
  line-height:1.6;margin-bottom:12px;
}
.inter-tension-label{
  font-family:'Space Mono',monospace;font-size:8px;letter-spacing:1.5px;
  color:${T.gold};margin-bottom:6px;text-transform:uppercase;
}
.inter-tension{
  font-family:'Crimson Pro',serif;font-size:12.5px;color:${T.silver};
  font-style:italic;line-height:1.55;
  border-left:2px solid rgba(201,162,69,.3);padding-left:10px;
}

/* ── TIMELINE ── */
.tl-wrap{position:relative;padding-left:40px;}
.tl-line{
  position:absolute;left:14px;top:6px;bottom:6px;width:2px;
  background:linear-gradient(180deg,${T.gold} 0%,rgba(201,162,69,.15) 100%);
}
.tl-item{
  position:relative;margin-bottom:24px;cursor:pointer;
}
.tl-dot{
  position:absolute;left:-33px;top:4px;
  width:12px;height:12px;border-radius:50%;border:2px solid;
  background:${T.navy};transition:all .2s;
}
.tl-item:hover .tl-dot{transform:scale(1.3);}
.tl-date{
  font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1.5px;
  color:${T.gold};margin-bottom:4px;
}
.tl-hito{
  font-family:'Playfair Display',serif;font-size:15px;font-weight:600;
  color:${T.white};margin-bottom:4px;
}
.tl-norma-tag{
  display:inline-block;font-family:'Space Mono',monospace;font-size:8px;
  letter-spacing:1px;padding:2px 8px;border-radius:20px;margin-bottom:8px;
}
.tl-desc{
  font-family:'Crimson Pro',serif;font-size:13px;color:${T.silver};
  line-height:1.55;max-height:0;overflow:hidden;transition:max-height .35s;
}
.tl-desc.open{max-height:120px;}

/* ── OBLIGATIONS ── */
.obl-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.obl-card{
  background:${T.navy2};border-radius:10px;padding:22px;
  border-top:3px solid;
}
.obl-actor{
  font-family:'Playfair Display',serif;font-size:15px;font-weight:600;
  color:${T.white};margin-bottom:14px;
}
.obl-list{list-style:none;display:flex;flex-direction:column;gap:8px;}
.obl-item{
  display:flex;gap:10px;font-family:'Crimson Pro',serif;
  font-size:12.5px;color:${T.silver};line-height:1.5;
}
.obl-arrow{flex-shrink:0;padding-top:1px;}

/* ── QUOTE BOX ── */
.quote-box{
  background:rgba(201,162,69,.06);border-left:3px solid ${T.gold};
  border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;
}
.quote-text{
  font-family:'Crimson Pro',serif;font-size:14px;color:${T.white};
  font-style:italic;line-height:1.65;
}
.quote-attr{
  font-family:'Space Mono',monospace;font-size:8px;letter-spacing:1.5px;
  color:${T.gold};margin-top:8px;text-transform:uppercase;
}

/* ── RULE ── */
.hr{height:1px;background:linear-gradient(90deg,transparent,rgba(201,162,69,.3),transparent);margin:8px 0 24px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
.fade-up{animation:fadeUp .4s ease both;}
`;

// ─── SECTION: Instrumentos ───────────────────────────────────────────────
function SecInstrumentos() {
  const [open, setOpen] = useState(null);
  const toggle = id => setOpen(open === id ? null : id);

  return (
    <div className="fade-up">
      <div className="quote-box">
        <div className="quote-text">
          "La IA agéntica no introduce nuevas categorías jurídicas, pero sí transforma la morfología del tratamiento de datos. El marco normativo existente es suficiente para encuadrar el fenómeno; insuficiente si se aplica sin penetrar en la arquitectura técnica."
        </div>
        <div className="quote-attr">Artículo doctrinal — Sección III, párrafo 10</div>
      </div>

      <div className="norm-section-h">Instrumentos Jurídicos Aplicables</div>
      <div className="norm-section-sub">
        Marco normativo vigente aplicable a sistemas de IA agéntica — Despliegue en clic para ver artículos específicos
      </div>

      <div className="inst-grid">
        {INSTRUMENTS.map(inst => (
          <div key={inst.id} className={`inst-card${open===inst.id?" open":""}`}>
            <div className="inst-header" onClick={()=>toggle(inst.id)}>
              <div className="inst-dot" style={{background:inst.dot}}/>
              <div className="inst-sigla">{inst.sigla}</div>
              <div>
                <div className="inst-nombre">{inst.nombre}</div>
                <div style={{fontFamily:"'Crimson Pro',serif",fontSize:12,color:T.silver,fontStyle:"italic"}}>{inst.ref}</div>
              </div>
              <div className="inst-meta">{inst.vigencia}</div>
              <div className={`inst-chevron${open===inst.id?" open":""}`}>▾</div>
            </div>
            <div className={`inst-body${open===inst.id?" open":""}`}>
              {inst.articulos.map((a,i)=>(
                <div key={i} className="art-row">
                  <div className="art-num">{a.num}</div>
                  <div className="art-desc">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION: Interacciones ──────────────────────────────────────────────
function SecInteracciones() {
  return (
    <div className="fade-up">
      <div className="norm-section-h">Interacciones y Tensiones Normativas</div>
      <div className="norm-section-sub">
        Los instrumentos no operan en silos — su aplicación conjunta genera articulaciones complejas en entornos agénticos
      </div>
      <div className="inter-grid">
        {INTERACTIONS.map((inter,i)=>(
          <div key={i} className="inter-card" style={{borderLeftColor:inter.color}}>
            <div className="inter-par" style={{color:inter.color}}>{inter.par}</div>
            <div className="inter-desc">{inter.desc}</div>
            <div className="inter-tension-label">Tensión normativa identificada</div>
            <div className="inter-tension">{inter.tension}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop:24,padding:"16px 20px",background:"rgba(192,57,43,.07)",border:"1px solid rgba(192,57,43,.25)",borderRadius:10}}>
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:2,color:"#E57373",marginBottom:8,textTransform:"uppercase"}}>
          Laguna normativa destacada
        </div>
        <div style={{fontFamily:"'Crimson Pro',serif",fontSize:13.5,color:T.silver,lineHeight:1.65}}>
          Ninguno de los instrumentos vigentes regula específicamente la gobernanza de la <em style={{color:T.white}}>memoria persistente</em> en sistemas agénticos, ni establece criterios concretos de segmentación, supresión selectiva o auditoría de la memoria acumulativa. Esta laguna es el principal vector de incertidumbre jurídica en el despliegue de IA agéntica hasta la aprobación de estándares técnicos armonizados por CEN/CENELEC en desarrollo del RIA.
        </div>
      </div>
    </div>
  );
}

// ─── SECTION: Calendario ─────────────────────────────────────────────────
function SecCalendario() {
  const [openIdx, setOpenIdx] = useState(null);
  const toggle = i => setOpenIdx(openIdx===i ? null : i);

  return (
    <div className="fade-up">
      <div className="norm-section-h">Calendario de Aplicación</div>
      <div className="norm-section-sub">
        Cronología de obligaciones vigentes y en aplicación progresiva — clic en cada hito para ver el detalle
      </div>
      <div className="tl-wrap">
        <div className="tl-line"/>
        {TIMELINE.map((item,i)=>(
          <div key={i} className="tl-item" onClick={()=>toggle(i)}>
            <div className="tl-dot" style={{borderColor:item.color,background:openIdx===i?item.color:T.navy}}/>
            <div className="tl-date">{item.fecha}</div>
            <div className="tl-hito">{item.hito}</div>
            <div className="tl-norma-tag" style={{
              background:`${item.color}22`,
              border:`1px solid ${item.color}66`,
              color:item.color
            }}>{item.norma}</div>
            <div className={`tl-desc${openIdx===i?" open":""}`}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION: Obligaciones ───────────────────────────────────────────────
function SecObligaciones() {
  return (
    <div className="fade-up">
      <div className="norm-section-h">Mapa de Obligaciones por Actor</div>
      <div className="norm-section-sub">
        Distribución de responsabilidades normativas en el ecosistema de la IA agéntica
      </div>
      <div className="obl-grid">
        {OBLIGATIONS.map((obl,i)=>(
          <div key={i} className="obl-card" style={{borderTopColor:obl.color}}>
            <div className="obl-actor" style={{color:obl.color}}>{obl.actor}</div>
            <ul className="obl-list">
              {obl.items.map((item,j)=>(
                <li key={j} className="obl-item">
                  <span className="obl-arrow" style={{color:obl.color}}>→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{marginTop:24,padding:"16px 20px",background:"rgba(201,162,69,.06)",borderRadius:10,border:"1px solid rgba(201,162,69,.2)"}}>
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:2,color:T.gold,marginBottom:8}}>
          PRINCIPIO TRANSVERSAL
        </div>
        <div style={{fontFamily:"'Crimson Pro',serif",fontSize:13.5,color:T.white,fontStyle:"italic",lineHeight:1.65}}>
          "La complejidad técnica no reduce la responsabilidad; la intensifica. La multiplicidad de actores y la fragmentación de funciones no diluyen las obligaciones, sino que exigen claridad organizativa proporcional a la complejidad del sistema."
        </div>
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:8.5,letterSpacing:1,color:T.silver,marginTop:8}}>
          Arts. 5(2) y 25 RGPD · Art. 17 RIA
        </div>
      </div>
    </div>
  );
}

// ─── SECTION: Lege Ferenda ───────────────────────────────────────────────
function SecLegeFerenda() {
  const proposals = [
    {
      num: "I",
      title: "Regulación específica de la memoria persistente",
      color: T.gold,
      desc: "El legislador europeo debería adoptar directrices vinculantes sobre los criterios de incorporación, conservación, segmentación y supresión de datos en sistemas de memoria persistente de IA agéntica, articuladas como desarrollo del art. 5(1)(e) RGPD y del art. 10 RIA.",
      fundamento: "Laguna normativa identificada — ningún instrumento vigente establece criterios específicos para la gobernanza de la memoria acumulativa agéntica.",
    },
    {
      num: "II",
      title: "Estándares de trazabilidad para arquitecturas multiagente",
      color: "#3B6EA5",
      desc: "CEN/CENELEC debería desarrollar, en el marco del mandato de estandarización del RIA, normas técnicas armonizadas específicas para la trazabilidad y reproducibilidad de cadenas de razonamiento en sistemas multiagente, como condición para la presunción de conformidad del art. 40 RIA.",
      fundamento: "La ausencia de estándares técnicos concretos de trazabilidad para arquitecturas agénticas impide la verificación efectiva del cumplimiento.",
    },
    {
      num: "III",
      title: "Categoría de evaluación de impacto agéntica",
      color: "#1A6B3C",
      desc: "El CEPD debería emitir directrices específicas sobre la metodología de EIPD para sistemas agénticos, incorporando la evaluación de los cuatro riesgos estructurales identificados (ampliación funcional, acumulación longitudinal, opacidad distribuida, irreversibilidad operativa) como contenido mínimo obligatorio.",
      fundamento: "Las directrices existentes sobre EIPD no contemplan la morfología específica del tratamiento agéntico ni los riesgos derivados de la memoria persistente.",
    },
    {
      num: "IV",
      title: "Registro específico de sistemas agénticos",
      color: "#6B46C1",
      desc: "El art. 71 RIA, que establece la base de datos de la UE para sistemas de alto riesgo, debería incluir una categoría específica para sistemas agénticos, con campos obligatorios que describan el nivel de autonomía, la capacidad de memoria persistente y las herramientas externas accesibles.",
      fundamento: "La supervisión de mercado efectiva requiere visibilidad sobre las características específicas de los sistemas agénticos que los distinguen de otros sistemas automatizados.",
    },
  ];

  return (
    <div className="fade-up">
      <div className="norm-section-h">Propuestas de Lege Ferenda</div>
      <div className="norm-section-sub">
        Carencias del marco normativo vigente y propuestas de desarrollo — perspectiva doctrinal
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {proposals.map((prop,i)=>(
          <div key={i} style={{
            background:T.navy2,borderRadius:10,padding:24,
            borderLeft:`4px solid ${prop.color}`,
            display:"grid",gridTemplateColumns:"40px 1fr",gap:16,
            transition:"all .25s",cursor:"default"
          }}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.4)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
          >
            <div style={{
              fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,
              color:prop.color,opacity:.5,lineHeight:1,paddingTop:2
            }}>{prop.num}</div>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:T.white,marginBottom:10}}>
                {prop.title}
              </div>
              <div style={{fontFamily:"'Crimson Pro',serif",fontSize:13.5,color:T.silver,lineHeight:1.65,marginBottom:12}}>
                {prop.desc}
              </div>
              <div style={{
                fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:1,
                color:prop.color,textTransform:"uppercase",marginBottom:4
              }}>Fundamento</div>
              <div style={{
                fontFamily:"'Crimson Pro',serif",fontSize:12.5,color:T.silver,
                fontStyle:"italic",lineHeight:1.55,
                borderLeft:`2px solid ${prop.color}44`,paddingLeft:10
              }}>{prop.fundamento}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id:"instrumentos",  label:"Marco Normativo",       Component: SecInstrumentos  },
  { id:"interacciones", label:"Interacciones",          Component: SecInteracciones },
  { id:"calendario",    label:"Calendario",             Component: SecCalendario    },
  { id:"obligaciones",  label:"Obligaciones por Actor", Component: SecObligaciones  },
  { id:"ferenda",       label:"De Lege Ferenda",        Component: SecLegeFerenda   },
];

export default function NormativaIA() {
  const [active, setActive] = useState("instrumentos");
  const { Component } = SECTIONS.find(s=>s.id===active);

  return (
    <>
      <style>{css}</style>
      <div className="norm-root">

        {/* HEADER */}
        <div className="norm-header">
          <div className="norm-eyebrow">Complemento Normativo · Artículo Doctrinal</div>
          <h1 className="norm-title">
            Marco Jurídico Aplicable a la IA Agéntica
          </h1>
          <div className="norm-subtitle">
            RGPD · Reglamento (UE) 2024/1689 de Inteligencia Artificial · LOPDGDD · Soft Law · Propuestas de Lege Ferenda
          </div>
          <div className="norm-badge">Sección Normativa</div>
        </div>

        {/* NAV */}
        <div className="norm-nav">
          {SECTIONS.map(s=>(
            <button
              key={s.id}
              className={`norm-pill${active===s.id?" active":""}`}
              onClick={()=>setActive(s.id)}
            >{s.label}</button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="norm-body">
          <Component key={active}/>
        </div>

        {/* FOOTER */}
        <div style={{
          padding:"14px 44px",
          borderTop:"1px solid rgba(138,155,181,.12)",
          display:"flex",justifyContent:"space-between",alignItems:"center"
        }}>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:1.5,color:T.silver,opacity:.5}}>
            IA Agéntica y Protección de Datos · Sección Normativa
          </span>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:1.5,color:T.silver,opacity:.5}}>
            RGPD 2016/679 · RIA 2024/1689 · LOPDGDD 3/2018
          </span>
        </div>
      </div>
    </>
  );
}
