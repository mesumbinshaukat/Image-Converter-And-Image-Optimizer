const fs = require('fs');

const files = [
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\index.html',
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\frontend\\index.html'
];

const target = `    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
      }`;

const replacement = `        "text": "No, Imgify is completely free to use and does not require any registration. You can use all features instantly without creating an account."
      }`;

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Processing ${file}...`);
        let content = fs.readFileSync(file, 'utf8');

        // Normalize line endings for matching if needed, but let's try exact first
        if (content.includes(target)) {
            content = content.replace(target, replacement);
            fs.writeFileSync(file, content, 'utf8');
            console.log(`  Fixed successfully.`);
        } else {
            console.log(`  Target not found. Trying loose match...`);
            // Try to construct regex for loose match ignoring whitespace differences if exact fails
            // Escape special characters in target for regex
            const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
            const regex = new RegExp(escapedTarget);
            if (regex.test(content)) {
                content = content.replace(regex, replacement);
                fs.writeFileSync(file, content, 'utf8');
                console.log(`  Fixed successfully with loose match.`);
            } else {
                console.log(`  Target still not found.`);
            }
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
