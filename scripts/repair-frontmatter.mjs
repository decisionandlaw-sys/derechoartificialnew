import fs from 'fs';
import path from 'path';

function fix(dir, section) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    if (!e.isDirectory()) return;
    const full = path.join(dir, e.name, 'index.mdx');
    if (!fs.existsSync(full)) return;
    
    let c = fs.readFileSync(full, 'utf8');
    c = c.replace(/\r\n/g, '\n');
    c = c.replace(/\\n/g, '\n');
    
    const firstDash = c.indexOf('---');
    if (firstDash === -1) return;
    
    const bodyStart = c.indexOf('---', firstDash + 3);
    if (bodyStart === -1) return;
    
    let fmStr = c.slice(firstDash + 3, bodyStart);
    let body = c.slice(bodyStart + 3);
    
    const slug = e.name;
    const lines = fmStr.split('\n').filter(l => l.trim().length > 0);
    const fm = {};
    lines.forEach(l => {
      const idx = l.indexOf(':');
      if (idx !== -1) {
        const k = l.slice(0, idx).trim().toLowerCase();
        let v = l.slice(idx + 1).trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
        fm[k] = v;
      }
    });
    
    fm.section = section;
    fm.category = (section === 'guias') ? 'guias-ia' : section;
    fm.slug = slug;
    
    const newFm = Object.entries(fm).map(([k, v]) => {
      const val = String(v).trim();
      // If it's an array or object, keep it as is
      if (val.startsWith('[') && val.endsWith(']')) return `${k}: ${val}`;
      if (val.startsWith('{') && val.endsWith('}')) return `${k}: ${val}`;
      // Quote everything else to prevent auto-conversion to Date/Number
      return `${k}: "${val.replace(/"/g, '\\"')}"`;
    }).join('\n');
    
    body = body.trim();
    if (body.startsWith('slug:')) {
      const nextLine = body.indexOf('\n');
      if (nextLine !== -1) body = body.slice(nextLine).trim();
    }
    
    fs.writeFileSync(full, '---\n' + newFm + '\n---\n' + body + '\n');
    console.log('Fixed (Quoted): ' + full);
  });
}

const sections = ['global-ia', 'normativa', 'jurisprudencia', 'guias', 'firma-scarpa', 'etica-ia', 'propiedad-intelectual-ia'];
sections.forEach(s => fix(path.join('content', s), s));
