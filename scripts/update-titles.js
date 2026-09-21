import { createClient } from '@sanity/client';

const token = process.argv[2];

if (!token) {
  console.error("ERREUR : Vous devez fournir votre Token Sanity en argument !");
  console.error("Exemple : node scripts/update-titles.js skYvotreTokenSecret...");
  process.exit(1);
}

const client = createClient({
  projectId: 'vhric00i',
  dataset: 'production',
  apiVersion: '2023-01-01',
  token: token, // Récupéré de façon sécurisée via la ligne de commande
  useCdn: false
});

async function optimizeTitles() {
  const apartments = await client.fetch(`*[_type == "appartement"]`);
  
  let count = 0;
  for (const apt of apartments) {
    // 1. Correction intelligente du champ "meublé" en lisant la description
    let isFurnished = apt.furnished;
    if (apt.description && apt.description.toLowerCase().includes('non meubl')) {
      isFurnished = false;
    }
    
    // 2. Récupération des vraies données
    const type = apt.apartmentType ? apt.apartmentType : (apt.bedrooms > 0 ? `T${apt.bedrooms + 1}` : 'Studio');
    const furnishedText = isFurnished ? ' meublé' : ' non meublé';
    const surface = apt.surface ? ` ${apt.surface} m²` : '';
    // Nettoyer l'adresse (ex: "231 rue Armand Dutreix 87000 Limoges" -> "rue Armand Dutreix, Limoges")
    let location = apt.address || apt.building || 'Limoges';
    location = location.replace(/\d{5}\s?Limoges/i, 'Limoges').trim();
    
    // 3. Construction du nouveau titre (ex: "T1 non meublé 24 m² à louer — rue Armand Dutreix, Limoges")
    const newTitle = `${type}${furnishedText}${surface} à louer — ${location}`;
    
    // 4. Création d'une nouvelle URL (slug) SEO-friendly
    const newSlug = newTitle
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplace les espaces/symboles par des tirets
      .replace(/(^-|-$)+/g, ''); // Enlève les tirets au début et à la fin
    
    console.log(`[SIMULATION]
  Ancien : ${apt.title} (Slug: ${apt.slug?.current})
  Nouveau: ${newTitle}
  Nouveau Slug: ${newSlug}
  Correction Meublé: ${apt.furnished} -> ${isFurnished}
`);

    // Décommentez ces lignes pour faire la vraie mise à jour :
    /*
    await client.patch(apt._id)
      .set({ 
        title: newTitle,
        furnished: isFurnished,
        slug: { _type: 'slug', current: newSlug }
      })
      .commit();
    */
   
    count++;
    if (count >= 5) break; // On arrête après 5 pour la vérification !
  }
}

optimizeTitles().catch(console.error);
