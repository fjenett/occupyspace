var api = new PieceMakerApi({
    host: 'https://piecemaker2-api-public.herokuapp.com',
    api_key: '0310XfxjdjH4EdY1'                                  //zugang zu piecemaker
})

var groupId = 189,
    zitate = [],
    currentDescription = 0

var descriptionsLoaded = function (descriptions) {
    descriptions = descriptions.filter(function(d){
        return d.fields.description.length > 0
    })
    descriptions = descriptions.map(function (d) {
        return d.fields.description
    })
    // console.log(descriptions)
    zitate = descriptions
    
    randomZitat();
}

api.listEventsOfType(groupId, 'description', descriptionsLoaded)

var randomZitat = function () {
    var randomIndex = Math.floor( Math.random()*zitate.length);
    var randomZitat = zitate[randomIndex];
    document.getElementById('zitat').innerHTML = randomZitat
    // player.cueVideoById(randomZitat);
}

var nextKnopf = document.querySelector('#next');
nextKnopf.addEventListener('click', function(event){
    event.preventDefault()
    randomZitat()
})

//--------------Farben---------------------------------------------------------------
/*
var Farbenliste = [
    '#848367',
    '#6d6051',
    '#c6c0b6',
    '#af8f7f',
    '#f4f2ed',
]*/

function changeBG() {
    var bg = document.body;
    if (bg.style.backgroundColor=="rgb(0, 0, 0)") {
        bg.style.backgroundColor="#FFFFFF";
        bg.style.color="#000000";
        document.querySelector("#next img").setAttribute('src',"assets/Pfeile11-01.png");
    }
    else {
        bg.style.backgroundColor="#FFFFFF";
        bg.style.color="#000000";
        document.querySelector("#next img").setAttribute('src',"assets/Pfeile11-01.png");
    }
}

//-----------------loading--------------------------

function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);
    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

onReady(setTimeout(function () {
    document.querySelector("div.loading").classList.add("hidden")
}));


