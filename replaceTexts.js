const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = [...walk('app'), ...walk('components')];

for (const file of files) {
  // Skip AppText itself
  if (file.replace(/\\/g, '/').includes('components/AppText.tsx')) continue;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace <Text and </Text>
  content = content.replace(/<Text\b/g, '<AppText');
  content = content.replace(/<\/Text>/g, '</AppText>');

  if (content !== originalContent) {
    // Attempt to remove Text from react-native imports
    content = content.replace(/import\s*\{([^}]*)\bText\b([^}]*)\}\s*from\s*['"]react-native['"];?/g, (match, p1, p2) => {
      let parts = (p1 + p2).split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length === 0) return '';
      return `import { ${parts.join(', ')} } from "react-native";`;
    });

    // Add AppText import if missing and there are AppText replacements
    const importStmt = `import AppText from "@/components/AppText";\n`;
    if (!content.includes('import AppText from')) {
      const lastImportMatch = [...content.matchAll(/^import .*$/gm)];
      if (lastImportMatch.length > 0) {
        const lastMatch = lastImportMatch[lastImportMatch.length - 1];
        const lastImportIndex = lastMatch.index + lastMatch[0].length;
        content = content.slice(0, lastImportIndex) + '\n' + importStmt + content.slice(lastImportIndex);
      } else {
        content = importStmt + content;
      }
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
}
