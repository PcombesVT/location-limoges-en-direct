import React, { useState } from 'react';
import { Home } from './pages/Home';
import { Hub } from './pages/Hub';
import { Apartment } from './pages/Apartment';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedAptId, setSelectedAptId] = useState(null);

  const handleViewApt = (id) => {
    setSelectedAptId(id);
    setCurrentPage('apartment');
    window.scrollTo(0, 0);
  };

  const navItemStyle = (tabCode) => ({
    marginRight: '1rem',
    border: 'none',
    background: currentPage === tabCode ? 'rgba(255,255,255,0.1)' : 'transparent',
    fontWeight: currentPage === tabCode ? '600' : 'normal'
  });

  return (
    <>
      <nav>
        <div className="container nav-content">
          <div 
            className="logo text-gradient" 
            style={{cursor: 'pointer'}} 
            onClick={() => setCurrentPage('home')}
          >
            Location-Limoges-En-Direct.fr
          </div>
          <div>
            <button onClick={() => setCurrentPage('home')} className="btn btn-outline" style={navItemStyle('home')}>Les Locs</button>
            <button onClick={() => setCurrentPage('hub')} className="btn btn-outline" style={navItemStyle('hub')}>Le Guide SEO</button>
            <button className="btn btn-primary">Déposer un Dossier</button>
          </div>
        </div>
      </nav>

      {currentPage === 'home' && <Home onViewApt={handleViewApt} />}
      {currentPage === 'hub' && <Hub />}
      {currentPage === 'apartment' && <Apartment id={selectedAptId} onBack={() => setCurrentPage('home')} />}
      
      <footer style={{borderTop: '1px solid var(--glass-border)', padding: '2rem 0', marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
        <p>Location-Limoges-En-Direct.fr - Zéro frais d'agence, de particulier à particulier.</p>
        <p style={{marginTop: '0.5rem'}}>Garantie Visale et ALS / APL acceptées.</p>
      </footer>
    </>
  );
}

export default App;
