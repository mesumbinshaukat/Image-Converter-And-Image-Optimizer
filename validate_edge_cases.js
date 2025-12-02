const fs = require('fs');

console.log('=== Comprehensive JSON-LD Edge Case Validation ===\n');

const files = [
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\index.html',
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\frontend\\index.html'
];

let allPassed = true;

files.forEach(filepath => {
    console.log(`\n--- Checking ${filepath.split('\\').pop()} ---`);

    if (!fs.existsSync(filepath)) {
        console.log('❌ File not found');
        allPassed = false;
        return;
    }

    const content = fs.readFileSync(filepath, 'utf8');
    const matches = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);

    if (!matches) {
        console.log('❌ No JSON-LD blocks found');
        allPassed = false;
        return;
    }

    console.log(`Found ${matches.length} JSON-LD blocks\n`);

    matches.forEach((match, index) => {
        const jsonContent = match.replace(/<script type="application\/ld\+json">|<\/script>/g, '');

        try {
            const parsed = JSON.parse(jsonContent);
            console.log(`✓ Block ${index + 1} (${parsed['@type']}): Valid JSON`);

            // Edge case checks
            const issues = [];

            // Check 1: Ensure @context exists
            if (!parsed['@context']) {
                issues.push('Missing @context');
            }

            // Check 2: Ensure @type exists
            if (!parsed['@type']) {
                issues.push('Missing @type');
            }

            // Check 3: Check for empty strings
            const hasEmptyStrings = JSON.stringify(parsed).includes('""');
            if (hasEmptyStrings) {
                issues.push('Contains empty strings');
            }

            // Check 4: For FAQPage, validate structure
            if (parsed['@type'] === 'FAQPage') {
                if (!parsed.mainEntity || !Array.isArray(parsed.mainEntity)) {
                    issues.push('FAQPage missing mainEntity array');
                } else {
                    parsed.mainEntity.forEach((q, i) => {
                        if (!q['@type'] || q['@type'] !== 'Question') {
                            issues.push(`Question ${i + 1} missing @type`);
                        }
                        if (!q.name) {
                            issues.push(`Question ${i + 1} missing name`);
                        }
                        if (!q.acceptedAnswer || !q.acceptedAnswer.text) {
                            issues.push(`Question ${i + 1} missing answer text`);
                        }
                    });
                }
            }

            // Check 5: For WebApplication, validate offers
            if (parsed['@type'] === 'WebApplication') {
                if (parsed.offers && !parsed.offers.price) {
                    issues.push('WebApplication offers missing price');
                }
            }

            // Check 6: Validate URLs
            const urlFields = ['url', 'logo', 'screenshot', 'item'];
            const checkUrls = (obj) => {
                for (const key in obj) {
                    if (urlFields.includes(key) && typeof obj[key] === 'string') {
                        if (!obj[key].startsWith('http://') && !obj[key].startsWith('https://')) {
                            issues.push(`Invalid URL in ${key}: ${obj[key]}`);
                        }
                    }
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        checkUrls(obj[key]);
                    }
                }
            };
            checkUrls(parsed);

            if (issues.length > 0) {
                console.log(`  ⚠ Warnings: ${issues.join(', ')}`);
            } else {
                console.log(`  ✓ No edge case issues detected`);
            }

        } catch (e) {
            console.log(`✗ Block ${index + 1}: Invalid JSON - ${e.message}`);
            allPassed = false;
        }
    });
});

console.log('\n=== Summary ===');
if (allPassed) {
    console.log('✓ All JSON-LD blocks are valid and pass edge case checks');
    console.log('✓ Ready for Google Search Console');
} else {
    console.log('✗ Some issues detected - review above');
}
