const fs = require('fs');
const content = fs.readFileSync('e:\\Projects\\Image-Converter-And-Image-Optimizer\\index.html', 'utf8');
const lines = content.split(/\r?\n/);
for (let i = 162; i < 166; i++) {
    console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
}
