import http from 'node:http';
import fs from 'node:fs';
import director from 'director';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';
import fetch from 'node-fetch';

const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjVmNzg1YzYxLWRhZWUtNGE5ZS1iY2I4LTBhYWMxZWExM2VmOCIsImlhdCI6MTc0MjU2MTcyOCwic3ViIjoiZGV2ZWxvcGVyL2I4YTQ5MGE0LWQ3MmUtZDVkYy1lYWYyLTExOGVmNzNhOTVhMyIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNzguMjQzLjE3NS4yNTIiXSwidHlwZSI6ImNsaWVudCJ9XX0.T-eGgjsquYxCofpgO0j3TKd-mhadnEWy0qk8HRQ0NUZu9CWF87YBtqlV6V2Su0HxKiJWHckRPslMOF4snXizkQ"
const port = 8090;

/**
 * Display the main page.
 */
let showMain = function () {
  fs.readFile('./index.html', (err, html) => {
    this.res.writeHeader(200, { 'Content-Type': 'text/html' });
    this.res.write(html);
    this.res.end();
  });
};

/**
 * Proxy request to external API.
 */
let listeChampion = async function () {
  const apiUrl = 'https://api.brawlstars.com/v1/brawlers';

  try {
    const response = await fetch('localhost:3000/v1/brawlers', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    this.res.writeHeader(200, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify(data));
  } catch (error) {
    this.res.writeHeader(500, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify({ error: 'Erreur lors de la requête à l\'API externe' }));
  }
};

// Create a static server
const serve = serveStatic('assets/');

// Specify the routes.
let routes = {
  '/': { get: showMain },
  '/v1/brawlers': { get: listeChampion },
};

// Create the router
let router = new director.http.Router(routes);

// Create the server
let server = http.createServer(function (req, res) {
  router.dispatch(req, res, function (err) {
    if (err) {
      serve(req, res, finalhandler(req, res));
    }
  });
});

// Listen on the specific port
console.log('Server ready to accept requests on port %d', port);
server.listen(port);
