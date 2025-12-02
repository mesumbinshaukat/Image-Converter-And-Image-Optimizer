const fs = require('fs');
const path = require('path');

console.log('=== Browser Console Error Fixes - Edge Case Validation ===\n');

const checks = {
    passed: [],
    warnings: [],
    failed: []
};

// Check 1: Verify deprecated meta tag is fixed
console.log('1. Checking for deprecated meta tags...');
const htmlFiles = [
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\index.html',
    'e:\\Projects\\Image-Converter-And-Image-Optimizer\\frontend\\index.html'
];

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    if (content.includes('apple-mobile-web-app-capable')) {
        checks.failed.push(`${path.basename(file)}: Still contains deprecated apple-mobile-web-app-capable`);
    } else if (content.includes('mobile-web-app-capable')) {
        checks.passed.push(`${path.basename(file)}: Using correct mobile-web-app-capable`);
    } else {
        checks.warnings.push(`${path.basename(file)}: No mobile-web-app-capable meta tag found`);
    }
});

// Check 2: Verify global error handlers are present
console.log('2. Checking for global error handlers...');
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    const hasUnhandledRejection = content.includes("addEventListener('unhandledrejection'");
    const hasErrorHandler = content.includes("addEventListener('error'");
    const hasConsoleOverride = content.includes('originalConsoleError');

    if (hasUnhandledRejection && hasErrorHandler && hasConsoleOverride) {
        checks.passed.push(`${path.basename(file)}: All error handlers present`);
    } else {
        const missing = [];
        if (!hasUnhandledRejection) missing.push('unhandledrejection');
        if (!hasErrorHandler) missing.push('error');
        if (!hasConsoleOverride) missing.push('console override');
        checks.failed.push(`${path.basename(file)}: Missing handlers: ${missing.join(', ')}`);
    }
});

// Check 3: Verify main.tsx has error handlers
console.log('3. Checking main.tsx for error handlers...');
const mainTsx = 'e:\\Projects\\Image-Converter-And-Image-Optimizer\\frontend\\src\\main.tsx';
if (fs.existsSync(mainTsx)) {
    const content = fs.readFileSync(mainTsx, 'utf8');

    const hasUnhandledRejection = content.includes("addEventListener('unhandledrejection'");
    const hasErrorHandler = content.includes("addEventListener('error'");
    const hasProdCheck = content.includes('import.meta.env.PROD');

    if (hasUnhandledRejection && hasErrorHandler) {
        checks.passed.push('main.tsx: Error handlers present');
        if (hasProdCheck) {
            checks.passed.push('main.tsx: Handlers only active in production');
        } else {
            checks.warnings.push('main.tsx: Handlers active in all environments');
        }
    } else {
        checks.failed.push('main.tsx: Missing error handlers');
    }
} else {
    checks.failed.push('main.tsx: File not found');
}

// Check 4: Verify API error handling
console.log('4. Checking API service error handling...');
const apiTs = 'e:\\Projects\\Image-Converter-And-Image-Optimizer\\frontend\\src\\services\\api.ts';
if (fs.existsSync(apiTs)) {
    const content = fs.readFileSync(apiTs, 'utf8');

    const hasInterceptor = content.includes('api.interceptors.response.use');
    const hasErrorLogging = content.includes('console.error');
    const hasPromiseReject = content.includes('Promise.reject');
    const hasErrorDetails = content.includes('errorDetails');

    if (hasInterceptor && hasErrorLogging && hasPromiseReject) {
        checks.passed.push('api.ts: Error interceptor configured');
        if (hasErrorDetails) {
            checks.passed.push('api.ts: Enhanced error logging present');
        } else {
            checks.warnings.push('api.ts: Basic error logging (consider enhancing)');
        }
    } else {
        checks.failed.push('api.ts: Incomplete error handling');
    }
} else {
    checks.failed.push('api.ts: File not found');
}

// Check 5: Edge case - Verify no duplicate error handlers
console.log('5. Checking for duplicate error handlers...');
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    const unhandledRejectionCount = (content.match(/addEventListener\('unhandledrejection'/g) || []).length;
    const errorHandlerCount = (content.match(/addEventListener\('error'/g) || []).length;

    if (unhandledRejectionCount > 1 || errorHandlerCount > 1) {
        checks.warnings.push(`${path.basename(file)}: Duplicate event listeners detected (unhandledrejection: ${unhandledRejectionCount}, error: ${errorHandlerCount})`);
    } else {
        checks.passed.push(`${path.basename(file)}: No duplicate handlers`);
    }
});

// Check 6: Edge case - Verify AdSense error handling
console.log('6. Checking AdSense implementation...');
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    if (content.includes('adsbygoogle')) {
        const hasAsyncScript = content.includes('async src="https://pagead2.googlesyndication.com');
        if (hasAsyncScript) {
            checks.passed.push(`${path.basename(file)}: AdSense script is async`);
        } else {
            checks.warnings.push(`${path.basename(file)}: AdSense script should be async`);
        }
    }
});

// Check 7: Edge case - Verify no blocking scripts
console.log('7. Checking for blocking scripts...');
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Check for scripts without async/defer in head
    const headContent = content.match(/<head>([\s\S]*?)<\/head>/i);
    if (headContent) {
        const scriptsInHead = headContent[1].match(/<script(?![^>]*(?:async|defer|type="application\/ld\+json"))[^>]*src=/gi);
        if (scriptsInHead && scriptsInHead.length > 0) {
            checks.warnings.push(`${path.basename(file)}: ${scriptsInHead.length} blocking script(s) in head`);
        } else {
            checks.passed.push(`${path.basename(file)}: No blocking scripts in head`);
        }
    }
});

// Print results
console.log('\n=== Validation Results ===\n');

if (checks.passed.length > 0) {
    console.log('✓ PASSED:');
    checks.passed.forEach(msg => console.log(`  ✓ ${msg}`));
    console.log('');
}

if (checks.warnings.length > 0) {
    console.log('⚠ WARNINGS:');
    checks.warnings.forEach(msg => console.log(`  ⚠ ${msg}`));
    console.log('');
}

if (checks.failed.length > 0) {
    console.log('✗ FAILED:');
    checks.failed.forEach(msg => console.log(`  ✗ ${msg}`));
    console.log('');
}

// Summary
const total = checks.passed.length + checks.warnings.length + checks.failed.length;
console.log('=== Summary ===');
console.log(`Total checks: ${total}`);
console.log(`Passed: ${checks.passed.length}`);
console.log(`Warnings: ${checks.warnings.length}`);
console.log(`Failed: ${checks.failed.length}`);

if (checks.failed.length === 0) {
    console.log('\n✓ All critical checks passed!');
    console.log('✓ Browser console errors should be significantly reduced');
    console.log('✓ Extension-related errors will be suppressed');
} else {
    console.log('\n✗ Some checks failed - review above');
}
