import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { sanityClient, urlFor } from '../sanity/client';

export function Apartment() {
  const { slug } = useParams();
  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    sanityClient.fetch(`*[_type == "appartement" && slug.current == $slug][0]`, { slug }).then((doc) => {
      if (doc) {
        setApt({
          id: doc._id,
          title: doc.title || 'Sans titre public',
          location: doc.address || 'Limoges',
          price: doc.price || 0,
          charges: doc.charges || 0,
          size: doc.surface || 0,
          type: doc.bedrooms > 0 ? `T${doc.bedrooms + 1}` : 'Studio',
          available: doc.availableDate ? new Date(doc.availableDate) <= new Date() : true,
          availableDateStr: doc.availableDate ? new Date(doc.availableDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : null,
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
          description: doc.description || 'Description à venir.',
          dpe: doc.dpe || null,
          ges: doc.ges || null,
          rented: doc.rented || false,
          apl: doc.apl || false,
          als: doc.als || false,
          floor: doc.floor || null,
          heatingType: doc.heatingType || null
        });
      }
      setLoading(false);
    }).catch(err => {
      console.error("Erreur de chargement Sanity:", err);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Chargement de l'appartement...</h2>
      </div>
    );
  }

  if (!apt) {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Appartement introuvable</h2>
        <Link to="/" className="btn btn-primary" style={{marginTop: '2rem', textDecoration: 'none'}}>← Retour à l'accueil</Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "name": apt.title,
    "description": apt.description,
    "numberOfRoomsTotal": apt.type === 'Studio' ? 1 : parseInt(apt.type.replace('T', '')),
    "floorSize": { "@type": "QuantitativeValue", "value": apt.size, "unitCode": "MTK" },
    "address": { "@type": "PostalAddress", "streetAddress": apt.location, "addressLocality": "Limoges", "postalCode": "87000", "addressCountry": "FR" },
    "offers": { "@type": "Offer", "price": apt.price, "priceCurrency": "EUR", "availability": apt.available ? "https://schema.org/InStock" : "https://schema.org/PreOrder" }
  };

  const handleDepositClick = () => {
    const input = document.getElementById('bien-input');
    if (input) input.value = apt.title;
    const modal = document.getElementById('lead-modal');
    if (modal) modal.showModal();
  };

  return (
    <>
      <Helmet>
        <title>{`${apt.title} | Location Limoges en Direct`}</title>
        <meta name="description" content={`Découvrez ce ${apt.type} de ${apt.size}m² à louer sur Limoges. Loyer : ${apt.price}€/mois sans frais d'agence.`} />
        <link rel="canonical" href={`https://www.location-limoges-en-direct.fr/logement/${slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <header style={{ paddingTop: '120px', paddingBottom: '40px', background: 'var(--bg-color-light)' }}>
        <div className="container">
          <Link to="/" className="btn btn-outline" style={{marginBottom: '2rem', textDecoration: 'none'}}>← Retour aux locs</Link>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className={`badge ${apt.rented ? '' : apt.available ? 'badge-success' : 'badge-warning'}`} style={apt.rented ? {background: '#EF4444', color: 'white'} : {}}>
              {apt.rented ? 'DÉJÀ LOUÉ' : apt.available ? 'Disponible de suite' : `Dispo le ${apt.availableDateStr}`}
            </span>
            <span className="badge" style={{background: 'rgba(236,72,153,0.1)', color: '#ec4899'}}>🔥 0€ Frais d'Agence</span>
            {apt.apl && apt.als && <span className="badge" style={{background: 'rgba(56,189,248,0.1)', color: '#38bdf8'}}>Eligible APL / ALS</span>}
            {apt.apl && !apt.als && <span className="badge" style={{background: 'rgba(56,189,248,0.1)', color: '#38bdf8'}}>Eligible APL</span>}
            {!apt.apl && apt.als && <span className="badge" style={{background: 'rgba(56,189,248,0.1)', color: '#38bdf8'}}>Eligible ALS</span>}
          </div>

          <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>{apt.title}</h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)'}}>📍 {apt.location}</p>
        </div>
      </header>
      
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
          
          {/* Colonne Gauche : Photos & Description */}
          <div>
            <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
              <img src={apt.images[0]} alt={apt.title} style={{width: '100%', height: '450px', objectFit: 'cover', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-lg)', filter: apt.rented ? 'grayscale(100%) opacity(60%)' : 'none'}} />
              {apt.rented && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '1rem 2rem', fontSize: '2rem', fontWeight: 'bold', borderRadius: '8px', border: '2px solid white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
                  DÉJÀ LOUÉ
                </div>
              )}
            </div>
            
            {apt.images.length > 1 && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
                {apt.images.slice(1).map((img, idx) => (
                  <img key={idx} src={img} alt={`${apt.title} - vue ${idx+2}`} style={{width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', filter: apt.rented ? 'grayscale(80%) opacity(80%)' : 'none'}} onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} onClick={() => window.open(img, '_blank')} />
                ))}
              </div>
            )}
            
            <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginTop: '3rem', fontSize: '1.8rem'}}>Description</h2>
            <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap'}}>{apt.description}</p>
            
            <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginTop: '3rem', fontSize: '1.8rem'}}>Prestations Incluses</h2>
            <ul style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-secondary)', marginTop: '2rem'}}>
              {apt.features.map(f => (
                <li key={f} style={{display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.1rem'}}>
                  <span style={{color: 'var(--accent-secondary)'}}>✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Droite : Prix et Action */}
          <div className="glass-card" style={{position: 'sticky', top: '120px', border: '1px solid rgba(255,255,255,0.15)'}}>
            <div style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem'}}>
              <div style={{fontSize: '3rem', fontWeight: 'bold'}}>{apt.price}€<span style={{fontSize:'1.2rem', fontWeight:'normal', color:'var(--text-secondary)'}}> / mois</span></div>
              <div style={{color: 'var(--text-secondary)'}}>Loyer toutes charges comprises</div>
              <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Dont {apt.charges}€ de charges.</div>
            </div>
            
            <div style={{marginBottom: '2rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed rgba(255,255,255,0.1)'}}>
                <span style={{color: 'var(--text-secondary)'}}>Type</span>
                <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{apt.type}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed rgba(255,255,255,0.1)'}}>
                <span style={{color: 'var(--text-secondary)'}}>Surface</span>
                <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{apt.size} m²</span>
              </div>
              {apt.floor && (
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed rgba(255,255,255,0.1)'}}>
                  <span style={{color: 'var(--text-secondary)'}}>Étage</span>
                  <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{apt.floor}</span>
                </div>
              )}
              {apt.heatingType && (
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed rgba(255,255,255,0.1)'}}>
                  <span style={{color: 'var(--text-secondary)'}}>Chauffage</span>
                  <span style={{fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'right'}}>{apt.heatingType}</span>
                </div>
              )}
              {(apt.dpe || apt.ges) && (
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed rgba(255,255,255,0.1)'}}>
                  <span style={{color: 'var(--text-secondary)'}}>DPE / GES</span>
                  <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{apt.dpe || '-'} / {apt.ges || '-'}</span>
                </div>
              )}
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: 'var(--text-secondary)'}}>Honoraires d'agence</span>
                <span style={{fontWeight: 'bold', color: '#10b981', fontSize: '1.1rem'}}>Gratuit (0 €)</span>
              </div>
            </div>

            <button onClick={handleDepositClick} disabled={apt.rented} className="btn btn-primary" style={{width: '100%', marginBottom: '1rem', padding: '1.2rem', cursor: apt.rented ? 'not-allowed' : 'pointer', opacity: apt.rented ? 0.5 : 1}}>
              {apt.rented ? 'Appartement Loué ❌' : 'Déposer mon dossier 🚀'}
            </button>
            <p style={{fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-secondary)'}}>
              {apt.rented ? 'Cet appartement n\'accepte plus de candidatures pour le moment.' : 'Contactez moi en direct. Etude rapide des garanties.'}
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
