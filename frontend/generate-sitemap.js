import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Define routes with their metadata
const routes = [
    {
        comment: 'Homepage',
        loc: 'https://imgify.worldoftech.company/',
        changefreq: 'daily',
        priority: '1.0'
    },
    {
        comment: 'Image Optimizer',
        loc: 'https://imgify.worldoftech.company/optimize',
        changefreq: 'weekly',
        priority: '0.9'
    },
    {
        comment: 'Image Converter',
        loc: 'https://imgify.worldoftech.company/convert',
        changefreq: 'weekly',
        priority: '0.9'
    },
    {
        comment: 'Image Background Remover',
        loc: 'https://imgify.worldoftech.company/remove-background',
        changefreq: 'weekly',
        priority: '0.9'
    },
    
    {
        comment: 'About Us',
        loc: 'https://imgify.worldoftech.company/about',
        changefreq: 'weekly',
        priority: '1'
    },

    {
        comment: 'Login',
        loc: 'https://imgify.worldoftech.company/login',
        changefreq: 'monthly',
        priority: '0.6'
    },
    {
        comment: 'Register',
        loc: 'https://imgify.worldoftech.company/register',
        changefreq: 'monthly',
        priority: '0.6'
    },
    {
        comment: 'Contact',
        loc: 'https://imgify.worldoftech.company/contact',
        changefreq: 'monthly',
        priority: '0.7'
    },
    {
        comment: 'Privacy Policy',
        loc: 'https://imgify.worldoftech.company/privacy-policy',
        changefreq: 'yearly',
        priority: '0.5'
    },
    {
        comment: 'Terms of Service',
        loc: 'https://imgify.worldoftech.company/terms-of-service',
        changefreq: 'yearly',
        priority: '0.5'
    }
];

// Generate sitemap XML in exact format specified
const generateSitemap = () => {
    const currentDate = getCurrentDate();

    // Start with XML declaration and urlset opening tag
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
    xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
    xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
    xml += '    \n';

    // Add each route
    routes.forEach(route => {
        xml += `    <!-- ${route.comment} -->\n`;
        xml += '    <url>\n';
        xml += `        <loc>${route.loc}</loc>\n`;
        xml += `        <lastmod>${currentDate}</lastmod>\n`;
        xml += `        <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `        <priority>${route.priority}</priority>\n`;
        xml += '    </url>\n';
        xml += '    \n';
    });

    // Close urlset
    xml += '</urlset>\n';

    return xml;
};

// Write sitemap to root directory
const writeSitemap = () => {
    try {
        const sitemap = generateSitemap();
        const sitemapPath = join(__dirname, '..', 'sitemap.xml');

        writeFileSync(sitemapPath, sitemap, 'utf8');
        console.log('✅ Sitemap generated successfully at:', sitemapPath);
        console.log('📅 Last modified date:', getCurrentDate());
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
};

// Execute
writeSitemap();
