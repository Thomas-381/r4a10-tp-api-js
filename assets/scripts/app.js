const api_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImMxMzVjYWU2LWI5YjYtNDc2ZS05ZTAyLTMyYTAwMmZkYjM4MCIsImlhdCI6MTc0MjU1NzUwOSwic3ViIjoiZGV2ZWxvcGVyL2I4YTQ5MGE0LWQ3MmUtZDVkYy1lYWYyLTExOGVmNzNhOTVhMyIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNzguMjQzLjE3Ni4xNzIiLCIxMzAuMTkwLjExMi4yNCIsIjEzMC4xOTAuMTEzLjE2NyIsIjI1NS4yNTUuMjU1LjI1NSIsIjAuMC4wLjAiXSwidHlwZSI6ImNsaWVudCJ9XX0.G6ptO1CgCusxAjSt7EDLjluTP1YdTlwwmqmFML7qhLTXD_bBdSNfiV055Mk5APJMx5lH0PcZlLKcBp_3vkmO4A";
/*async function fonctionListeChampion(listeBoutonsEditable) {
    console.log("Appel API");
    return await fetch("https://api.brawlstars.com/v1/brawlers", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjE5ZmI0YTM3LTVhNzYtNGU1My04MzAwLTg4MzI3OThmNzJkNyIsImlhdCI6MTc0MjU1MDgyOCwic3ViIjoiZGV2ZWxvcGVyL2I4YTQ5MGE0LWQ3MmUtZDVkYy1lYWYyLTExOGVmNzNhOTVhMyIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNzguMjQzLjE3Ni4xNzIiXSwidHlwZSI6ImNsaWVudCJ9XX0.G8uqNoWewQrUVLCVDalXM3JBV7pmJhXx-AWhqAlO_7tlYVSLdBjdQSKJlnGMdI3n7ofYJuMS9DytttJHicd7QA",
        }
    });
}

console.log(fonctionListeChampion());    
*/

const playerurl = 'https://api.brawlstars.com/v1/players/';
const listeChampion = 'https://api.brawlstars.com/v1/brawlers';

const getJSON = async url => {
    try {
        const response = await fetch('http://localhost:3000/v1/brawlers', {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
            },
        });
        if(!response.ok) {throw new Error(response.statusText);}
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.log("error");
        return error;
    }
};

getJSON(listeChampion).then(data => {
    /*console.log(data);*/
    let liste = document.getElementById('liste-favoris');
    data.items.forEach(element => {
        let li = document.createElement('a');
        li.textContent = element.name;
        liste.appendChild(li);
    });
}).catch(error => {
    console.error(error);
});