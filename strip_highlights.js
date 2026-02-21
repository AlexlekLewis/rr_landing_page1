const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/offer-response');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // This regex matches our specific highlight spans and extracts the inner child.
    // It handles the class names we added (bg-emerald-500/..., bg-amber-500/...)
    const regex = /<span className="bg-(emerald|amber)-500[^"]*"[^>]*>(.*?)<\/span>/gs;
    
    let matchesFound = 0;
    let newContent = content.replace(regex, (match, prefix, innerText) => {
        matchesFound++;
        return innerText;
    });

    if (matchesFound > 0) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Stripped ${matchesFound} highlights from ${file}`);
    }
}
