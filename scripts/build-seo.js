import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import { fileURLToPath } from 'url';
import imageUrlBuilder from '@sanity/image-url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

// Configuration Sanity (Dataset public, pas de token nécessaire)
const client = createClient({
  projectId: 'vhric00i',
  dataset: 'production',
  useCdn: false, // Important: on veut les données les plus fraîches au build
  apiVersion: '2023-01-01',
});

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

async function buildSEO() {
  console.log('--- Démarrage de l\'injection SEO (SSG Maison) ---');
  
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('Erreur: dist/index.html introuvable. Avez-vous lancé "vite build" avant ?');
    process.exit(1);
  }
  
  const baseHtml = fs.readFileSync(indexPath, 'utf-8');

  // ==========================================
  // 1. OPTIMISATION DE LA PAGE D'ACCUEIL
  // ==========================================
  console.log('Optimisation de la Home...');
  const homeTitle = 'Location appartement & studio à Limoges — entre particuliers, sans agence | En Direct';
  const homeDesc = 'Location d\'appartements et studios à Limoges en direct du propriétaire. Zéro frais d\'agence, entre particuliers. Logements meublés étudiants éligibles APL/ALS.';
  
  // Injection du corps statique minimal pour la Home
  const homeBodyInjection = `
    <h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Location appartement & studio à Limoges — Sans agence, direct propriétaire.</h1>
    <p style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Louez votre logement étudiant à Limoges en direct avec le propriétaire. Parcourez nos disponibilités de studios, T1 et T2 meublés. Profitez d'une location entre particuliers avec zéro frais d'agence. Logements éligibles aux aides de la CAF (APL / ALS).</p>
  `;
  
  let homeHtml = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${homeTitle}</title>`)
    .replace(/<meta name="description".*?>/i, `<meta name="description" content="${homeDesc}" />`)
    .replace('<div id="root"></div>', `<div id="root">${homeBodyInjection}</div>`);
    
  fs.writeFileSync(indexPath, homeHtml);
  
  // ==========================================
  // 2. RÉCUPÉRATION DES APPARTEMENTS SANITY
  // ==========================================
  console.log('Récupération des appartements publiés depuis Sanity...');
  const query = `*[_type == "appartement" && published == true]`;
  const apartments = await client.fetch(query);
  console.log(`${apartments.length} appartements trouvés.`);

  // ==========================================
  // 3. GÉNÉRATION DES PAGES STATIQUES PAR ANNONCE
  // ==========================================
  for (const apt of apartments) {
    if (!apt.slug || !apt.slug.current) continue;
    
    const slug = apt.slug.current;
    const type = apt.apartmentType ? apt.apartmentType : (apt.bedrooms > 0 ? `T${apt.bedrooms + 1}` : 'Studio');
    const size = apt.surface || 0;
    const price = apt.price || 0;
    const title = apt.title || 'Sans titre';
    const imageUrl = apt.images && apt.images.length > 0 ? urlFor(apt.images[0]).url() : '';
    const desc = apt.description ? apt.description.substring(0, 150).replace(/\n/g, ' ') + '...' : `Découvrez ce ${type} de ${size}m² à louer sur Limoges. Loyer : ${price}€/mois sans frais d'agence.`;
    const fullDesc = apt.description || '';
    
    console.log(`- Génération HTML pour : ${slug}`);
    
    // Créer le sous-dossier (ex: dist/logement/studio-dutreix)
    const aptDir = path.join(distPath, 'logement', slug);
    if (!fs.existsSync(aptDir)) {
      fs.mkdirSync(aptDir, { recursive: true });
    }
    
    // Construire les balises Meta OG + Twitter
    const metaTags = `
      <title>${title} | Location Limoges en Direct</title>
      <meta name="description" content="${desc}" />
      <link rel="canonical" href="https://www.location-limoges-en-direct.fr/logement/${slug}" />
      <meta property="og:title" content="${title} | Location Limoges en Direct" />
      <meta property="og:description" content="${desc}" />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="https://www.location-limoges-en-direct.fr/logement/${slug}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title} | Location Limoges en Direct" />
      <meta name="twitter:description" content="${desc}" />
      <meta name="twitter:image" content="${imageUrl}" />
    `;
    
    // JSON-LD Schema
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Apartment",
      "name": title,
      "description": fullDesc,
      "image": apt.images ? apt.images.map(i => urlFor(i).url()) : [],
      "numberOfRoomsTotal": type === 'Studio' ? 1 : parseInt(type.replace('T', '') || 1),
      "floorSize": { "@type": "QuantitativeValue", "value": size, "unitCode": "MTK" },
      "address": { "@type": "PostalAddress", "streetAddress": apt.address || "Limoges", "addressLocality": "Limoges", "postalCode": "87000", "addressCountry": "FR" },
      "offers": { "@type": "Offer", "price": price, "priceCurrency": "EUR", "availability": "https://schema.org/InStock" }
    };
    
    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
    
    // ==========================================
    // LE CORPS MINIMAL POUR GOOGLE (Le point #1 de Claude)
    // ==========================================
    const bodyInjection = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h1>${title}</h1>
        <p><strong>Type:</strong> ${type} meublé</p>
        <p><strong>Surface:</strong> ${size} m²</p>
        <p><strong>Adresse:</strong> ${apt.address || 'Limoges'}</p>
        <p><strong>Loyer:</strong> ${price} € / mois (sans frais d'agence)</p>
        ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: auto;" />` : ''}
        <h2>Description</h2>
        <div>${fullDesc.replace(/\n/g, '<br/>')}</div>
      </div>
    `;

    // Injecter dans le HTML de base
    let aptHtml = baseHtml
      .replace(/<title>.*?<\/title>/, '') // Supprime le titre générique
      .replace(/<meta name="description".*?>/i, '') // Supprime la desc générique
      .replace('</head>', `${metaTags}\n${jsonLdScript}\n</head>`) // Ajoute le nouveau Head
      .replace('<div id="root"></div>', `<div id="root">${bodyInjection}</div>`); // Injecte le corps
      
    // Sauvegarder dans dist/logement/slug/index.html
    fs.writeFileSync(path.join(aptDir, 'index.html'), aptHtml);
  }
  
  // ==========================================
  // 4. GÉNÉRATION DE LA PAGE PILIER FAQ
  // ==========================================
  console.log('Génération de la page Pilier (louer-sans-agence)...');
  const pilierDir = path.join(distPath, 'louer-sans-agence-limoges');
  if (!fs.existsSync(pilierDir)) {
    fs.mkdirSync(pilierDir, { recursive: true });
  }

  const faqData = [
    { question: "Faut-il payer des frais d'agence pour louer sur ce site ?", answer: "Non. Vous louez directement au propriétaire..." },
    { question: "Quels documents pour un dossier de location entre particuliers ?", answer: "En général : une pièce d'identité..." },
    { question: "Comment se passent la visite et la signature du bail sans agence ?", answer: "Vous convenez d'un rendez-vous directement avec le propriétaire..." },
    { question: "Peut-on toucher les APL en louant en direct auprès d'un propriétaire ?", answer: "Oui. Les aides au logement de la CAF (APL/ALS) ne dépendent pas du passage par une agence..." },
    { question: "Comment fonctionne le dépôt de garantie ?", answer: "Un dépôt de garantie est versé à la signature du bail..." },
    { question: "Comment éviter les arnaques en location entre particuliers ?", answer: "Ne versez jamais d'argent avant d'avoir visité le logement..." }
  ];

  const pilierJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const pilierMeta = `
    <title>Louer sans agence à Limoges — entre particuliers, en direct | Location Limoges en Direct</title>
    <meta name="description" content="Comment louer à Limoges sans passer par une agence ? Location entre particuliers, en direct avec le propriétaire : zéro frais d'agence, un interlocuteur unique, des biens réels et éligibles APL." />
    <link rel="canonical" href="https://www.location-limoges-en-direct.fr/louer-sans-agence-limoges" />
    <meta property="og:title" content="Louer sans agence à Limoges — entre particuliers, en direct | Location Limoges en Direct" />
    <meta property="og:description" content="Comment louer à Limoges sans passer par une agence ? Location entre particuliers, en direct avec le propriétaire : zéro frais d'agence, un interlocuteur unique, des biens réels et éligibles APL." />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://www.location-limoges-en-direct.fr/louer-sans-agence-limoges" />
  `;

  const pilierBodyInjection = `
    <h1>Louer sans agence à Limoges, en direct avec le propriétaire</h1>
    <p>À Limoges, il est tout à fait possible de louer un appartement sans passer par une agence. Ici, vous traitez directement avec le propriétaire : pas d'intermédiaire, pas de commission, pas de frais de dossier d'agence.</p>
  `;

  let pilierHtml = baseHtml
    .replace(/<title>.*?<\/title>/, '')
    .replace(/<meta name="description".*?>/i, '')
    .replace('</head>', `${pilierMeta}\n<script type="application/ld+json">${JSON.stringify(pilierJsonLd)}</script>\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${pilierBodyInjection}</div>`);
    
  fs.writeFileSync(path.join(pilierDir, 'index.html'), pilierHtml);

  console.log('--- Injection SEO terminée avec succès ! ---');
}

buildSEO().catch(err => {
  console.error("Erreur critique lors de l'injection SEO :", err);
  process.exit(1);
});
