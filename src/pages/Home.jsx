import React from 'react';
import { apartments } from '../data/apartments';

export function Home({ onViewApt }) {
  return (
    <>
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
                <button onClick={() => onViewApt(apt.id)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer' }}>Voir la fiche</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
