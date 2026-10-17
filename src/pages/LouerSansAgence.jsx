import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export function LouerSansAgence() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqData = [
    {
      question: "Comment louer de particulier à particulier à Limoges ?",
      answer: "Parcourez les annonces du site : chaque logement est publié directement par son propriétaire. Vous le contactez via le formulaire, convenez d'une visite, puis signez le bail en direct avec lui. Aucune agence n'intervient, donc aucun frais d'agence — vous louez de particulier à particulier, de bout en bout."
    },
    {
      question: "Quelle différence entre louer de particulier à particulier et passer par une agence ?",
      answer: "En location de particulier à particulier, il n'y a pas de frais d'agence (souvent l'équivalent d'un mois de loyer économisé) et vous échangez directement avec le propriétaire, qui connaît son bien. L'agence, elle, facture ses honoraires et sert d'intermédiaire. Ici, tout se fait en direct, de particulier à particulier — plus simple, plus rapide, moins cher."
    },
    {
      question: "Peut-on vraiment louer un appartement à Limoges sans frais d'agence ?",
      answer: "Oui. Tous les logements de ce site — appartements, studios, T1 et T2 — sont proposés directement par leurs propriétaires, donc sans frais d'agence ni commission. Vous ne payez aucun honoraire d'intermédiaire : vous louez en direct, de particulier à particulier."
    },
    {
      question: "Faut-il payer des frais d'agence pour louer sur ce site ?",
      answer: "Non. Vous louez directement au propriétaire, sans aucun frais d'agence ni commission. Vous ne payez que le loyer et le dépôt de garantie prévus au bail."
    },
    {
      question: "Quels documents pour un dossier de location entre particuliers ?",
      answer: "En général : une pièce d'identité, des justificatifs de revenus (3 derniers bulletins de salaire ou dernier avis d'imposition), un justificatif de domicile, et selon la situation un garant (avec ses propres justificatifs). Le propriétaire vous précise les pièces attendues."
    },
    {
      question: "Comment se passent la visite et la signature du bail sans agence ?",
      answer: "Vous convenez d'un rendez-vous directement avec le propriétaire pour visiter. Si le logement vous convient et que votre dossier est retenu, le bail est signé directement entre vous et le propriétaire (contrat conforme à la loi), accompagné d'un état des lieux d'entrée."
    },
    {
      question: "Peut-on toucher les APL en louant en direct auprès d'un propriétaire ?",
      answer: "Oui. Les aides au logement de la CAF (APL/ALS) ne dépendent pas du passage par une agence : elles s'appliquent à un logement décent loué avec un bail, que le bailleur soit un particulier ou une agence."
    },
    {
      question: "Comment fonctionne le dépôt de garantie ?",
      answer: "Un dépôt de garantie est versé à la signature du bail — en général 1 mois de loyer hors charges pour un logement non meublé, jusqu'à 2 mois pour un meublé. Il vous est restitué en fin de location, déduction faite d'éventuelles réparations constatées à l'état des lieux de sortie."
    },
    {
      question: "Comment éviter les arnaques en location entre particuliers ?",
      answer: "Ne versez jamais d'argent avant d'avoir visité le logement et signé un bail. Méfiez-vous des annonces trop belles ou des propriétaires « à l'étranger » qui refusent la visite. Ici, les biens sont réels, le propriétaire est identifié dans les mentions légales et vous rencontre en personne."
    },
    {
      question: "Est-il possible de louer son appartement sans agence à Limoges ?",
      answer: "Oui, tout à fait. Un propriétaire peut louer son appartement sans agence, en le proposant directement de particulier à particulier. C'est précisément ce que permet ce site : publier son logement, être contacté en direct par les locataires, faire visiter et signer le bail soi-même — sans frais d'agence ni commission. Si vous êtes propriétaire à Limoges, vous pouvez déposer votre annonce et louer en direct."
    },
    {
      question: "Comment trouver un logement sans passer par une agence à Limoges ?",
      answer: "Pour trouver un logement sans passer par une agence à Limoges, parcourez les annonces publiées directement par les propriétaires : studios, T1 et T2 meublés, loués de particulier à particulier. Vous contactez le propriétaire via le formulaire, convenez d'une visite et signez le bail en direct avec lui — aucun intermédiaire, aucun frais d'agence."
    },
    {
      question: "Quelles sont les conditions pour louer un studio à Limoges ?",
      answer: "Pour louer un studio à Limoges de particulier à particulier, le propriétaire demande généralement une pièce d'identité, un justificatif de revenus (ou ceux d'un garant) et une attestation d'assurance habitation. Les studios proposés ici sont meublés et éligibles aux APL/ALS de la CAF, ce qui réduit le loyer réel. Tout se règle en direct avec le propriétaire, sans frais d'agence."
    },
    {
      question: "Comment louer un logement de particulier à particulier à Limoges, sans frais d'agence ?",
      answer: "Parcourez les annonces du site : chaque logement (studio, appartement, T1, T2) est publié directement par son propriétaire. Vous le contactez, vous visitez, vous signez le bail en direct avec lui — sans frais d'agence ni commission. C'est la façon la plus simple de louer un logement de particulier à particulier à Limoges, en traitant directement avec le propriétaire."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Louer un logement de particulier à particulier à Limoges — appartement & studio sans frais d'agence | Location Limoges en Direct</title>
        <meta name="description" content="Louez un appartement ou un studio à Limoges de particulier à particulier, en direct avec le propriétaire et sans frais d'agence. Logements meublés étudiants éligibles APL/ALS, loués entre particuliers." />
        <link rel="canonical" href="https://www.location-limoges-en-direct.fr/louer-sans-agence-limoges" />
        <meta property="og:title" content="Louer un logement de particulier à particulier à Limoges — appartement & studio sans frais d'agence | Location Limoges en Direct" />
        <meta property="og:description" content="Louez un appartement ou un studio à Limoges de particulier à particulier, en direct avec le propriétaire et sans frais d'agence. Logements meublés étudiants éligibles APL/ALS, loués entre particuliers." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.location-limoges-en-direct.fr/louer-sans-agence-limoges" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <header style={{ paddingTop: '120px', paddingBottom: '40px', background: 'var(--bg-color-light)', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>
            Louer un logement sans agence à Limoges, en direct avec le propriétaire
          </h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto'}}>
            À Limoges, il est tout à fait possible de louer <strong>de particulier à particulier</strong>, sans passer par une agence : vous traitez <strong>directement avec le propriétaire</strong>. Pas d'intermédiaire, pas de commission, pas de frais de dossier d'agence. Vous économisez, et vous avez un <strong>interlocuteur unique</strong> du premier contact jusqu'à la remise des clés.
          </p>
        </div>
      </header>
      
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        
        <div className="glass-card" style={{marginBottom: '3rem'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>Louer de particulier à particulier à Limoges, sans intermédiaire</h2>
          <p style={{color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1rem'}}>
            À Limoges, louer <strong>de particulier à particulier</strong> change tout : vous traitez <strong>en direct avec le propriétaire</strong>, sans intermédiaire et sans frais d'agence. Chaque logement de ce site est proposé <strong>directement par son propriétaire</strong> — vous le contactez, vous visitez, vous signez le bail avec lui. Pas de commission, pas de dossier payant, pas de file d'attente d'agence : juste une <strong>location entre particuliers</strong>, claire et directe. Que vous cherchiez un <strong>appartement</strong> ou un studio, vous louez ici <strong>sans frais d'agence</strong> : aucune commission, aucun honoraire, puisque vous traitez <strong>directement avec le propriétaire</strong>. C'est la façon la plus simple de trouver un <strong>studio, un T1 ou un T2 meublé</strong> à Limoges quand on cherche <strong>en direct, sans agence</strong>. Vous cherchez un <strong>studio de particulier à particulier à Limoges</strong> ? C'est la spécialité de ce site : des <strong>studios meublés loués entre particuliers</strong>, en direct avec le propriétaire, sans frais d'agence — parfaits pour un budget étudiant, éligibles APL/ALS. Que vous cherchiez un studio, un <strong>T1</strong>, un <strong>T2</strong>, un appartement ou tout autre <strong>logement</strong>, vous le louez ici <strong>de particulier à particulier</strong> et <strong>sans frais d'agence</strong> : chaque <strong>logement</strong> est proposé <strong>en direct par son propriétaire</strong>, sans commission ni intermédiaire. Louer un <strong>logement direct propriétaire</strong> à Limoges, c'est traiter d'humain à humain, plus simplement et moins cher.
          </p>
          <p style={{color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem'}}>
            Nous proposons régulièrement des <strong>T2 à louer à Limoges, de particulier à particulier</strong> : des deux-pièces meublés ou vides, parfaits pour un couple, une colocation ou un budget un peu plus confortable — toujours <strong>en direct avec le propriétaire</strong> et <strong>sans frais d'agence</strong>.
          </p>
        </div>

        <div className="glass-card" style={{marginBottom: '3rem'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>Comment ça marche (les étapes)</h2>
          <ol style={{color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', paddingLeft: '1.5rem'}}>
            <li style={{marginBottom: '0.8rem'}}><strong>Vous repérez un bien</strong> disponible sur le site (studios, T1, T2 à Limoges).</li>
            <li style={{marginBottom: '0.8rem'}}><strong>Vous contactez directement le propriétaire</strong> via le formulaire — pas de standard d'agence.</li>
            <li style={{marginBottom: '0.8rem'}}><strong>Vous visitez</strong> le logement avec le propriétaire, à un rendez-vous convenu ensemble.</li>
            <li style={{marginBottom: '0.8rem'}}><strong>Vous constituez votre dossier</strong> et, s'il est retenu, <strong>le bail est signé en direct</strong>, dans les règles (contrat de location conforme à la loi + état des lieux d'entrée).</li>
            <li><strong>Vous récupérez vos clés.</strong> À aucune étape vous ne payez de frais d'agence.</li>
          </ol>
        </div>

        <div className="glass-card" style={{marginBottom: '3rem'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>Pourquoi louer en direct</h2>
          <ul style={{color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', listStyle: 'none', paddingLeft: 0}}>
            <li style={{marginBottom: '1rem'}}>✓ <strong>Zéro frais d'agence</strong> : ni honoraires, ni frais de dossier — plusieurs centaines d'euros économisés à l'entrée.</li>
            <li style={{marginBottom: '1rem'}}>✓ <strong>Un seul interlocuteur</strong> : le propriétaire connaît son bien, répond vite et décide vite.</li>
            <li style={{marginBottom: '1rem'}}>✓ <strong>Transparence</strong> : vous savez exactement à qui vous louez et dans quelles conditions.</li>
            <li>✓ <strong>Éligible aux aides</strong> : les logements sont loués avec un vrai bail → <strong>APL/ALS possibles</strong> comme partout.</li>
          </ul>
        </div>

        <div className="glass-card" style={{marginBottom: '3rem', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: '#EF4444'}}>Louer en confiance entre particuliers</h2>
          <p style={{color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem'}}>
            La location entre particuliers fait parfois craindre les arnaques (annonces bidon, faux propriétaires…). Sur ce site, c'est différent : <strong>les biens sont réels et visitables</strong>, le <strong>propriétaire est identifié</strong> (voir les mentions légales) et <strong>joignable directement</strong>. Règle d'or, ici comme ailleurs : <strong>ne versez jamais d'argent avant d'avoir visité le logement et signé le bail.</strong>
          </p>
        </div>

        <div style={{marginBottom: '3rem'}}>
          <h2 style={{borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem'}}>FAQ : Louer un appartement entre particuliers</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {faqData.map((item, index) => (
              <div key={index} className="glass-card" style={{background: 'rgba(255,255,255,0.02)'}}>
                <h3 style={{fontSize: '1.2rem', marginBottom: '0.8rem'}}>{item.question}</h3>
                <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: '4rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/" className="btn btn-primary" style={{fontSize: '1.2rem', padding: '1rem 2rem', textDecoration: 'none'}}>
            Voir tous les logements disponibles
          </Link>
          <Link to="/logement-etudiant-limoges" className="btn btn-outline" style={{fontSize: '1.2rem', padding: '1rem 2rem', textDecoration: 'none'}}>
            Vous êtes étudiant ? Voir les logements étudiants à Limoges →
          </Link>
        </div>

      </main>
    </>
  );
}
