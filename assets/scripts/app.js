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
            img.classList.add('icone');
            p.textContent = element.name;
            a.appendChild(p);
            a.appendChild(img);
            a.addEventListener('click', () => {
                afficherLeaderboardBrawlers(element.id, element.name);
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

function afficherLeaderboardBrawlers(idBrawler, nomBrawler) {
    getJSON(`${proxy}/v1/rankings/global/brawlers/${idBrawler}`).then(data => {
        if (data && data.items) {
            let liste = document.getElementById('leaderBoard-Players-Brawlers');
            liste.innerHTML = "";
            document.getElementById('nomBrawler').innerHTML = nomBrawler;
            data.items.forEach(element => {
                let li = document.createElement('li');
                let baliseNom = document.createElement('p');
                let baliseRang = document.createElement('p');
                let baliseImage = document.createElement('img');
                let baliseImageTrophes = document.createElement('img');
                let baliseTrophes = document.createElement('p');

                baliseImage.src = 'https://cdn.brawlify.com/profile-icons/regular/' + element.icon.id + '.png';
                baliseImage.classList.add('iconeJoueur');
                baliseNom.textContent = element.name;
                baliseNom.style.color = convertisseurCouleur(element.nameColor);
                baliseNom.classList.add('nomJoueur');
                baliseRang.textContent = element.rank;
                baliseTrophes.textContent = element.trophies;
                baliseImageTrophes.src = 'https://cdn-misc.brawlify.com/icon/trophy.png';
                baliseImageTrophes.classList.add('iconeJoueur');

                li.appendChild(baliseRang);
                li.appendChild(baliseImage);
                li.appendChild(baliseNom);
                li.appendChild(baliseImageTrophes);
                li.appendChild(baliseTrophes);
                /*a.addEventListener('click', () => {
                    afficherInfoJoueurs(element.tag);
                });*/
                liste.appendChild(li);
            });
        }
    });
}

const btnLancerRecherche = document.querySelector('#btn-lancer-recherche');
const champDeRecherche = document.querySelector('#champDeRecherche');
const blocGifAttente = document.querySelector('#bloc-gif-attente');
const blocResultats = document.querySelector('#bloc-resultats');

function convertisseurCouleur(hexaCouleur) {
    // Supprimer le préfixe "0x" et ajouter "#"
    const cssColor = `#${hexaCouleur.slice(2)}`;
    return cssColor;
  }
// Fonction de calcul de la distance de Levenshtein
function distanceLevenshtein(str1, str2) {
    const matrice = [];  // Matrice pour stocker les distances de Levenshtein
    let strlen1 = str1.length;
    let strlen2 = str2.length;
    let cout; // Variable qui va stocker le coût de substitution (0 ou 1)

    // Si l'une des chaînes est vide, la distance est la longueur de l'autre chaîne
    if (strlen1 === 0) { return strlen2; }
    if (strlen2 === 0) { return strlen1; }

    // Initialisation de la première ligne et de la première colonne de la matrice
    for (let i = 0; i <= strlen1; i++) {
        matrice[i] = [i];  // Remplir la première colonne
    }
    for (let j = 0; j <= strlen2; j++) {
        matrice[0][j] = j;  // Remplir la première ligne
    }

    // Remplissage de la matrice avec les distances de Levenshtein
    for (let i = 1; i <= strlen1; i++) {
        for (let j = 1; j <= strlen2; j++) {
            // Si les caractères des deux chaînes sont identiques, coût de 0 (pas de substitution)
            cout = (str1[i - 1] === str2[j - 1]) ? 0 : 1;

            // Calcul de la distance : insertion, suppression ou substitution
            matrice[i][j] = Math.min(
                matrice[i - 1][j] + 1,  // Insertion
                matrice[i][j - 1] + 1,  // Suppression
                matrice[i - 1][j - 1] + cout  // Substitution
            );
        }
    }
    // La distance de Levenshtein se trouve dans le coin inférieur droit de la matrice
    return matrice[strlen1][strlen2];
}

const rechercher = async () => {
    const recherche = champDeRecherche.value.trim();
    // Si la recherche est vide, on ne fait rien
    if (!recherche) {
        return;
    }
    btnLancerRecherche.disabled = true;
    blocGifAttente.style.display = 'block'; // Apparition du gif d'attente
    const apiUrl = `${proxy}/v1/brawlers`; // Utilisation de l'API proxy pour récupérer les brawlers

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

        if (data.items && data.items.length > 0) {
            blocResultats.innerHTML = '';
            const results = data.items.filter(brawler => {
                // Comparer chaque brawler avec la recherche via Levenshtein
                return distanceLevenshtein(brawler.name.toLowerCase(), recherche.toLowerCase()) <= 3; // Seuil de 3 pour la distance de Levenshtein
            });

            if (results.length > 0) {
                results.forEach(result => {
                    const p = document.createElement('p');
                    p.classList.add('res');
                    p.textContent = result.name;
                    blocResultats.appendChild(p);
                });
            } else {
                blocResultats.innerHTML = '<p>(Aucun résultat trouvé)</p>';
            }
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












