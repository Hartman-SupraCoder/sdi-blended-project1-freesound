
console.log('STARTED GOOD');

let apiKey = "FD2GHPOjG5dFZt72VxbrfO74wcT4fFKdfgAMjvnf";


document.getElementById('search_submit').addEventListener("click", generateMix);
document.getElementById('search_input').addEventListener("keyup", generateMix);
document.getElementById("search_input").focus();


function generateMix(evt) {


    if (document.getElementById('search_input').value.length === 0) {
        return;
      }
      if (evt.key !== "Enter" && evt.key !== undefined) {
        return;
      }
    
      document.getElementById("test").innerHTML = null;
      searchWord(document.getElementById("search_input").value);
      document.getElementById("search_input").placeholder = document.getElementById("input").value;
      document.getElementById("search_input").value = null;
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
    listItem.appendChild(textbox);

    let imgbox = document.createElement("img");
    imgbox.className = "item_image";
    imgbox.src = input.images["spectral_bw_l"];
    imgbox.alt = "image";
    listItem.appendChild(imgbox);

    let audiobox = document.createElement("div");
    audiobox.className = "item_audio";
    audiobox.innerHTML = `
    <audio autoplay>
    <source src="${input.previews["preview-hq-mp3"]}" type="audio/ogg">
    <source src="${input.previews["preview-hq-ogg"]}" type="audio/mpeg">
    Your browser does not support the audio element.
    </audio>
    `
    listItem.appendChild(audiobox);

    document.getElementById(`test`).appendChild(listItem);
}

function updateP(input) {

    for(let i of input.results) {
        getSound(i.id);
    }
}




















