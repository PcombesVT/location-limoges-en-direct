import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Apartment } from './pages/Apartment';
import { LegalMentions } from './pages/LegalMentions';
import { LeadFormModal } from './components/LeadFormModal';

const Layout = () => {
  return (
    <>
      <nav>
        <div className="container nav-content">
          <Link to="/" className="logo text-gradient" style={{textDecoration: 'none'}}>
            Location-Limoges-En-Direct.fr
          </Link>
          <div>
            <Link to="/" className="btn btn-outline" style={{marginRight: '1rem', textDecoration: 'none'}}>Les Locs</Link>
            <button className="btn btn-primary" onClick={() => document.getElementById('lead-modal').showModal()}>Déposer un Dossier</button>
          </div>
        </div>
      </nav>

      <LeadFormModal />

      <Outlet />
      
      <footer style={{borderTop: '1px solid var(--glass-border)', padding: '2rem 0', marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
        <p>Location-Limoges-En-Direct.fr - Zéro frais d'agence, de particulier à particulier.</p>
        <p style={{marginTop: '0.5rem'}}>Garantie Visale et ALS / APL acceptées.</p>
        <p style={{marginTop: '1rem'}}>
          <Link to="/mentions-legales" style={{color: 'var(--text-secondary)', textDecoration: 'none'}}>Mentions Légales</Link>
        </p>
      </footer>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "logement/:slug",
        element: <Apartment />
      },
      {
        path: "mentions-legales",
        element: <LegalMentions />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

