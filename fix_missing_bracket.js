const fs = require('fs');

const files = [
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\index.html',
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\frontend\\index.html'
];

// We need to match the end of the script block
// The pattern is:
//     }
//   }
//   </script>
// We want to change it to:
//     }
//   }]
//   </script>

// Using regex to be safe with whitespace
const regex = /}\s*}\s*<\/script>/;
const replacement = `    }
  }]
  </script>`;

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Processing ${file}...`);
        let content = fs.readFileSync(file, 'utf8');

        // We need to be careful not to replace other script blocks
        // But this pattern is specific to the end of the JSON-LD block which is inside a script tag
        // However, there are multiple JSON-LD blocks.
        // We specifically want the one that is missing the bracket.
        // The one missing the bracket is the FAQPage one.
        // It ends with the "Do I need to register..." question.

        // Let's find the specific block first
        const faqBlockStart = content.indexOf('"@type": "FAQPage"');
        if (faqBlockStart !== -1) {
            // Find the end of this script tag
            const scriptEnd = content.indexOf('</script>', faqBlockStart);
            if (scriptEnd !== -1) {
                const block = content.substring(faqBlockStart, scriptEnd + 9);
                // Check if it's missing the bracket
                if (!block.includes('}]')) {
                    console.log(`  Found FAQ block missing bracket.`);
                    // Replace the end of this specific block
                    // We look for the last closing braces before </script>
                    const fixedBlock = block.replace(/}\s*}\s*<\/script>/, '}\n  }]\n  </script>');

                    // Replace in the main content
                    const newContent = content.substring(0, faqBlockStart) + fixedBlock + content.substring(scriptEnd + 9);
                    fs.writeFileSync(file, newContent, 'utf8');
                    console.log(`  Fixed successfully.`);
                } else {
                    console.log(`  FAQ block seems to already have the bracket.`);
                }
            } else {
                console.log(`  Could not find end of FAQ script block.`);
            }
        } else {
            console.log(`  Could not find FAQPage block.`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
