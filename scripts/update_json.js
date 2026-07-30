const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'content', 'firma-scarpa', 'ia-sector-legal.json');
const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let body = content.body;

// Insert images
body = body.replace(
  /"El nuevo derecho de la Inteligencia Artificial"/,
  '"El nuevo derecho de la Inteligencia Artificial"\n\n![Portada del libro El nuevo derecho de la Inteligencia Artificial](/assets/images/finocchiaro-cover.jpg)\n\n'
);

body = body.replace(
  /"Inteligencia Artificial y Analítica Jurídica"/,
  '"Inteligencia Artificial y Analítica Jurídica"\n\n![Portada del libro Inteligencia Artificial y Analítica Jurídica](/assets/images/ashley-cover.jpg)\n\n'
);

body = body.replace(
  /"Inteligencia Artificial y Derecho, un reto social"/,
  '"Inteligencia Artificial y Derecho, un reto social"\n\n![Portada del libro Inteligencia Artificial y Derecho, un reto social](/assets/images/granero-cover.jpg)\n\n'
);

body = body.replace(
  /"Inteligencia Artificial y Filosofía del Derecho"/,
  '"Inteligencia Artificial y Filosofía del Derecho"\n\n![Portada del libro Inteligencia Artificial y Filosofía del Derecho](/assets/images/llano-cover.jpg)\n\n'
);

content.body = body;

fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
console.log('Updated ia-sector-legal.json');
