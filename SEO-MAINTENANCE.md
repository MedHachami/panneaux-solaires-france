# SEO Maintenance Guide

## Sitemap Management

### Automatic Sitemap Updates

The project includes automated tools for keeping your sitemap current:

#### Quick Commands

```bash
# Update sitemap dates to current date
npm run sitemap:update

# Generate new sitemap (after adding new pages)
npm run sitemap:generate

# Complete SEO maintenance (update + generate)
npm run seo:maintenance

# Check sitemap status
npm run sitemap:check
```

#### Manual Sitemap Updates

If you need to manually update the sitemap:

1. **Update Dates**: Run `npm run sitemap:update` to refresh all `lastmod` dates
2. **Add New Pages**: Edit `public/sitemap.xml` and add new URL entries
3. **Change Priorities**: Adjust priority values (0.0-1.0) based on page importance
4. **Update Frequencies**: Modify `changefreq` values as needed

### Sitemap Structure

```xml
<url>
  <loc>https://calhan-energies.com/</loc>
  <lastmod>2025-01-15</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
</url>
```

#### Priority Guidelines
- **1.0**: Homepage
- **0.9**: High-conversion pages (quote forms)
- **0.8**: Important sections (contact, benefits)
- **0.7**: Supporting content (gallery, aides)
- **0.5**: Less important pages

## Content Freshness

### Keeping Content Updated

1. **Regular Reviews**: Review and update content every 3-6 months
2. **Date Updates**: Run `npm run sitemap:update` monthly
3. **Content Audit**: Check for outdated information quarterly
4. **Performance Monitoring**: Monitor Core Web Vitals monthly

### Automated Maintenance

Set up a cron job for monthly sitemap updates:

```bash
# Add to crontab for monthly updates
0 0 1 * * cd /path/to/project && npm run seo:maintenance
```

## SEO Best Practices

### Meta Tags
- Keep title tags under 580 pixels
- Meta descriptions under 160 characters
- Use relevant keywords naturally
- Update Open Graph tags when changing branding

### Technical SEO
- Maintain fast loading times (< 0.8 seconds)
- Ensure mobile-friendliness
- Keep HTML valid and semantic
- Monitor for broken links

### Content Strategy
- Update statistics and testimonials regularly
- Refresh case studies and success stories
- Add new service information as available
- Maintain local SEO relevance

## Monitoring & Analytics

### Tools to Use
- Google Search Console for indexing status
- Google Analytics for user behavior
- PageSpeed Insights for performance
- Screaming Frog for technical audits

### Regular Checks
- Monthly: Sitemap submission and indexing
- Weekly: Core Web Vitals monitoring
- Quarterly: Comprehensive SEO audit
- Annually: Complete content refresh

## Emergency Updates

For urgent content changes:

1. Update the content in the relevant files
2. Run `npm run sitemap:update` to refresh dates
3. If adding new pages, update sitemap manually
4. Test the changes locally with `npm run dev`
5. Deploy and verify in production

## Contact Information

Keep contact information current:
- Phone numbers
- Email addresses
- Business hours
- Service areas

Regular updates ensure your SEO remains effective and your content stays fresh for both users and search engines.