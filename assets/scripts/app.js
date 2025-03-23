const proxy = "http://localhost:3000"; // Proxy local qui gère CORS

const listeBrawlers = `${proxy}/v1/brawlers`;
const mapsDispos = `${proxy}/v1/events/rotation`;

const getJSON = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"/*,
                "Authorization": `Bearer ${api_token}` */// Pas besoin du token, c'est le proxy qui s'en charge
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
            let a = document.createElement('a');
            let p = document.createElement('p');
            let img = document.createElement('img');
            img.src = 'https://cdn.brawlify.com/brawlers/borders/' + element.id + '.png';
            p.textContent = element.name;
            a.appendChild(p);
            a.appendChild(img);
            a.addEventListener('click', () => {
                liste.innerHTML = "";
            });
            liste.appendChild(a);
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
/*const rechercher = async () => {
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
*/
// Ajouter l'événement de clic sur le bouton de recherche
// btnLancerRecherche.addEventListener('click',rechercher);













