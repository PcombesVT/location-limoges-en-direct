import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

// Utiliser les mêmes identifiants que dans src/sanity/client.js
const sanityClient = createClient({
  projectId: 'vhric00i', // À remplacer si différent
  dataset: 'production',
  useCdn: false, // On veut la donnée la plus fraîche au build
  apiVersion: '2023-05-03',
});

async function generateSitemap() {
  console.log("Génération du sitemap...");
  try {
    const apartments = await sanityClient.fetch(`*[_type == "appartement" && published == true]{slug, _updatedAt}`);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.location-limoges-en-direct.fr/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.location-limoges-en-direct.fr/mentions-legales</loc>
    <changefreq>yearly</changefreq>
    <priority>0.1</priority>
  </url>`;

    apartments.forEach(apt => {
      if (apt.slug && apt.slug.current) {
        xml += `
  <url>
    <loc>https://www.location-limoges-en-direct.fr/logement/${apt.slug.current}</loc>
    <lastmod>${apt._updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    });

    xml += `\n</urlset>`;

    const publicPath = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath);
    }
    
    fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), xml);
    console.log("✅ sitemap.xml généré avec succès dans le dossier public/ !");
  } catch (error) {
    console.error("❌ Erreur lors de la génération du sitemap:", error);
    process.exit(1);
  }
}

generateSitemap();
