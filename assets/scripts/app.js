const api_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY3MmFhYmE5LThiYzEtNGNlNi1iOGI5LTlhMjBkMmY3NGRlMSIsImlhdCI6MTc0MjY2NTYwOSwic3ViIjoiZGV2ZWxvcGVyL2NjNjQzYTMwLWFkNDktZWQ2Mi0wYzBjLWZjNjhiMmViYWVkYSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNDYuMTkzLjQuOTgiXSwidHlwZSI6ImNsaWVudCJ9XX0.r4Bu2aGp6qL_2zCrw6cOeiXQg3Vgyx1hrOiwJXB-IPrcgv2r9T0EL-uuBsxoh05CI_NGYlO5vxPKopHRVOPscA";
const proxy = "http://localhost:3000"; // Proxy local qui gère CORS

const listeBrawlers = `${proxy}/v1/brawlers`;
const mapsDispos = `${proxy}/v1/events/rotation`;

const getJSON = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_token}` // Ajout du token pour le proxy
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Réponse de ${url}:`, data); // Debug
        return data;
    } catch (error) {
        console.error("Erreur API :", error);
        return null;
    }
};

getJSON(listeBrawlers).then(data => {
    if (data && data.items) {
        let liste = document.getElementById('liste-brawlers');
        liste.innerHTML = "";
        data.items.forEach(element => {
            let li = document.createElement('li');
            li.textContent = element.name;
            liste.appendChild(li);
        });
    }
});

getJSON(mapsDispos).then(data => {
    if (data && data.eventRotation) {
        let liste = document.getElementById('liste-maps');
        liste.innerHTML = "";
        data.eventRotation.forEach(event => {
            let li = document.createElement('li');
            li.textContent = `${event.event.mode} - ${event.event.map}`;
            liste.appendChild(li);
        });
    }
});


const btnLancerRecherche = document.querySelector('#btn-lancer-recherche');
const champDeRecherche = document.querySelector('#champDeRecherche');
const blocGifAttente = document.querySelector('#bloc-gif-attente');
const blocResultats = document.querySelector('#bloc-resultats');

// Fonction de recherche asynchrone
const rechercher = async () => {
    const recherche = champDeRecherche.value.trim();
    // Si la recherche est vide, on ne fait rien
    if (!recherche) {
        return;
    }

    btnLancerRecherche.disabled = true;
    blocGifAttente.style.display = 'block'; // Apparition du gif d'attente
    const apiUrl = `https://api.brawlstars.com/search?q=${encodeURIComponent(recherche)}&format=json`;

    try {
        console.log("Recherche lancée");
        const response = await fetch(apiUrl);
        console.log("Réponse reçue");

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        console.log("Données de l'API", data);
        blocGifAttente.style.display = 'none'; // Cache le gif d'attente

        if (data.results && data.results.length > 0) {
            blocResultats.innerHTML = ''; 
            data.results.forEach(result => {
                const p = document.createElement('p');
                p.classList.add('res');
                p.textContent = result.title;
                blocResultats.appendChild(p);
            });
        } else {
            blocResultats.innerHTML = '<p>(Aucun résultat trouvé)</p>';
        }
    } catch (error) {
        blocGifAttente.style.display = 'none';
        blocResultats.innerHTML = '<p>Erreur lors de la recherche.</p>';
        console.error(error);
    }
};

// Ajouter l'événement de clic sur le bouton de recherche
btnLancerRecherche.addEventListener('click',rechercher);





/*async function fonctionlisteBrawlers(listeBoutonsEditable) {
    console.log("Appel API");
    return await fetch("https://api.brawlstars.com/v1/brawlers", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjE5ZmI0YTM3LTVhNzYtNGU1My04MzAwLTg4MzI3OThmNzJkNyIsImlhdCI6MTc0MjU1MDgyOCwic3ViIjoiZGV2ZWxvcGVyL2I4YTQ5MGE0LWQ3MmUtZDVkYy1lYWYyLTExOGVmNzNhOTVhMyIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNzguMjQzLjE3Ni4xNzIiXSwidHlwZSI6ImNsaWVudCJ9XX0.G8uqNoWewQrUVLCVDalXM3JBV7pmJhXx-AWhqAlO_7tlYVSLdBjdQSKJlnGMdI3n7ofYJuMS9DytttJHicd7QA",
        }
    });
}

console.log(fonctionlisteBrawlers());    
*/













