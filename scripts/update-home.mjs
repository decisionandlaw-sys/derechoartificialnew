import fs from 'fs';

const filePath = 'src/app/page.tsx';
let c = fs.readFileSync(filePath, 'utf8');

// Update section cards
c = c.replace(/href: "\/recursos\/guias"/g, 'href: "/guias-ia"');
c = c.replace(/category: "recursos"/g, 'category: "guias-ia"');
c = c.replace(/href: "\/ia-global"/g, 'href: "/global-ia"');
c = c.replace(/category: "ia-global"/g, 'category: "global-ia"');

// Update URL templates
c = c.replace(/\/recursos\/guias\/\$\{/g, '/guias-ia/${');

// Update filtering logic for IA Global
c = c.replace(/if \(cat === "ia-global"\) \{/g, 'if (cat === "ia-global" || cat === "global-ia") {');
c = c.replace(/section \|\| ""\).toLowerCase\(\) === "ia-global"/g, 'section || "").toLowerCase() === "global-ia"');

// Update filtering logic for Guías IA
// We find the etica-ia block as anchor
const eticaScan = 'if (cat === "etica-ia") {';
const guiasBlock = `                  // Para Guías IA, incluir tanto guias como guias-ia
                  if (cat === "guias-ia" || cat === "guias") {
                    return (
                      c === "guias-ia" ||
                      c === "guias" ||
                      (post.frontmatter.section || "").toLowerCase() === "guias" ||
                      (c === "recursos" && subcat === "guias")
                    );
                  }
                  
                  `;
if (c.includes(eticaScan)) {
  c = c.replace(eticaScan, guiasBlock + eticaScan);
}

// Update section items resolution
c = c.replace(/sec\.category === "guias-ia"[^}]+\? getLatestActualidadPosts\(\)[^}]+\: sec\.category === "firma-scarpa"/, 'sec.category === "firma-scarpa"');
// Wait, that one is tricky. I'll just use a direct replace for the items resolution loop.
const oldLoop = 'const items =\n                sec.category === "guias-ia"\n                  ? getLatestActualidadPosts()\n                  : sec.category === "firma-scarpa"\n                    ? getLatestFirmaPosts()\n                    : sec.category === "recursos"\n                      ? getLatestByCategory("recursos")\n                      : getLatestByCategory(sec.category);';

const newLoop = 'const items = getLatestByCategory(sec.category);';

// Let's use a simpler match for the loop
c = c.replace(/const items =\s+sec\.category === "guias-ia"(.|\n)+?getLatestByCategory\(sec\.category\);/g, 'const items = getLatestByCategory(sec.category);');

fs.writeFileSync(filePath, c);
console.log('Home page updated successfully');
