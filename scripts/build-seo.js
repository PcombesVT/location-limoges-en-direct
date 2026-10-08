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
  const homeDesc = 'Location d\'appartements et studios à Limoges de particulier à particulier, en direct du propriétaire. Zéro frais d\'agence, entre particuliers. Logements meublés étudiants éligibles APL/ALS.';
  
  // Injection du corps statique minimal pour la Home
  const homeBodyInjection = `
    <div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">DE PARTICULIER À PARTICULIER</div>
    <h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Location appartement & studio à Limoges — Sans agence, direct propriétaire.</h1>
    <p style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Louez votre logement étudiant à Limoges de particulier à particulier, en direct avec le propriétaire. Parcourez nos disponibilités de studios, T1 et T2 meublés. Profitez d'une location entre particuliers avec zéro frais d'agence. Logements éligibles aux aides de la CAF (APL / ALS).</p>
  `;
  
  const globalFooterInjection = `
    <footer style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
      Location-Limoges-En-Direct.fr - Zéro frais d'agence, de particulier à particulier. Garantie Visale et ALS / APL acceptées.
    </footer>
  `;
  
  let homeHtml = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${homeTitle}</title>`)
    .replace(/<meta name="description".*?>/i, `<meta name="description" content="${homeDesc}" />`)
    .replace('<div id="root"></div>', `<div id="root">${homeBodyInjection}${globalFooterInjection}</div>`);
    
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
      .replace('<div id="root"></div>', `<div id="root">${bodyInjection}${globalFooterInjection}</div>`); // Injecte le corps
      
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
    { question: "Comment louer de particulier à particulier à Limoges ?", answer: "Parcourez les annonces du site : chaque logement est publié directement par son propriétaire. Vous le contactez via le formulaire, convenez d'une visite, puis signez le bail en direct avec lui. Aucune agence n'intervient, donc aucun frais d'agence — vous louez de particulier à particulier, de bout en bout." },
    { question: "Quelle différence entre louer de particulier à particulier et passer par une agence ?", answer: "En location de particulier à particulier, il n'y a pas de frais d'agence (souvent l'équivalent d'un mois de loyer économisé) et vous échangez directement avec le propriétaire, qui connaît son bien. L'agence, elle, facture ses honoraires et sert d'intermédiaire. Ici, tout se fait en direct, de particulier à particulier — plus simple, plus rapide, moins cher." },
    { question: "Peut-on vraiment louer un appartement à Limoges sans frais d'agence ?", answer: "Oui. Tous les logements de ce site — appartements, studios, T1 et T2 — sont proposés directement par leurs propriétaires, donc sans frais d'agence ni commission. Vous ne payez aucun honoraire d'intermédiaire : vous louez en direct, de particulier à particulier." },
    { question: "Faut-il payer des frais d'agence pour louer sur ce site ?", answer: "Non. Vous louez directement au propriétaire, sans aucun frais d'agence ni commission. Vous ne payez que le loyer et le dépôt de garantie prévus au bail." },
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
    <title>Louer de particulier à particulier à Limoges — appartement & studio sans frais d'agence | Location Limoges en Direct</title>
    <meta name="description" content="Louez un appartement ou un studio à Limoges de particulier à particulier, en direct avec le propriétaire et sans frais d'agence. Logements meublés étudiants éligibles APL/ALS, loués entre particuliers." />
    <link rel="canonical" href="https://www.location-limoges-en-direct.fr/louer-sans-agence-limoges" />
    <meta property="og:title" content="Louer de particulier à particulier à Limoges — appartement & studio sans frais d'agence | Location Limoges en Direct" />
    <meta property="og:description" content="Louez un appartement ou un studio à Limoges de particulier à particulier, en direct avec le propriétaire et sans frais d'agence. Logements meublés étudiants éligibles APL/ALS, loués entre particuliers." />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://www.location-limoges-en-direct.fr/louer-sans-agence-limoges" />
  `;

  const pilierBodyInjection = `
    <div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">DE PARTICULIER À PARTICULIER</div>
    <h1>Louer sans agence à Limoges, en direct avec le propriétaire</h1>
    <p>À Limoges, il est tout à fait possible de louer de particulier à particulier, sans passer par une agence : vous traitez directement avec le propriétaire. Pas d'intermédiaire, pas de commission, pas de frais de dossier d'agence.</p>
    <h2>Louer de particulier à particulier à Limoges, sans intermédiaire</h2>
    <p>À Limoges, louer de particulier à particulier change tout : vous traitez en direct avec le propriétaire, sans intermédiaire et sans frais d'agence. Chaque logement de ce site est proposé directement par son propriétaire — vous le contactez, vous visitez, vous signez le bail avec lui. Pas de commission, pas de dossier payant, pas de file d'attente d'agence : juste une location entre particuliers, claire et directe. Que vous cherchiez un appartement ou un studio, vous louez ici sans frais d'agence : aucune commission, aucun honoraire, puisque vous traitez directement avec le propriétaire. C'est la façon la plus simple de trouver un studio, un T1 ou un T2 meublé à Limoges quand on cherche en direct, sans agence.</p>
  `;

  let pilierHtml = baseHtml
    .replace(/<title>.*?<\/title>/, '')
    .replace(/<meta name="description".*?>/i, '')
    .replace('</head>', `${pilierMeta}\n<script type="application/ld+json">${JSON.stringify(pilierJsonLd)}</script>\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${pilierBodyInjection}${globalFooterInjection}</div>`);
    
  fs.writeFileSync(path.join(pilierDir, 'index.html'), pilierHtml);

  // ==========================================
  // 5. GÉNÉRATION DE LA PAGE LOGEMENT ETUDIANT
  // ==========================================
  console.log('Génération de la page Logement Étudiant...');
  const etudiantDir = path.join(distPath, 'logement-etudiant-limoges');
  if (!fs.existsSync(etudiantDir)) {
    fs.mkdirSync(etudiantDir, { recursive: true });
  }

  const etudiantFaqData = [
    { question: "Peut-on louer un logement étudiant à Limoges sans agence ?", answer: "Oui. Tous les logements de ce site — studios, T1, appartements meublés — sont proposés directement par leurs propriétaires..." },
    { question: "Comment trouver un studio étudiant de particulier à particulier à Limoges ?", answer: "Parcourez les annonces du site : chaque studio ou appartement est publié directement par son propriétaire..." },
    { question: "Les logements étudiants sont-ils éligibles aux APL / ALS ?", answer: "Oui, selon votre situation et vos ressources, les logements loués ici ouvrent droit à l'APL ou à l'ALS..." },
    { question: "Peut-on utiliser la garantie Visale pour louer en direct à Limoges ?", answer: "Oui, de nombreux propriétaires acceptent la garantie Visale (Action Logement), gratuite, qui remplace un garant physique..." },
    { question: "Quels quartiers choisir pour un logement étudiant à Limoges ?", answer: "Le centre-ville est le plus pratique (Fac de Droit, IAE, 3IL, prépas, commerces, gare — tout à pied)..." }
  ];

  const etudiantJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": etudiantFaqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const etudiantMeta = `
    <title>Logement étudiant à Limoges entre particuliers — studio & appartement meublé sans agence | Location Limoges en Direct</title>
    <meta name="description" content="Logement étudiant à Limoges de particulier à particulier : studios et appartements meublés loués en direct par le propriétaire, sans frais d'agence. Éligibles APL/ALS, proches des facs, caution Visale acceptée selon le propriétaire." />
    <link rel="canonical" href="https://www.location-limoges-en-direct.fr/logement-etudiant-limoges" />
    <meta property="og:title" content="Logement étudiant à Limoges entre particuliers — studio & appartement meublé sans agence | Location Limoges en Direct" />
    <meta property="og:description" content="Logement étudiant à Limoges de particulier à particulier : studios et appartements meublés loués en direct par le propriétaire, sans frais d'agence. Éligibles APL/ALS, proches des facs, caution Visale acceptée selon le propriétaire." />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://www.location-limoges-en-direct.fr/logement-etudiant-limoges" />
  `;

  const etudiantBodyInjection = `
    <h1>Logement étudiant à Limoges, entre particuliers</h1>
    <h2>Pourquoi louer son logement étudiant de particulier à particulier à Limoges ?</h2>
    <p>Pour un étudiant, louer de particulier à particulier à Limoges, c'est d'abord économiser les frais d'agence...</p>
    <h2>Des studios et appartements meublés, proches des facs de Limoges</h2>
    <p>Les logements proposés ici se situent surtout en centre-ville et à proximité des campus...</p>
    <h2>APL, ALS, caution Visale : les aides pour les étudiants</h2>
    <p>Les logements loués ici sont éligibles aux aides au logement de la CAF (APL ou ALS) selon votre situation...</p>
  `;

  let etudiantHtml = baseHtml
    .replace(/<title>.*?<\/title>/, '')
    .replace(/<meta name="description".*?>/i, '')
    .replace('</head>', `${etudiantMeta}\n<script type="application/ld+json">${JSON.stringify(etudiantJsonLd)}</script>\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${etudiantBodyInjection}${globalFooterInjection}</div>`);
    
  fs.writeFileSync(path.join(etudiantDir, 'index.html'), etudiantHtml);

  console.log('--- Injection SEO terminée avec succès ! ---');
}

buildSEO().catch(err => {
  console.error("Erreur critique lors de l'injection SEO :", err);
  process.exit(1);
});
