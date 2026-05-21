import React from 'react';

export function Apartment({ apt, onBack }) {
  if (!apt) {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Appartement introuvable</h2>
        <button onClick={onBack} className="btn btn-primary" style={{marginTop: '2rem'}}>← Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <>
      <header style={{ paddingTop: '120px', paddingBottom: '40px', background: 'var(--bg-color-light)' }}>
        <div className="container">
          <button onClick={onBack} className="btn btn-outline" style={{marginBottom: '2rem'}}>← Retour aux locs</button>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className={`badge ${apt.available ? 'badge-success' : 'badge-warning'}`}>
              {apt.available ? 'Disponible de suite' : 'Bientôt Disponible'}
            </span>
            <span className="badge" style={{background: 'rgba(236,72,153,0.1)', color: '#ec4899'}}>🔥 0€ Frais d'Agence</span>
            <span className="badge" style={{background: 'rgba(56,189,248,0.1)', color: '#38bdf8'}}>Eligible APL / ALS</span>
          </div>

          <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>{apt.title}</h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)'}}>📍 {apt.location}</p>
        </div>
      </header>
      
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
          
          {/* Colonne Gauche : Photos & Description */}
          <div>
            <img src={apt.images[0]} alt={apt.title} style={{width: '100%', height: '450px', objectFit: 'cover', borderRadius: 'var(--border-radius)', marginBottom: '2rem', boxShadow: 'var(--shadow-lg)'}} />
            
            <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginTop: '3rem', fontSize: '1.8rem'}}>Description</h2>
            <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8'}}>{apt.description}</p>
            
            <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginTop: '3rem', fontSize: '1.8rem'}}>Prestations Incluses</h2>
            <ul style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-secondary)', marginTop: '2rem'}}>
              {apt.features.map(f => (
                <li key={f} style={{display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.1rem'}}>
                  <span style={{color: 'var(--accent-secondary)'}}>✓</span> {f}
                </li>
              ))}
            </ul>

            <div className="glass-card" style={{marginTop: '3rem', background: 'rgba(56,189,248,0.05)', borderColor: 'rgba(56,189,248,0.2)'}}>
              <h3 style={{marginBottom: '1rem', color: '#38bdf8', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                <span>📍</span> Distances & Campus (Modele)
              </h3>
              <p style={{color: 'var(--text-secondary)'}}>
                Dès que les adresses exactes seront fournies, ce bloc calculera et affichera automatiquement la distance et le temps de trajet idéaux :
              </p>
              <ul style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>
                <li>🎓 A X min à pied de la Faculté (Sciences, Médecine...)</li>
                <li>🚌 A X min de l'arrêt de bus le plus proche</li>
              </ul>
            </div>
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
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: 'var(--text-secondary)'}}>Honoraires d'agence</span>
                <span style={{fontWeight: 'bold', color: '#10b981', fontSize: '1.1rem'}}>Gratuit (0 €)</span>
              </div>
            </div>

            <button className="btn btn-primary" style={{width: '100%', marginBottom: '1rem', padding: '1.2rem'}}>
              Déposer mon dossier 🚀
            </button>
            <p style={{fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-secondary)'}}>Contactez moi en direct. Etude rapide des garanties.</p>
          </div>

        </div>
      </main>
    </>
  );
}
