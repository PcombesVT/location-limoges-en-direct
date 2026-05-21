import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Apartment } from './pages/Apartment';
import { sanityClient, urlFor } from './sanity/client';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedAptId, setSelectedAptId] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient.fetch(`*[_type == "appartement" && published == true] | order(_createdAt desc)`).then((data) => {
      const formatted = data.map(doc => ({
        id: doc._id,
        title: doc.title || 'Sans titre public',
        location: doc.address || 'Limoges',
        price: doc.price || 0,
        charges: doc.charges || 0,
        size: doc.surface || 0,
        type: doc.bedrooms > 0 ? `T${doc.bedrooms + 1}` : 'Studio',
        available: doc.availableDate ? new Date(doc.availableDate) <= new Date() : true,
        images: doc.images ? doc.images.map(img => urlFor(img).url()) : ['https://via.placeholder.com/800x400?text=Pas+de+photo'],
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
            <button className="btn btn-primary">Déposer un Dossier</button>
          </div>
        </div>
      </nav>

      {currentPage === 'home' && <Home onViewApt={handleViewApt} apartments={apartments} loading={loading} />}
      {currentPage === 'apartment' && <Apartment apt={apartments.find(a => a.id === selectedAptId)} onBack={() => setCurrentPage('home')} />}
      
      <footer style={{borderTop: '1px solid var(--glass-border)', padding: '2rem 0', marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
        <p>Location-Limoges-En-Direct.fr - Zéro frais d'agence, de particulier à particulier.</p>
        <p style={{marginTop: '0.5rem'}}>Garantie Visale et ALS / APL acceptées.</p>
      </footer>
    </>
  );
}

export default App;

