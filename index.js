let helpText = `
This interactive site searches for sounds on 'freesound.org' given keywords.  Once loaded, top sound results will appear below and automatically play on loop.  Mute a single sound by clicking its wave image.  Note, results are not gratinated to match, but best effort of Freedsound’s search algorithm.  All results use Freesound API v2.  Please create a free API token/key for use in this site from your Freesound's account at 'https://freesound.org/apiv2/apply'.
`;
let helpActive = false;

let apiKey = null;
document.getElementById("token_input").focus();

document.getElementById('search_submit').addEventListener("click", generateMix);
document.getElementById('search_input').addEventListener("keyup", generateMix);
document.getElementById('help_submit').addEventListener("click", toggleHelp);

function toggleHelp() {
    switch(helpActive) {
        case false:
            document.getElementById('help').innerHTML = `<br>${helpText}`;
            helpActive = true;
            break;        
        case true:
            document.getElementById('help').innerHTML = null;
            helpActive = false;
            break;
    }
}

function toggleMute(evt) {
    console.log(evt.currentTarget.parentElement.lastChild);
    console.log(evt.currentTarget.style.opacity);
    if(evt.currentTarget.style.opacity > 0.9) {
        evt.currentTarget.style.opacity = 0.2;
        evt.currentTarget.parentElement.lastChild.muted = true;
    } else {
        evt.currentTarget.style.opacity = 1.0;
        evt.currentTarget.parentElement.lastChild.muted = false;

    }
}

function generateMix(evt) {

    if (document.getElementById('search_input').value.length === 0) {
        return;
    }
    if (evt.key !== "Enter" && evt.key !== undefined) {
        return;
    }
    apiKey = document.getElementById("token_input").value
    document.getElementById("main").innerHTML = null;
    searchWord(document.getElementById("search_input").value);
    document.getElementById("search_input").placeholder = document.getElementById("search_input").value;
    document.getElementById("search_input").value = "";
    document.getElementById("search_input").focus();
}


function FetchData(url) {
    return fetch(`${url}${apiKey}`)
    .then(response => response.json());
}


function searchWord(word) {
    return fetch(`https://freesound.org/apiv2/search/text/?query=${word}&token=${apiKey}`)
    .then(response => response.json())
    .then(date => updateP(date))
}


function getSound(id) {
    console.log(`https://freesound.org/apiv2/sounds/${id}/?token=${apiKey}`);
    return fetch(`https://freesound.org/apiv2/sounds/${id}/?token=${apiKey}`)
    .then(response => response.json())
    .then(date => updateS(date))
}


function updateS(input) {

    let listItem = document.createElement("div");
    listItem.className = "item";
    
    let textbox = document.createElement("a");
    textbox.className = "item_text";
    textbox.innerHTML = input.name;
    textbox.href = input.url;
    textbox.target = "_blank"
    listItem.appendChild(textbox);

    let imgbox = document.createElement("img");
    imgbox.className = "item_image";
    imgbox.src = input.images["spectral_bw_l"];
    imgbox.alt = "image";
    imgbox.style.opacity = 1.0;
    imgbox.addEventListener("click", toggleMute);
    listItem.appendChild(imgbox);

    /*
    let audiobox = document.createElement("div");
    audiobox.className = "item_audio";
    audiobox.innerHTML = `
    <audio autoplay loop>
    <source src="${input.previews["preview-hq-mp3"]}" type="audio/ogg">
    <source src="${input.previews["preview-hq-ogg"]}" type="audio/mpeg">
    Your browser does not support the audio element.
    </audio>
    `
    listItem.appendChild(audiobox);
    */

    let audioloop = document.createElement("audio");
    audioloop.loop = true;
    audioloop.autoplay = true;
    audioloop.muted = false;
    audioloop.className = "item_audio";
    audioloop.innerHTML = `
    <source src="${input.previews["preview-hq-mp3"]}" type="audio/ogg">
    <source src="${input.previews["preview-hq-ogg"]}" type="audio/mpeg">
    Your browser does not support the audio element.
    `
    listItem.appendChild(audioloop);

    document.getElementById("main").appendChild(listItem);
}

function updateP(input) {

    for(let i of input.results) {
        getSound(i.id);
    }
}




















