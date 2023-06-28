import React, { useEffect, useState } from 'react';
import axios from "axios";

function App() {
  const [livres, setLivres] = useState([]);
  const [nouveauLivre, setNouveauLivre] = useState({});
  const [livreModifie, setLivreModifie] = useState({});
  const [livreSupprime, setLivreSupprime] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/livres')
        .then(response => {
          setLivres(response.data);
        })
        .catch(error => {
          console.error(error);
        });
  }, []);

  const handleAjouterLivre = () => {
    axios.post('http://localhost:3000/livres', nouveauLivre)
        .then(response => {
          console.log(response.data);
          setLivres([...livres, nouveauLivre]);
          setNouveauLivre({});
        })
        .catch(error => {
          console.error(error);
        });
  };

  const handleModifierLivre = (id) => {
    axios.put(`http://localhost:3000/livres/${id}`, livreModifie)
        .then(response => {
          console.log(response.data);
          const index = livres.findIndex(livre => livre.id === id);
          const nouveauxLivres = [...livres];
          nouveauxLivres[index] = { ...nouveauxLivres[index], ...livreModifie };
          setLivres(nouveauxLivres);
          setLivreModifie({});
        })
        .catch(error => {
          console.error(error);
        });
  };

  const handleSupprimerLivre = (id) => {
    axios.delete(`http://localhost:3000/livres/${id}`)
        .then(response => {
          console.log(response.data);
          const index = livres.findIndex(livre => livre.id === id);
          const nouveauxLivres = [...livres];
          nouveauxLivres.splice(index, 1);
          setLivres(nouveauxLivres);
          setLivreSupprime(id);
        })
        .catch(error => {
          console.error(error);
        });
  };

  return (
      <div>
        <h1>Liste des livres</h1>
        <ul>
          {livres.map(livre => (
              <li key={livre.id}>
                {livre.titre} - {livre.auteur}
                <button onClick={() => handleModifierLivre(livre.id)}>Modifier</button>
                <button onClick={() => handleSupprimerLivre(livre.id)}>Supprimer</button>
              </li>
          ))}
        </ul>

        <h2>Ajouter un livre</h2>
        <form onSubmit={e => { e.preventDefault(); handleAjouterLivre(); }}>
          <input
              type="text"
              placeholder="Titre"
              value={nouveauLivre.titre || ''}
              onChange={e => setNouveauLivre({ ...nouveauLivre, titre: e.target.value })}
              required
          />
          <input
              type="text"
              placeholder="Auteur"
              value={nouveauLivre.auteur || ''}
              onChange={e => setNouveauLivre({ ...nouveauLivre, auteur: e.target.value })}
              required
          />
          <button type="submit">Ajouter</button>
        </form>

        {livreSupprime && <p>Livre supprimé avec succès : {livreSupprime}</p>}
      </div>
  );
}

export default App;
