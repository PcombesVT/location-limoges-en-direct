import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { sanityClient, urlFor } from '../sanity/client';

export function Home() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient.fetch(`*[_type == "appartement" && published == true] | order(_createdAt desc)`).then((data) => {
      const formatted = data.map(doc => ({
        id: doc._id,
        slug: doc.slug?.current,
        title: doc.title || 'Sans titre public',
        location: doc.address || 'Limoges',
        price: doc.price || 0,
        charges: doc.charges || 0,
        size: doc.surface || 0,
        type: doc.bedrooms > 0 ? `T${doc.bedrooms + 1}` : 'Studio',
        available: doc.availableDate ? new Date(doc.availableDate) <= new Date() : true,
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
        description: doc.description || 'Description à venir.'
      }));
      setApartments(formatted);
      setLoading(false);
    }).catch(err => {
      console.error("Erreur de chargement Sanity:", err);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Location Étudiant Limoges | Direct Propriétaire 0 Frais</title>
        <meta name="description" content="Trouvez votre logement étudiant à Limoges sans frais d'agence : studios et T2 meublés, en direct propriétaire. Éligible APL/ALS." />
        <link rel="canonical" href="https://www.location-limoges-en-direct.fr/" />
      </Helmet>
      
      <header style={{ paddingTop: '120px', paddingBottom: '60px', textAlign: 'center' }}>
        <div className="container animate-fade-in">
          <div className="badge badge-success" style={{ marginBottom: '1rem', display: 'inline-block' }}>De Particulier à Particulier</div>
          <h1>
            Votre Logement Étudiant à Limoges<br />
            <span className="text-gradient">Sans Frais d'Agence.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Accédez directement à mon parc locatif privé (Studios, T2). Des logements pensés pour les étudiants, sans intermédiaire, 0€ de frais de dossier.
          </p>
          <a href="#appartements" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Voir les appartements disponibles
          </a>
        </div>
      </header>

      <main className="container" id="appartements" style={{ paddingBottom: '80px' }}>
        <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Disponibilités Actuelles</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <p style={{fontSize: '1.2rem'}}>Chargement des appartements disponibles...</p>
          </div>
        ) : apartments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <p style={{fontSize: '1.2rem'}}>Aucun appartement publié pour le moment.</p>
          </div>
        ) : (
          <div className="property-grid">
            {apartments.map((apt) => (
              <div key={apt.id} className="glass-card">
                <img 
                  src={apt.images[0]} 
                  alt={apt.title} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} 
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className={`badge ${apt.available ? 'badge-success' : 'badge-warning'}`}>
                    {apt.available ? 'Disponible' : 'Bientôt Dispo'}
                  </span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{apt.type} • {apt.size}m²</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{apt.title}</h3>
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
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{apt.price}€</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>/mois + {apt.charges}€ ch.</span>
                  </div>
                  {apt.slug ? (
                    <Link to={`/logement/${apt.slug}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'none' }}>Voir la fiche</Link>
                  ) : (
                    <button disabled className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', opacity: 0.5 }}>Erreur d'URL</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
