import fs from 'node:fs';
import path from 'node:path';

const guiasDir = 'content/guias';
const results = [];

function auditGuides(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            auditGuides(fullPath);
        } else if (entry.name === 'index.mdx') {
            const content = fs.readFileSync(fullPath, 'utf8');
            const parts = content.split('---');
            const body = parts.length > 2 ? parts.slice(2).join('---').trim() : '';
            const lines = body.split('\n').filter(l => l.trim() !== '').length;
            const charCount = body.length;
            const titleMatch = content.match(/title:\s*"(.*)"/);
            const title = titleMatch ? titleMatch[1] : entry.name;
            results.push({
                path: fullPath,
                title,
                lines,
                charCount,
                isEmpty: charCount < 100 || lines < 2
            });
        }
    }
}

auditGuides(guiasDir);
console.log(JSON.stringify(results, null, 2));
