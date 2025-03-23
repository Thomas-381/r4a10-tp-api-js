import express from 'express';
import fetch from 'node-fetch';
const app = express();
const port = 3000;
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjViOGVkNjVjLTEyMmQtNDMzNy1hMTYyLTU0Y2Y3MTYwNDk4MyIsImlhdCI6MTc0Mjc0MjEyNSwic3ViIjoiZGV2ZWxvcGVyL2I4YTQ5MGE0LWQ3MmUtZDVkYy1lYWYyLTExOGVmNzNhOTVhMyIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiODIuNjQuMjQ0LjY2Il0sInR5cGUiOiJjbGllbnQifV19.NXzkII_NscCaPfqMKFLHWMdoO9fzdDtDsgYO4WUNRyTrsc6oiapb5pbLI8aHVEX6sIGWskUqMcl5zCc9Cq9ixg"
app.use(express.json());

// Middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Autoriser les requêtes depuis n'importe quelle origine
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/v1/brawlers', async (req, res) => {
    const apiUrl = 'https://api.brawlstars.com/v1/brawlers';
    
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

app.get('/v1/brawlers/:idChampion', async (req, res) => {
    const idChampion = req.params.idChampion;
    const apiUrl = `https://api.brawlstars.com/v1/brawlers/${idChampion}`;
  
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
app.listen(port, () => {
    console.log(`Serveur proxy en écoute sur le port ${port}`);
});

