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
        type: doc.apartmentType ? doc.apartmentType : (doc.bedrooms > 0 ? `T${doc.bedrooms + 1}` : 'Studio'),
        available: doc.availableDate ? new Date(doc.availableDate) <= new Date() : true,
        availableDateStr: doc.availableDate ? new Date(doc.availableDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
        rented: doc.rented || false,
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
        <title>Location appartement & studio à Limoges — entre particuliers, sans agence | En Direct</title>
        <meta name="description" content="Location d'appartements et studios à Limoges en direct du propriétaire. Zéro frais d'agence, entre particuliers. Logements meublés étudiants éligibles APL/ALS." />
        <link rel="canonical" href="https://www.location-limoges-en-direct.fr/" />
      </Helmet>
      
      <header style={{ paddingTop: '120px', paddingBottom: '60px', textAlign: 'center' }}>
        <div className="container animate-fade-in">
          <div className="badge badge-success" style={{ marginBottom: '1rem', display: 'inline-block' }}>De Particulier à Particulier</div>
          <h1>
            Location appartement & studio à Limoges<br />
            <span className="text-gradient">Sans agence, direct propriétaire.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            Louez votre logement étudiant à Limoges en direct avec le propriétaire. Parcourez nos disponibilités de studios, T1 et T2 meublés. Profitez d'une location entre particuliers avec zéro frais d'agence. Logements éligibles aux aides de la CAF (APL / ALS).
          </p>
          <a href="#appartements" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', marginBottom: '3rem', display: 'inline-block' }}>
            Voir les appartements disponibles
          </a>

          {/* BLOC CONFIANCE */}
          <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Louez en toute confiance, entre particuliers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>✅</div>
                <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>Des biens réels & visitables</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>Chaque annonce correspond à un logement existant, que vous visitez avant tout engagement.</p>
              </div>
              <div>
                <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>✅</div>
                <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>Un propriétaire identifié</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>Vous savez à qui vous louez (voir mentions légales), et vous échangez en direct.</p>
              </div>
              <div>
                <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>✅</div>
                <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>Zéro frais d'agence</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>Zéro commission cachée. Vous ne payez que le loyer et le dépôt prévus au bail.</p>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
              🔒 Par prudence, ne versez jamais d'argent avant d'avoir visité le logement et signé le bail.
            </div>
          </div>
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
                <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
                  <img 
                    src={apt.images[0]} 
                    alt={apt.title} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', display: 'block', filter: apt.rented ? 'grayscale(100%) opacity(60%)' : 'none' }} 
                  />
                  {apt.rented && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '0.5rem 1rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '4px', border: '1px solid white', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
                      LOUÉ
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className={`badge ${apt.rented ? '' : apt.available ? 'badge-success' : 'badge-warning'}`} style={apt.rented ? {background: '#EF4444', color: 'white'} : {}}>
                    {apt.rented ? 'DÉJÀ LOUÉ' : apt.available ? 'Disponible' : `Le ${apt.availableDateStr}`}
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
