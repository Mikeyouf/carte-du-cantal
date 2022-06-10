// détecter si on est sur mobile ou ordi
let isMobile = false;

function isMobileDevice() {
    if (navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        return isMobile = true;
    } else {
        return isMobile = false;
    }
}

isMobileDevice();

//on crée la carte
let map = L.map('map', {
    dragging: !L.Browser.mobile,
    tap: !L.Browser.mobile
}).setView([45.0848524084893, 2.669316757802752], isMobile ? 8 : 9);

let OpenStreetMap_France = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
map.options.minZoom = isMobileDevice ? 8 : 9;
map.options.maxZoom = 15;

map.addLayer(OpenStreetMap_France);

var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function(props) {
    this._div.innerHTML = '<h4>Les risques identifiés sur les communes du département du Cantal</h4>' + (props ?
        '<p><b>' + props.NOM_COM + '</b></p>' : isMobile ?
        '<h5>Cliquer sur une commune</h5>' : '<h5>Passez la souris sur une commune</h5>');
};

info.addTo(map);

//département
let geoJSONLayer2 = L.geoJson(departeData, {
    style: styleDep,
}).addTo(map);

let geoJSONLayer = L.geoJson(cantalData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


const searchLayer = L.layerGroup().addTo(map);
//... adding data in searchLayer ...
map.addControl(new L.Control.Search({
    layer: geoJSONLayer,
    propertyName: "NOM_COM",
    textPlaceholder: "rechercher votre commune",
    hideMarkerOnCollapse: true,
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 10); // set the zoom
    }
}));


// Style pour le département
function styleDep(feature) {
    return {
        weight: 10,
        opacity: 1,
        color: 'grey',
        dashArray: '',
        fillOpacity: 0.5,
        fillColor: 'transparent'
    };
}


function style(feature) {
    return {
        fillColor: '#005a32',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function zoomToFeature(e) {
    // contrôle du zoom
    map.fitBounds(e.target.getBounds());

    //je récupère la div où iront les images
    const divElt = document.getElementById("images-risques");

    //on récupère le tableau des risques
    let risques = e.target.feature.properties.risques;

    // on les rajoute dans la div parent
    let imagesRisque = Object.keys(risques).map(risque => `
        <div class="picto">
            <img class="risques-image ${risques[risque].isTrue ? "couleur" : "gris"}" src="${risques[risque].source}" alt="${risques[risque].alt}" />
            <span class="picto-tooltip">${risques[risque].alt}</span>
        </div>
    `).join("");

    divElt.innerHTML = `${imagesRisque}`;

    // on récupère les documents TIM s'il y en a
    let docTIM = e.target.feature.properties.TIM;
    let nomCommune = e.target.feature.properties.NOM_COM;

    // je récupère mon paragraphe
    let parentElt = document.getElementById("liens");
    console.log('parentElt :', parentElt);

    if (docTIM) {
        //je crée un lien avec le doc
        //si on a l'info, on la passe dans la balise p
        parentElt.innerHTML = `
            <p>Pour connaître les niveaux de risques sur <span class="bold">${nomCommune}</span>, consultez le DDRM </br>
            <span class="lien-tim">Document: <a href=${docTIM} target="_blank">TIM</a></span></p>
        `;
    }
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// change la couleur au survol
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
        fillColor: '#FEB24C',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront(); // Permet de garantir que la carte est au-dessus des autres couches de données
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geoJSONLayer.resetStyle(e.target);
    info.update();
}