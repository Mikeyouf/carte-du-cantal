//on crée la carte
let map = L.map('map').setView([45.0848524084893, 2.669316757802752], 9);

let OpenStreetMap_France = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    // maxZoom: 20,
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
    this._div.innerHTML = '<h4>Communes du département du Cantal </h4>' +
        '<h5>Cliquez sur votre commune pour avoir des infos</h5>' + (props ?
            '<p><b>' + props.nom + '</b></p><p>' + props.code + '</p>' :
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
let couleur = "bleu";
const liste = document.getElementById('couleurs');
liste.addEventListener("change", e => {
    couleur = e.target.value;
    switch (couleur) {
        case "bleu":
            map.removeLayer(geoJSONLayer);
            geoJSONLayer = L.geoJson(statesData, {
                style: style,
                onEachFeature: onEachFeature
            });
            map.addLayer(geoJSONLayer);
            break;
        case "rouge":
            map.removeLayer(geoJSONLayer);
            geoJSONLayer = L.geoJson(statesData, {
                style: style2,
                onEachFeature: onEachFeature
            });
            map.addLayer(geoJSONLayer);
            break;
        case "vert":
            map.removeLayer(geoJSONLayer);
            geoJSONLayer = L.geoJson(statesData, {
                style: style1,
                onEachFeature: onEachFeature
            });
            map.addLayer(geoJSONLayer);
            break;
        case "violet":
            map.removeLayer(geoJSONLayer);
            geoJSONLayer = L.geoJson(statesData, {
                style: style3,
                onEachFeature: onEachFeature
            });
            map.addLayer(geoJSONLayer);
            break;
        case "monochrome":
            map.removeLayer(geoJSONLayer);
            geoJSONLayer = L.geoJson(statesData, {
                style: style4,
                onEachFeature: onEachFeature
            });
            map.addLayer(geoJSONLayer);
            break;
    }
});

// Style pour le départemetn
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
        fillColor: getColor(feature.properties.code, "bleu"),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function style1(feature) {
    return {
        fillColor: getColor(feature.properties.code, "vert"),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function style2(feature) {
    return {
        fillColor: getColor(feature.properties.code, "rouge"),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function style3(feature) {
    return {
        fillColor: getColor(feature.properties.code, "violet"),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function style4(feature) {
    return {
        fillColor: getColor(feature.properties.code, "monochrome"),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function getColor(d, couleur) {
    if (couleur === "bleu") {
        return d > 15300 ? '#034e7b' :
            d > 15250 ? '#0570b0' :
            d > 15200 ? '#3690c0' :
            d > 15150 ? '#74a9cf' :
            d > 15100 ? '#a6bddb' :
            d > 15050 ? '#d0d1e6' :
            d > 15000 ? '#ece7f2' :
            '#fff7fb';
    } else if (couleur === "rouge") {
        return d > 15300 ? '#800026' :
            d > 15250 ? '#BD0026' :
            d > 15200 ? '#E31A1C' :
            d > 15150 ? '#FC4E2A' :
            d > 15100 ? '#FD8D3C' :
            d > 15050 ? '#FEB24C' :
            d > 15000 ? '#FED976' :
            '#FFEDA0';
    } else if (couleur === "vert") {
        return d > 15300 ? '#005a32' :
            d > 15250 ? '#238b45' :
            d > 15200 ? '#41ab5d' :
            d > 15150 ? '#74c476' :
            d > 15100 ? '#a1d99b' :
            d > 15050 ? '#c7e9c0' :
            d > 15000 ? '#e5f5e0' :
            '#f7fcf5';
    } else if (couleur === "violet") {
        return d > 15300 ? '#4a1486' :
            d > 15250 ? '#6a51a3' :
            d > 15200 ? '#807dba' :
            d > 15150 ? '#9e9ac8' :
            d > 15100 ? '#bcbddc' :
            d > 15050 ? '#dadaeb' :
            d > 15000 ? '#efedf5' :
            '#fcfbfd';
    } else if (couleur === "monochrome") {
        return '#005a32'
    }
}

function zoomToFeature(e) {
    // contrôle du zoom
    map.fitBounds(e.target.getBounds());

    //on récupère la page web de la commune
    let page = e.target.feature.properties.page;
    // on récupère les documents s'il y en a
    let doc = e.target.feature.properties.doc;

    // je récupère mon paragraphe
    let parentElt = document.getElementById("liens");

    if (page || doc) {
        //je crée un balise a
        let lienElt = `
        <a href=${page} target="_blank">Site web de la commune</a>
    `;

        //je crée un lien avec le doc
        let docLienElt = doc.lien ? `
        <p>Document: <a href=${doc.lien} target="_blank">${doc.nom}</a></p>
    ` : '';
        //si on a l'info, on la passe dans la balise p
        parentElt.innerHTML = `
            ${lienElt}
            ${docLienElt}
        `;
    } else {
        // sinon un message d'info
        parentElt.innerHTML = "pas d'infos concernant cette commune";
    }
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

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