import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { sanityClient, urlFor } from '../sanity/client';

export function LogementEtudiant() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    sanityClient.fetch(`*[_type == "appartement" && published == true] | order(_createdAt desc)`).then((data) => {
      const formatted = data.map(doc => ({
        id: doc._id,
        slug: doc.slug?.current,
        title: doc.title || 'Sans titre public',
        location: doc.address || 'Limoges',
        price: doc.price || 0,
        charges: doc.charges || 0,
        size: doc.surface || 0,
        type: doc.apartmentType ? doc.apartmentType : (doc.bedrooms > 0 ? `T${doc.bedrooms + 1}` : 'Studio'),
        available: doc.availableDate ? new Date(doc.availableDate) <= new Date() : true,
        availableDateStr: doc.availableDate ? new Date(doc.availableDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
        rented: doc.rented || false,
        furnished: doc.furnished || false,
        images: doc.images ? doc.images.map(img => urlFor(img).url()) : ['/placeholder.svg'],
        features: [
          doc.fiber && 'Fibre Optique',
          doc.furnished && 'Meublé',
          doc.bikeStorage && 'Local Vélo',
          doc.elevator && 'Ascenseur',
          doc.parking && 'Parking',
          doc.intercom && 'Interphone',
          doc.videoIntercom && 'Visiophone'
        ].filter(Boolean),
      }));

      // Filtrer pour les étudiants : Studio, T1 ou Meublé. 
      // Retirer les "loués" comme demandé par le brief.
      const studentApts = formatted.filter(apt => 
        !apt.rented && (apt.type === 'Studio' || apt.type === 'T1' || apt.type === 'T1 Bis' || apt.furnished)
      );

      setApartments(studentApts);
      setLoading(false);
    }).catch(err => {
      console.error("Erreur de chargement Sanity:", err);
      setLoading(false);
    });
  }, []);

  const faqData = [
    {
      question: "Peut-on louer un logement étudiant à Limoges sans agence ?",
      answer: "Oui. Tous les logements de ce site — studios, T1, appartements meublés — sont proposés directement par leurs propriétaires, donc sans frais d'agence ni commission. Pour un étudiant, c'est souvent un mois de loyer économisé. Vous louez en direct, de particulier à particulier."
    },
    {
      question: "Comment trouver un studio étudiant de particulier à particulier à Limoges ?",
      answer: "Parcourez les annonces du site : chaque studio ou appartement est publié directement par son propriétaire. Vous le contactez via le formulaire, convenez d'une visite, puis signez le bail en direct avec lui. Aucune agence, donc aucun frais d'agence — une location entre particuliers, de bout en bout."
    },
    {
      question: "Les logements étudiants sont-ils éligibles aux APL / ALS ?",
      answer: "Oui, selon votre situation et vos ressources, les logements loués ici ouvrent droit à l'APL ou à l'ALS, versées par la CAF de la Haute-Vienne. Faites la demande sur caf.fr dès la signature du bail : les droits ne sont pas rétroactifs."
    },
    {
      question: "Peut-on utiliser la garantie Visale pour louer en direct à Limoges ?",
      answer: "Oui, de nombreux propriétaires acceptent la garantie Visale (Action Logement), gratuite, qui remplace un garant physique. C'est une solution très adaptée aux étudiants sans caution familiale. Précisez-le au propriétaire lors de votre prise de contact."
    },
    {
      question: "Quels quartiers choisir pour un logement étudiant à Limoges ?",
      answer: "Le centre-ville est le plus pratique (Fac de Droit, IAE, 3IL, prépas, commerces, gare — tout à pied). Les secteurs proches des campus Sciences, Lettres et santé (CHU, Médecine, IFSI) sont aussi recherchés. Les studios et T1 meublés en centre partent vite à la rentrée : anticipez."
    }
  ];

  const jsonLd = {
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

  return (
    <>
      <Helmet>
        <title>Logement étudiant à Limoges entre particuliers — studio & appartement meublé sans agence | Location Limoges en Direct</title>
        <meta name="description" content="Logement étudiant à Limoges de particulier à particulier : studios et appartements meublés loués en direct par le propriétaire, sans frais d'agence. Éligibles APL/ALS, proches des facs, caution Visale acceptée selon le propriétaire." />
        <link rel="canonical" href="https://www.location-limoges-en-direct.fr/logement-etudiant-limoges" />
        <meta property="og:title" content="Logement étudiant à Limoges entre particuliers — studio & appartement meublé sans agence | Location Limoges en Direct" />
        <meta property="og:description" content="Logement étudiant à Limoges de particulier à particulier : studios et appartements meublés loués en direct par le propriétaire, sans frais d'agence. Éligibles APL/ALS, proches des facs, caution Visale acceptée selon le propriétaire." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.location-limoges-en-direct.fr/logement-etudiant-limoges" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <header style={{ paddingTop: '120px', paddingBottom: '40px', background: 'var(--bg-color-light)', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>
            Logement étudiant à Limoges, entre particuliers
          </h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto'}}>
            Studios et appartements meublés, en direct avec le propriétaire — sans frais d'agence.
          </p>
        </div>
      </header>
      
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        
        <div className="glass-card" style={{marginBottom: '3rem'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>Pourquoi louer son logement étudiant de particulier à particulier à Limoges ?</h2>
          <p style={{color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem'}}>
            Pour un étudiant, louer <strong>de particulier à particulier</strong> à Limoges, c'est d'abord <strong>économiser les frais d'agence</strong> — souvent l'équivalent d'un mois de loyer, un vrai poids en moins sur un budget serré. Vous traitez <strong>en direct avec le propriétaire</strong> : vous le contactez, vous visitez, vous signez le bail avec lui, <strong>sans intermédiaire ni commission</strong>. Beaucoup de logements sont <strong>meublés</strong>, prêts à vivre dès l'arrivée, et <strong>éligibles aux aides de la CAF (APL / ALS)</strong>. C'est la façon la plus simple et la moins chère de trouver un <strong>studio ou un appartement étudiant</strong> à Limoges, <strong>en direct et sans agence</strong>.
          </p>
        </div>

        <div className="glass-card" style={{marginBottom: '3rem'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>Des studios et appartements meublés, proches des facs de Limoges</h2>
          <p style={{color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem'}}>
            Les logements proposés ici se situent surtout en <strong>centre-ville et à proximité des campus</strong> : la <strong>Faculté de Droit et l'IAE</strong>, l'école d'ingénieurs <strong>3IL</strong>, les <strong>prépas</strong>, et à quelques minutes des facs de <strong>Lettres, Sciences</strong> et du secteur <strong>santé (Médecine, IFSI)</strong>. Un <strong>studio meublé</strong> en centre permet de tout faire à pied — cours, commerces, gare des Bénédictins — sans voiture.
          </p>
          
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Disponibilités Étudiantes Actuelles</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
              <p>Chargement des logements étudiants...</p>
            </div>
          ) : apartments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
              <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>Pas de studio disponible actuellement — déposez un dossier pour être prévenu.</p>
              <Link to="/deposer-dossier" className="btn btn-primary" style={{ textDecoration: 'none' }}>Déposer un dossier</Link>
            </div>
          ) : (
            <div className="property-grid">
              {apartments.map((apt) => (
                <div key={apt.id} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
                    <img 
                      src={apt.images[0]} 
                      alt={apt.title} 
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span className={`badge ${apt.available ? 'badge-success' : 'badge-warning'}`}>
                      {apt.available ? 'Disponible' : `Le ${apt.availableDateStr}`}
                    </span>
                    <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{apt.type} • {apt.size}m²</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{apt.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>📍 {apt.location}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {apt.features.slice(0, 3).map(f => (
                      <span key={f} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        {f}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <div>
                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{parseFloat((apt.price + (apt.charges || 0)).toFixed(2))}€</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>/mois CC</span>
                    </div>
                    {apt.slug ? (
                      <Link to={`/logement/${apt.slug}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', textDecoration: 'none' }}>Voir</Link>
                    ) : (
                      <button disabled className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', opacity: 0.5 }}>Erreur</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card" style={{marginBottom: '3rem'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>APL, ALS, caution Visale : les aides pour les étudiants</h2>
          <p style={{color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem'}}>
            Les logements loués ici sont <strong>éligibles aux aides au logement de la CAF (APL ou ALS)</strong> selon votre situation : la demande se fait sur caf.fr dès la signature du bail. Côté garant, de nombreux propriétaires acceptent la <strong>garantie Visale</strong> (Action Logement) — <strong>gratuite</strong>, elle remplace un garant physique, idéale pour un étudiant sans caution familiale. Le <strong>dépôt de garantie</strong> est généralement d'un mois de loyer hors charges.
          </p>
        </div>

        <div className="glass-card" style={{marginBottom: '3rem'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>Comment louer en direct, étape par étape</h2>
          <ol style={{color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', paddingLeft: '1.5rem'}}>
            <li style={{marginBottom: '0.8rem'}}><strong>Vous repérez un bien</strong> disponible sur le site (studios, T1, T2 à Limoges).</li>
            <li style={{marginBottom: '0.8rem'}}><strong>Vous contactez directement le propriétaire</strong> via le formulaire.</li>
            <li style={{marginBottom: '0.8rem'}}><strong>Vous visitez</strong> le logement avec le propriétaire.</li>
            <li style={{marginBottom: '0.8rem'}}><strong>Vous constituez votre dossier</strong> et, s'il est retenu, <strong>le bail est signé en direct</strong>.</li>
            <li><strong>Vous récupérez vos clés.</strong> À aucune étape vous ne payez de frais d'agence.</li>
          </ol>
        </div>

        <div style={{marginBottom: '3rem'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem'}}>FAQ : Logement Étudiant à Limoges</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {faqData.map((item, index) => (
              <div key={index} className="glass-card" style={{background: 'rgba(255,255,255,0.02)'}}>
                <h3 style={{fontSize: '1.2rem', marginBottom: '0.8rem'}}>{item.question}</h3>
                <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: '4rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/" className="btn btn-primary" style={{fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none'}}>
            Voir tous les logements
          </Link>
          <Link to="/deposer-dossier" className="btn btn-outline" style={{fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none'}}>
            Déposer un dossier
          </Link>
        </div>

      </main>
    </>
  );
}
