const fs = require('fs');

const files = [
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\index.html',
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\frontend\\index.html'
];

// The correct FAQPage JSON-LD block
const correctFAQBlock = `  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "Is Imgify really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Imgify is completely free to use. No hidden costs, no subscriptions. You can optimize and convert images without any charges."
      }
    }, {
      "@type": "Question",
      "name": "How much can I compress my images?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Imgify can compress images up to 80% of their original size without visible quality loss using advanced lossless compression algorithms."
      }
    }, {
      "@type": "Question",
      "name": "What image formats are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Imgify supports JPG, JPEG, PNG, WebP, GIF, BMP, and SVG formats for both optimization and conversion."
      }
    }, {
      "@type": "Question",
      "name": "Do I need to register to use Imgify?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, Imgify is completely free to use and does not require any registration. You can use all features instantly without creating an account."
      }
    }]
  }`;

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Processing ${file}...`);
        let content = fs.readFileSync(file, 'utf8');

        // Find the FAQPage block - from the comment to the closing script tag
        const faqStart = content.indexOf('<!-- Structured Data - FAQPage -->');
        if (faqStart !== -1) {
            // Find the script tag start
            const scriptStart = content.indexOf('<script type="application/ld+json">', faqStart);
            if (scriptStart !== -1) {
                // Find the closing script tag
                const scriptEnd = content.indexOf('</script>', scriptStart);
                if (scriptEnd !== -1) {
                    // Replace the entire block
                    const before = content.substring(0, scriptStart + 35); // 35 is length of '<script type="application/ld+json">'
                    const after = content.substring(scriptEnd);

                    const newContent = before + '\n' + correctFAQBlock + '\n  ' + after;

                    fs.writeFileSync(file, newContent, 'utf8');
                    console.log(`  Successfully rebuilt FAQPage block.`);
                } else {
                    console.log(`  Could not find closing script tag.`);
                }
            } else {
                console.log(`  Could not find script tag.`);
            }
        } else {
            console.log(`  Could not find FAQPage comment.`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});

console.log('\nDone! Run verify_json_ld.js to check the results.');
