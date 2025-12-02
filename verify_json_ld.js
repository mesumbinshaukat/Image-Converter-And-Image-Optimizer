const fs = require('fs');
const path = require('path');

function checkFile(filepath) {
    console.log(`Checking ${filepath}...`);
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const matches = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);

        if (!matches) {
            console.log(`No JSON-LD blocks found in ${filepath}`);
            return false;
        }

        let allValid = true;
        matches.forEach((match, index) => {
            const jsonContent = match.replace(/<script type="application\/ld\+json">|<\/script>/g, '');
            try {
                JSON.parse(jsonContent);
                console.log(`  Block ${index + 1}: Valid JSON`);
            } catch (e) {
                console.log(`  Block ${index + 1}: Invalid JSON - ${e.message}`);
                console.log("--- INVALID JSON START ---");
                const lines = jsonContent.split('\n');
                lines.forEach((line, i) => {
                    console.log(`${i + 1}: ${line}`);
                });
                console.log("--- INVALID JSON END ---");
                allValid = false;
            }
        });

        return allValid;
    } catch (e) {
        console.log(`Error reading file: ${e.message}`);
        return false;
    }
}

const filesToCheck = [
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\index.html',
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\frontend\\index.html'
];

let success = true;
filesToCheck.forEach(f => {
    if (fs.existsSync(f)) {
        if (!checkFile(f)) {
            success = false;
        }
    } else {
        console.log(`File not found: ${f}`);
        success = false;
    }
});

if (success) {
    console.log("\nSUCCESS: All JSON-LD blocks are valid.");
} else {
    console.log("\nFAILURE: Some JSON-LD blocks are invalid.");
}
