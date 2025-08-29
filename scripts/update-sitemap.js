#!/usr/bin/env node

/**
 * Sitemap Update Script
 * Automatically updates the lastmod dates in sitemap.xml
 * Run with: node scripts/update-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

try {
    // Read the sitemap file
    let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

    // Replace all instances of old dates with current date
    // This regex matches the lastmod tags and updates them
    sitemapContent = sitemapContent.replace(
        /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
        `<lastmod>${currentDate}</lastmod>`
    );

    // Write the updated content back to the file
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');

    console.log(`✅ Sitemap updated successfully!`);
    console.log(`📅 New lastmod date: ${currentDate}`);
    console.log(`📁 File: ${sitemapPath}`);

} catch (error) {
    console.error('❌ Error updating sitemap:', error.message);
    process.exit(1);
}