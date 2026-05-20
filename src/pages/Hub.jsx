import React from 'react';

const seoArticles = [
  {
    id: "aides-logement",
    title: "100% des Aides (APL, ALS, Visale...)",
    category: "Aides Financières",
    excerpt: "Découvrez comment optimiser vos aides, y compris l'allocation de logement sociale (ALS) pour nos appartements non conventionnés.",
    icon: "💶"
  },
  {
    id: "formations-limoges",
    title: "Se loger selon sa Formation (Médecine, IUT, STAPS)",
    category: "Cursus & Campus",
    excerpt: "Où habiter quand on étudie au CHU Dupuytren, à la FLSH (Vanteaux) ou à la Fac de Sciences ? Notre guide des distances.",
    icon: "🎓"
  },
  {
    id: "quartiers-etudiants",
    title: "Quel quartier étudiant choisir à Limoges ?",
    category: "Guide Limoges",
    excerpt: "Une analyse complète des secteurs clés (La Borie, Vanteaux, Centre-Ville, Isle) pour un quotidien pratique.",
    icon: "📍"
  },
  {
    id: "dossier-location",
    title: "Constituer un Dossier Locataire intraitable (sans agence)",
    category: "Astuces",
    excerpt: "Gagnez du temps en préparant les bonnes pièces pour rassurer immédiatement un propriétaire direct.",
    icon: "📁"
  }
];

export function Hub() {
  return (
    <>
      <header style={{ paddingTop: '120px', paddingBottom: '40px', textAlign: 'center' }}>
        <div className="container animate-fade-in">
          <div className="badge badge-warning" style={{ marginBottom: '1rem', display: 'inline-block' }}>Cocon SEO / Lexique</div>
          <h1>
            Le Guide du <span className="text-gradient">Logement à Limoges</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 2rem auto' }}>
            Pour vous accompagner au-delà de la location, voici notre encyclopédie étudiante. Tout ce qu'il faut savoir sans langue de bois.
          </p>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {seoArticles.map((article) => (
            <div key={article.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{article.icon}</div>
              <span className="badge badge-success" style={{ alignSelf: 'flex-start', marginBottom: '1rem', fontSize: '0.7rem' }}>
                {article.category}
              </span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{article.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1, fontSize: '0.95rem' }}>{article.excerpt}</p>
              <button className="btn btn-outline" style={{width: '100%', fontSize: '0.9rem'}}>Lire le guide</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
