const proxy = "http://localhost:3000/v1/"; // Proxy local qui gère CORS

const limiteTailleRequete = 100; // Limite de joueurs à afficher dans le leaderboard

const listeBrawlers = proxy + encodeURIComponent("brawlers");
const mapsDispos = proxy + encodeURIComponent("events/rotation");

const btnLancerRecherche = document.querySelector('#btn-lancer-recherche');
const champDeRecherche = document.querySelector('#champDeRecherche');
const btnFavoris = document.querySelector('#btn-favoris');
const listeFavoris = document.querySelector("#liste-favoris");
const blocGifAttente = document.querySelector('#bloc-gif-attente');
const blocResultats = document.querySelector('#bloc-resultats');

const btnAffichageListeBrawlers = document.getElementById('btnAffichageListeBrawlers');
const btnAffichageRotaMaps = document.getElementById('btnAffichageRotaMaps');
const btnAffichageLeaderboard = document.getElementById('btnAffichageLeaderboard');

btnAffichageLeaderboard.addEventListener('click', afficherLeaderboard);
btnAffichageListeBrawlers.addEventListener('click', afficherBrawlers);
btnAffichageRotaMaps.addEventListener('click', afficherRotationMaps);
const getJSON = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
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

function afficherBrawlers() {
    getJSON(listeBrawlers).then(data => {
        if (data && data.items) {
            listeBrawlersElement.innerHTML = "";
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
                listeBrawlersElement.appendChild(a);
            });
        }
    });
}

function afficherMaps() {
    getJSON(mapsDispos).then(data => {
        if (data && data.eventRotation) {
            listeMapsElement.innerHTML = "";
            data.eventRotation.forEach(event => {
                let li = document.createElement('li');
                li.innerHTML = `<span style="font-weight: bold;">${event.event.mode}</span> sur la carte <span style="font-weight: bold;">${event.event.map}</span>`;
                liste.appendChild(li);
            });
        }
    });
}


function recupNbReelTrophe(tag) {
}
function afficherLeaderboardBrawlers(idBrawler, nomBrawler) {
    getJSON(proxy + encodeURIComponent("rankings/global/brawlers/" + idBrawler)).then(data => {
        if (data && data.items) {
            leaderBoardElement.innerHTML = "";
            nomBrawlerElement.innerHTML = "avec " + nomBrawler;
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
function afficherLeaderboard() {
    getJSON(proxy + encodeURIComponent(`rankings/global/players?limit=${limiteTailleRequete}`)).then(data => {
        if (data && data.items) {
            let liste = document.getElementById('leaderBoard-Players-Brawlers');
            liste.innerHTML = "";
            document.getElementById('nomBrawler').innerHTML = ": ";
            data.items.forEach(element => {
                let li = document.createElement('li');
                let baliseNom = document.createElement('p');
                let baliseRang = document.createElement('p');
                let baliseImage = document.createElement('img');

                baliseImage.src = 'https://cdn.brawlify.com/profile-icons/regular/' + element.icon.id + '.png';
                baliseImage.classList.add('iconeJoueur');
                baliseNom.textContent = element.name;
                baliseNom.style.color = convertisseurCouleur(element.nameColor);
                baliseNom.classList.add('nomJoueur');
                baliseRang.textContent = element.rank;

                li.appendChild(baliseRang);
                li.appendChild(baliseImage);
                li.appendChild(baliseNom);
                /*a.addEventListener('click', () => {
                    afficherInfoJoueurs(element.tag);
                });*/
                liste.appendChild(li);
            });
        }
    });
    // go to section
    document.getElementById('section-leaderboard').scrollIntoView();
}

/**
 * Convertit une couleur hexadécimale avec préfixe "0x" en format CSS "#RRGGBB".
 *
 * @param {string} hexaCouleur - Couleur au format "0xRRGGBB".
 * @returns {string} - Couleur au format CSS "#RRGGBB".
 */
function convertisseurCouleur(hexaCouleur) {
    return `#${hexaCouleur.slice(2)}`;
}

    // Supprimer le préfixe "0x" et ajouter "#"
    const cssColor = `#${hexaCouleur.slice(2)}`;
    return cssColor;
}

// Fonction de calcul de la distance de Levenshtein
function distanceLevenshtein(str1, str2) {
    const matrice = [];
    let strlen1 = str1.length;
    let strlen2 = str2.length;
    let cout;

    if (strlen1 === 0) { return strlen2; }
    if (strlen2 === 0) { return strlen1; }

    for (let i = 0; i <= strlen1; i++) {
        matrice[i] = [i];
    }
    for (let j = 0; j <= strlen2; j++) {
        matrice[0][j] = j;
    }

    for (let i = 1; i <= strlen1; i++) {
        for (let j = 1; j <= strlen2; j++) {
            cout = (str1[i - 1] === str2[j - 1]) ? 0 : 1;
            matrice[i][j] = Math.min(
                matrice[i - 1][j] + 1,
                matrice[i][j - 1] + 1,
                matrice[i - 1][j - 1] + cout
            );
        }
    }
    return matrice[strlen1][strlen2];
}
/**
 * Recherche des brawlers en utilisant la distance de Levenshtein,
 * priorise les noms commençant par la chaîne de recherche.
 *
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Si la récupération des données échoue.
 */
const rechercher = async () => {
    const recherche = champDeRecherche.value.trim();
    // Si la recherche est vide, on ne fait rien
    if (!recherche) {
        return;
    }
    btnLancerRecherche.disabled = true;
    blocGifAttente.style.display = 'block';

    try {
        console.log("Recherche lancée");

        // Effectuer une requête pour récupérer les données de l'API
        const response = await fetch(listeBrawlers);
        console.log("Réponse reçue");

        // Vérifier si la réponse est valide
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        // Convertir la réponse en JSON
        const data = await response.json();
        console.log("Données de l'API", data);
        blocGifAttente.style.display = 'none'; // Cache le gif d'attente

        // Vérifier si des éléments sont présents dans les données
        if (data.items && data.items.length > 0) {
            // Vider les résultats précédents
            blocResultats.innerHTML = '';
            const results = data.items.filter(brawler => {
                // Comparer chaque brawler avec la recherche via Levenshtein
                return distanceLevenshtein(brawler.name.toLowerCase(), recherche.toLowerCase()) <= 3; // Seuil de 3 pour la distance de Levenshtein
            });

            if (results.length > 0) {
                results.forEach(result => {
                    const a = document.createElement('a');
                    a.classList.add('res');
                    a.textContent = result.brawler.name;
                    a.href = '#section-leaderboard';
                    a.addEventListener('click', () => {
                        afficherLeaderboardBrawlers(result.brawler.id, result.brawler.name);
                    });
                    blocResultats.appendChild(a);
                });
            } else {
                // Afficher un message si aucun résultat n'est trouvé
                blocResultats.innerHTML = '<p>(Aucun résultat trouvé)</p>';
            }
        } else {
            // Afficher un message si aucun élément n'est présent dans les données
            blocResultats.innerHTML = '<p>(Aucun résultat trouvé)</p>';
        }
    } catch (error) {
        // En cas d'erreur, cacher le GIF d'attente et afficher un message d'erreur
        blocGifAttente.style.display = 'none';
        blocResultats.innerHTML = '<p>Erreur lors de la recherche.</p>';
        console.error(error);
    }
};


// Ajouter l'événement de clic sur le bouton de recherche
btnLancerRecherche.addEventListener('click',rechercher);
champDeRecherche.addEventListener('blur', rechercher);
champDeRecherche.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        rechercher();
    }
});
btnLancerRecherche.addEventListener('click', rechercher);

function afficherFavoris() {
    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    listeFavoris.innerHTML = "";

    favoris.forEach(nom => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = nom;
        span.addEventListener("click", () => {
            champDeRecherche.value = nom;  // Met à jour le champ de recherche avec le favori
            rechercher(); // Lance la recherche pour ce favori
        });
        li.appendChild(span);
        listeFavoris.appendChild(li);
    });
}

function ajouterFavori(nom) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    if (!favoris.includes(nom)) {
        favoris.push(nom);
        localStorage.setItem("favoris", JSON.stringify(favoris));
    }
    afficherFavoris();
}

btnFavoris.addEventListener("click", () => {
    const nomBrawler = champDeRecherche.value.trim();
    if (nomBrawler) {
        ajouterFavori(nomBrawler);
    }
});

afficherFavoris();








