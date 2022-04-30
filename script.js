/* TODO: inserite il codice JavaScript necessario a completare il MHW! */


function spunta(event) {
    const image = event.currentTarget;
    image.src = 'images/checked.png';

    const divSelezionato = image.parentNode;

    const sect = divSelezionato.parentNode;
    const listDiv = sect.querySelectorAll('div');
    for(let div of listDiv) {

        if (div.dataset.choiceId !== divSelezionato.dataset.choiceId) {
            div.classList.add('nonSelezionato');
            div.classList.remove('selezionato');
            div.querySelector('.checkbox').src = 'images/unchecked.png';
        } else {
            div.classList.add('selezionato');
            div.classList.remove('nonSelezionato');
        }
    }

    controllo(divSelezionato);
}


function controllo(divSelezionato)
{
    if(divSelezionato.dataset.questionId==='one') {
        r1 = true;
        vRisposte[0].choiceId = divSelezionato.dataset.choiceId;
        vRisposte[0].spotify = divSelezionato.dataset.spotify;

    } else if(divSelezionato.dataset.questionId==='two'){
        r2 = true;
        vRisposte[1].choiceId = divSelezionato.dataset.choiceId;
        vRisposte[1].spotify = divSelezionato.dataset.spotify;

    } else {
        r3 = true;
        vRisposte[2].choiceId = divSelezionato.dataset.choiceId;
        vRisposte[2].spotify = divSelezionato.dataset.spotify;

    }
    if (r1 && r2 && r3) risultato();
}

function api1(categoria) {

    key = '5d62458859ec447dba52b2c4aae60b48';

    const JSON_PATH = "https://api.spoonacular.com/food/menuItems/search?query="+categoria+"&apiKey="+key;

    fetch(JSON_PATH).then(onResponse).then(onJson);
}
function api2(album) {


    fetch("https://api.spotify.com/v1/search?type=album&q=" + album,
        {
            headers:
            {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(onResponse).then(onJson2);
}

function onTokenJson(json) {
    token = json.access_token;
}

function onResponse(response) {
    return response.json();
}

function onJson(json) {

    let num = Math.round(Math.random() * json.menuItems.length);

    const img = document.createElement('img');
    img.src = json.menuItems[num].image;
    const title = document.createElement('h1');
    title.textContent = "Questo piatto fa per te!";
    const par = document.createElement('p');

    par.textContent = "TITOLO: "+json.menuItems[num].title;

    const sCibo = document.querySelector("#ciboRandom");
    sCibo.classList.remove("hidden");
    sCibo.appendChild(title);
    sCibo.appendChild(img);
    sCibo.appendChild(par);
    

}
function onJson2(json) {

    const sectSpotify = document.querySelector("#spotify");

    const frase = document.createElement('h1');
    frase.textContent = "Ti consiglio anche la musica giusta per il tuo tipo di personalita'!";
    sectSpotify.appendChild(frase);

    const albums = document.createElement('div');
    albums.classList.add('albums');

    const vet = json.albums.items;
    let num_album = vet.length;

    if (num_album > 3) num_album = 3;
    for (let i = 0; i < num_album; i++) {
        const album_data = vet[i];
        const title = album_data.name;
        const img_selected = album_data.images[0].url;
        const album = document.createElement('div');
        album.classList.add('album');
        const img = document.createElement('img');
        img.src = img_selected;
        const caption = document.createElement('p');
        caption.textContent = title;
        album.appendChild(img);
        album.appendChild(caption);
        albums.appendChild(album);
    }
    sectSpotify.appendChild(albums);
    sectSpotify.classList.remove("hidden");

}
function risultato()
{
    if (vRisposte[0].choiceId != vRisposte[1].choiceId && vRisposte[1].choiceId != vRisposte[2].choiceId) {
        ris.choiceId = vRisposte[0].choiceId;
        ris.spotify = vRisposte[0].spotify;
    }
    else if (vRisposte[0].choiceId === vRisposte[1].choiceId) {
        ris.choiceId = vRisposte[0].choiceId;
        ris.spotify = vRisposte[0].spotify;
    }
    else if (vRisposte[0].choiceId === vRisposte[2].choiceId) {
        ris.choiceId = vRisposte[0].choiceId;
        ris.spotify = vRisposte[0].spotify;
    }
    else {
        ris.choiceId = vRisposte[1].choiceId;
        ris.spotify = vRisposte[1].spotify;
    }

    api1(ris.choiceId);
    api2(ris.spotify);
    riempiDiv(ris);
}

function riempiDiv(ris) {

    const div = document.querySelector("#risultato");
    const title = document.querySelector("#risultato h1");
    const paragrafo = document.querySelector("#risultato p");


    title.textContent = RESULTS_MAP[ris.choiceId].title;
    paragrafo.textContent = RESULTS_MAP[ris.choiceId].contents;

    div.classList.remove('hidden');


    //rimuovo listener

    listenerCheck(0);
}


function restart() {

    const div = document.querySelector("#risultato");
    div.classList.add('hidden');
    const sCibo = document.querySelector("#ciboRandom");
    sCibo.classList.add('hidden');
    sCibo.innerHTML = '';
    const sSpotify = document.querySelector("#spotify");
    sSpotify.classList.add('hidden');
    sSpotify.innerHTML = '';
    listenerCheck(1);

    //reset variabili
    r1 = false;
    r2 = false;
    r3 = false;

    //reset grafico

    for (let sect of listSect) {

        const listDiv = sect.querySelectorAll('div');

        for (let div of listDiv) {
            div.classList.remove('selezionato');
            div.classList.remove('nonSelezionato');
            div.querySelector('.checkbox').src = 'images/unchecked.png';
        }
    }


}

function listenerCheck(mode) {

    // 1 add 0 remove
    if(mode===1)
        for (let sect of listSect) {

            const listDiv = sect.querySelectorAll('div');

            for (let box of listDiv) {
                box.querySelector('.checkbox').addEventListener('click', spunta);
            }
        }
    else
        for (let sect of listSect) {

            const listDiv = sect.querySelectorAll('div');

            for (let box of listDiv) {
                box.querySelector('.checkbox').removeEventListener('click', spunta);
            }
        }
}

let ris = {}; // risultato test
let r1,r2,r3; // controllo risposte domande
let vRisposte = []; //per salvare le scelte
vRisposte[0] = {};
vRisposte[1] = {};
vRisposte[2] = {};
let token;

let listSect = document.querySelectorAll('#sect1,#sect2,#sect3');

const client_id = '5fdbe56c86644accab426182a80a35b7';
const client_secret = 'b3b24aceb971427b83c8f9d0c26716f7';

fetch("https://accounts.spotify.com/api/token",
    {
        method: "post",
        body: 'grant_type=client_credentials',
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        }
    }
).then(onResponse).then(onTokenJson);
//listener

listenerCheck(1);

const btnRestart = document.querySelector('.button');
btnRestart.addEventListener('click', restart);
