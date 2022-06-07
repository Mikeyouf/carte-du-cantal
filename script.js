//on crée la carte
let map = L.map('map').setView([45.0848524084893, 2.669316757802752], 9);

let OpenStreetMap_France = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
map.options.minZoom = 9;
map.options.maxZoom = 15;

map.addLayer(OpenStreetMap_France);

var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function(props) {
    this._div.innerHTML = '<h4>Les risques identifiés sur les communes du département du Cantal</h4>' +
        '<h5>Cliquez sur votre commune pour avoir des infos</h5>' + (props ?
            '<p><b>' + props.nom + '</b></p>' :
            '<p>Passez la souris sur une commune</p>');
};

info.addTo(map);

//département
let geoJSONLayer2 = L.geoJson(departeData, {
    style: styleDep,
}).addTo(map);

let geoJSONLayer = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


const searchLayer = L.layerGroup().addTo(map);
//... adding data in searchLayer ...
map.addControl(new L.Control.Search({
    layer: geoJSONLayer,
    propertyName: "nom",
    textPlaceholder: "rechercher votre commune",
    hideMarkerOnCollapse: true,
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 12); // set the zoom
    }
}));

// choix de la couleur de la carte
// let couleur = "monochrome";
// const liste = document.getElementById('couleurs');
// liste.addEventListener("change", e => {
//     couleur = e.target.value;
//     switch (couleur) {
//         case "bleu":
//             map.removeLayer(geoJSONLayer);
//             geoJSONLayer = L.geoJson(statesData, {
//                 style: style,
//                 onEachFeature: onEachFeature
//             });
//             map.addLayer(geoJSONLayer);
//             break;
//         case "rouge":
//             map.removeLayer(geoJSONLayer);
//             geoJSONLayer = L.geoJson(statesData, {
//                 style: style2,
//                 onEachFeature: onEachFeature
//             });
//             map.addLayer(geoJSONLayer);
//             break;
//         case "vert":
//             map.removeLayer(geoJSONLayer);
//             geoJSONLayer = L.geoJson(statesData, {
//                 style: style1,
//                 onEachFeature: onEachFeature
//             });
//             map.addLayer(geoJSONLayer);
//             break;
//         case "violet":
//             map.removeLayer(geoJSONLayer);
//             geoJSONLayer = L.geoJson(statesData, {
//                 style: style3,
//                 onEachFeature: onEachFeature
//             });
//             map.addLayer(geoJSONLayer);
//             break;
//         case "monochrome":
//             map.removeLayer(geoJSONLayer);
//             geoJSONLayer = L.geoJson(statesData, {
//                 style: style4,
//                 onEachFeature: onEachFeature
//             });
//             map.addLayer(geoJSONLayer);
//             break;
//     }
// });

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
    // let imageElt = document.createElement('img');

    // on les rajoute dans la div parent
    let imagesRisque = Object.keys(risques).map(risque => `
        <div class="picto">
            <img class="risques-image ${risques[risque].isTrue ? "couleur" : "gris"}" src="${risques[risque].source}" alt="${risques[risque].alt}" />
            <span class="picto-tooltip">${risques[risque].alt}</span>
        </div>
    `).join("");

    divElt.innerHTML = `${imagesRisque}`;

    // on récupère les documents TIM s'il y en a
    let doc = e.target.feature.properties.doc;

    // je récupère mon paragraphe
    let parentElt = document.getElementById("liens");

    if (doc) {
        //je crée un lien avec le doc
        let docLienElt = doc.lien ? `
        <p>Document: <a href=${doc.lien} target="_blank">${doc.nom}</a></p>
    ` : '';
        //si on a l'info, on la passe dans la balise p
        parentElt.innerHTML = `
            ${docLienElt}
        `;
    } else {
        // sinon un message d'info
        parentElt.innerHTML = "Pour connaître les niveaux de risques sur votre commune, consultez le DDRM";
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
        layer.bringToFront(); // Permet de garantir que le pays est au-dessus des autres couches de données
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geoJSONLayer.resetStyle(e.target);
    info.update();
}