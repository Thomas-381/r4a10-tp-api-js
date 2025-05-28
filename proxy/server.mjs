import express from 'express';
import fetch from 'node-fetch';
const app = express();
const port = 3000; // Port sur lequel tournera le serveur
const apiToken = "CLÉ API";
app.use(express.json());

// Middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Autoriser les requêtes depuis n'importe quelle origine
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Répondre aux requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
    next();
});

app.get('/v1/:route', async (req, res) => {
  const route = req.params.route;
  let apiUrl = `https://api.brawlstars.com/v1/` + decodeURIComponent(route);
  apiUrl = apiUrl.replace("#", "%23");
  console.log("Accés à :" + apiUrl);
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiToken}`,
              'Accept': 'application/json',
            },
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la requête à l\'API externe' });
    }
});
app.listen(port, () => {
    console.log(`Serveur proxy en écoute sur le port ${port}`);
});


/*
app.get('/v1/rankings/global/brawlers/:idChampion', async (req, res) => {
    const idChampion = req.params.idChampion;
    const apiUrl = `https://api.brawlstars.com/v1/rankings/global/brawlers/${idChampion}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la requête à l\'API externe' });
    }
});

app.get('/v1/events/rotation', async (req, res) => {
  const idChampion = req.params.idChampion;
  const apiUrl = `https://api.brawlstars.com/v1/events/rotation`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la requête à l\'API externe' });
  }
});
*/
