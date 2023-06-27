
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());


app.get('/livres', (req, res) => {
    fs.readFile('livres.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erreur serveur');
            return;
        }
        const livres = JSON.parse(data);
        res.json(livres);
    });
});

app.get('/livres/:id', (req, res) => {
    const livreId = req.params.id;
    fs.readFile('livres.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erreur serveur');
            return;
        }
        const livres = JSON.parse(data);
        const livre = livres.find((livre) => livre.id.toString() === livreId);
        if (!livre) {
            res.status(404).send('Livre non trouvé');
            return;
        }
        res.json(livre);
    });
});



app.post('/livres', (req, res) => {
    const nouveauLivre = req.body;
    fs.readFile('livres.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erreur serveur');
            return;
        }
        const livres = JSON.parse(data);
        livres.push(nouveauLivre);
        fs.writeFile('livres.json', JSON.stringify(livres), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.send('Livre ajouté avec succès');
        });
    });
});

app.put('/livres/:id', (req, res) => {
    const livreId = req.params.id;
    const livreModifie = req.body;
    fs.readFile('livres.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erreur serveur');
            return;
        }
        let livres = JSON.parse(data);
        const livreIndex = livres.findIndex((livre) => livre.id === livreId);
        if (livreIndex === -1) {
            res.status(404).send('Livre non trouvé');
            return;
        }
        livres[livreIndex] = { ...livres[livreIndex], ...livreModifie };
        fs.writeFile('livres.json', JSON.stringify(livres), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.send('Livre modifié avec succès');
        });
    });
});

app.delete('/livres/:id', (req, res) => {
    const livreId = req.params.id;
    fs.readFile('livres.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erreur serveur');
            return;
        }
        let livres = JSON.parse(data);
        const livreIndex = livres.findIndex((livre) => livre.id === livreId);
        if (livreIndex === -1) {
            res.status(404).send('Livre non trouvé');
            return;
        }
        livres.splice(livreIndex, 1);
        fs.writeFile('livres.json', JSON.stringify(livres), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.send('Livre supprimé avec succès');
        });
    });
});

app.listen(PORT, () => {
    console.log("Serveur à l'écoute");
});
