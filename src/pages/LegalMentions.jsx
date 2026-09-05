import React from 'react';
import { Helmet } from 'react-helmet-async';

export function LegalMentions() {
  return (
    <>
      <Helmet>
        <title>Mentions Légales | Location Limoges en Direct</title>
        <meta name="description" content="Mentions légales du site Location Limoges en Direct." />
        <link rel="canonical" href="https://www.location-limoges-en-direct.fr/mentions-legales" />
      </Helmet>
      
      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem' }}>Mentions Légales</h1>
        
        <section style={{ marginBottom: '2rem' }}>
          <h2>1. Éditeur du site</h2>
          <p>
            Le présent site est édité par un propriétaire particulier.<br />
            <strong>Nom / Prénom :</strong> [À COMPLÉTER]<br />
            <strong>Adresse :</strong> [À COMPLÉTER]<br />
            <strong>Contact :</strong> [À COMPLÉTER (Email ou Téléphone)]
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>2. Hébergement</h2>
          <p>
            Le site est hébergé par la société <strong>Vercel Inc.</strong><br />
            Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA<br />
            Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>https://vercel.com</a>
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>3. Collecte de données et RGPD</h2>
          <p>
            Les informations recueillies via le formulaire "Déposer un Dossier" (Prénom, Nom, Email, Téléphone, Budget) sont enregistrées dans un fichier informatisé par le propriétaire pour la <strong>gestion des candidatures à la location</strong>.
          </p>
          <p>
            La base légale du traitement est l'intérêt légitime (sélection des dossiers locatifs). Les données collectées seront communiquées au seul propriétaire et ne seront en aucun cas vendues ou cédées à des tiers.
          </p>
          <p>
            Les données sont conservées pendant la durée de la recherche de locataire, et détruites au maximum 3 mois après l'attribution du logement si votre dossier n'est pas retenu.
          </p>
          <p>
            Conformément à la loi « informatique et libertés » et au RGPD, vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier ou supprimer en contactant le propriétaire via les coordonnées ci-dessus.
          </p>
        </section>

        <section>
          <h2>4. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
        </section>
      </main>
    </>
  );
}
