const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

const app = express();
const port = 4000;


app.use(cors());
app.use(express.json());


const csvFilePath = path.join(__dirname, 'apartments.csv');


if (!fs.existsSync(csvFilePath)) {
  const csvHeaders = ['id', 'nmRooms', 'surface', 'nbWindows', 'price',
    'annee', 'balcon', 'garage', 'note', 'price_category', 'ville'];
  fs.writeFileSync(csvFilePath, csvHeaders.join(',') + '\n');
}




app.get('/apartments', (req, res) => {
  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier CSV', err);
      return res.status(500).json({ error: 'Impossible de lire les appartements' });
    }
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const apartments = lines.slice(1).map(line => {
      const values = line.split(',');
      const apartment = {};
      headers.forEach((header, index) => {
        apartment[header] = values[index];
      });
      return apartment;
    });
    res.json(apartments);
  });
});





app.post('/apartments', (req, res) => {
  const {
    nmRooms, surface, nbWindows, price,
    annee, balcon, garage, note, price_category, ville
  } = req.body;


  if (!nmRooms || !surface || !nbWindows || !price || !annee || !ville) {
    return res.status(400).json({ error: 'Certains champs requis sont manquants' });
  }


  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier CSV', err);
      return res.status(500).json({ error: 'Impossible de lire les appartements' });
    }

    let lastId = 0;
    const lines = data.trim().split('\n');
    if (lines.length > 1) {
      const lastLine = lines[lines.length - 1];
      const lastApartmentValues = lastLine.split(',');
      const idIndex = lines[0].split(',').indexOf('id');
      if (idIndex >= 0) {
        lastId = parseInt(lastApartmentValues[idIndex]);
      }
    }

    const newId = lastId + 1;

    const newApartment = {
      id: newId,
      nmRooms, surface, nbWindows, price,
      annee, balcon, garage, note, price_category, ville
    };


    const parser = new Parser({ header: false });
    const csv = parser.parse(newApartment);

    fs.appendFile(csvFilePath, csv + '\n', (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture dans le fichier CSV', err);
        return res.status(500).json({ error: 'Échec de l\'enregistrement de l\'appartement' });
      }
      res.status(201).json({ message: 'Appartement ajouté avec succès', apartment: newApartment });
    });
  });
});




app.delete('/apartments/:id', (req, res) => {
  const apartmentId = req.params.id;

  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier CSV', err);
      return res.status(500).json({ error: 'Impossible de lire les appartements' });
    }

    const lines = data.trim().split('\n');
    const headers = lines[0];
    const idIndex = headers.split(',').indexOf('id');

    if (idIndex === -1) {
      return res.status(500).json({ error: 'Format CSV invalide : Colonne ID manquante' });
    }

    const updatedLines = lines.filter((line, index) => {
      if (index === 0) return true; // Garder les en-têtes
      const values = line.split(',');
      return values[idIndex] !== apartmentId;
    });

    fs.writeFile(csvFilePath, updatedLines.join('\n') + '\n', (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture dans le fichier CSV', err);
        return res.status(500).json({ error: 'Échec de la suppression de l\'appartement' });
      }
      res.json({ message: 'Appartement supprimé avec succès' });
    });
  });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});