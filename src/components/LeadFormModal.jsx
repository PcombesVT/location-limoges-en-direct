import React, { useState } from 'react';

export function LeadFormModal() {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const form = e.target;
    const formData = new FormData(form);
    const payload = new URLSearchParams(formData);

    try {
      // 1) Formspree (email)
      await fetch('https://formspree.io/f/xlgagzpy', {
        method: 'POST',
        body: payload,
        headers: { 'Accept': 'application/json' }
      });
      
      // 2) Sheet de suivi (ne pas attendre la réponse, garder keepalive)
      fetch('https://script.google.com/macros/s/AKfycbxs8YesW21u5Y-wuUlg5-GoiTprz-B7OV33iBTIZzgua6QhjQZf7yw0AobsjGeTg-nyaw/exec', {
        method: 'POST', 
        body: payload, 
        keepalive: true
      }).catch(err => console.error("Erreur GAS:", err));

      setStatus('success');
      setTimeout(() => {
        document.getElementById('lead-modal').close();
        setStatus('idle');
        form.reset();
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <dialog id="lead-modal" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#111827', color: 'white', maxWidth: '500px', width: '90%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Déposer un Dossier</h2>
        <button onClick={() => document.getElementById('lead-modal').close()} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
      </div>

      {status === 'success' ? (
        <div className="badge badge-success" style={{ display: 'block', padding: '1rem', textAlign: 'center', fontSize: '1.1rem' }}>
          ✅ Votre demande a bien été envoyée ! Nous vous recontacterons très vite.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Champs cachés obligatoires */}
          <input type="hidden" name="source_site" value="location-limoges-en-direct.fr" />
          <input type="hidden" name="bien" id="bien-input" value="" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Prénom</label>
              <input type="text" name="prenom" required style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1F2937', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nom</label>
              <input type="text" name="nom" required style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1F2937', color: 'white' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
            <input type="email" name="email" required style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1F2937', color: 'white' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Téléphone</label>
            <input type="tel" name="telephone" required style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1F2937', color: 'white' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Budget mensuel (€)</label>
              <input type="number" name="budget" required style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1F2937', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Date de dispo</label>
              <input type="date" name="dispo" required style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1F2937', color: 'white' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Message ou Questions</label>
            <textarea name="message" rows="3" style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1F2937', color: 'white' }}></textarea>
          </div>

          <button type="submit" disabled={status === 'submitting'} className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </button>
          
          {status === 'error' && (
            <p style={{ color: '#EF4444', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.5rem' }}>Une erreur est survenue. Veuillez réessayer.</p>
          )}
        </form>
      )}
    </dialog>
  );
}
