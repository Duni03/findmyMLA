themain()
function printdata(data) {
    console.log(data)
}

async function getindia() {
    india = fetch("./india-composite.json")
        .then(function (response) {
            return response.json();
        })
    return india;
}
async function getdata() {
    data = await fetch("./test.json")
        .then(response => { return response.json(); })
    return data
}

function gettemplate(f) {
    var x = '<h1>' + f.properties.assembly_1+'</h1><a href="https://www.google.com/search?q='+f.properties.Name+'"'+'><h3>Name: ' + f.properties.Name + '</h3></a>' 
    x += '<h4>Party: ' + f.properties.party + '</h4>';
    x += '<h4>Qualification: ' + f.properties.Qualification + '</h4>';
    x += '<h4>litigations: ' + f.properties.case + '</h4>';
    x += '<h4>Assets: Rs ' + f.properties.Assets + '</h4>';
    x += '<a href="'+f.properties.link+'">More Details</a>'
    return x;
}

async function themain() {


    let data = await getdata();

    const key = 'HDjaDoJpgHuEnYrXT4Ck';

    const map = L.map('map').setView([17.9906, 78.9101], 7);
    india = await getindia();
    L.geoJSON(india, {
        style: { "color": "#ffffff", "fillOpacity": 0 },
    }).addTo(map);
    map.locate({ setView: true, maxZoom: 7 });
    function onLocationFound(e) {
        var radius = e.accuracy;
        L.marker(e.latlng).addTo(map)
        L.circle(e.latlng, radius).addTo(map);
        map.flyTo(e.latlng, 12);
    }
    map.on('locationfound', onLocationFound);
    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationerror', onLocationError);
    const mtLayer = L.maptilerLayer({
        apiKey: key,
        style: "174f3e03-2ad9-4ab5-b178-5fa0bbfa7cc1", //optional
        attribution: '<a href="https://github.com/Duni03/findmyMLA">SOURCE</a>'
    }).addTo(map);

    var popup = L.popup();

    for (var x in data.features) {
        if (data.features[x].properties.assembly_n.includes("(SC)")) {
            L.geoJSON(data.features[x], {
                style: { "color": "#06FF00", "fillOpacity": 0.2, "fillColor": '#06FF00' },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(gettemplate(feature));
                }
            }).addTo(map);
        }
        else if (data.features[x].properties.assembly_n.includes("(ST)")) {
            L.geoJSON(data.features[x], {
                style: { "color": "#ffe066", "fillOpacity": 0.38, "fillColor": '#ffe066' },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(gettemplate(feature));
                }
            }).addTo(map);
        }
        else {
            L.geoJSON(data.features[x], {
                style: { "color": "#d1f8c4", "fillOpacity": 0.31, "fillColor": '#0002A1' },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(gettemplate(feature));
                }
            }).addTo(map);
        }
    }

    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<i style="background: #0002A1"></i><span>GEN</span><br>';
        div.innerHTML += '<i style="background: #06FF00"></i><span>SC</span><br>';
        div.innerHTML += '<i style="background: #F8E457"></i><span>ST</span><br>';

        return div;
    };

    legend.addTo(map);

    var title1 = L.control({ position: "topright" });

    title1.onAdd = function (map) {
        var div = L.DomUtil.create("div", "title1");
        div.innerHTML += '<h1 style="color:white;text-align:center;">2018 TS STATE ASSEMBLY WINNERS</h1>';
        return div;
    };

    title1.addTo(map);
    
    var det = L.control({ position: "bottomright" });

    det.onAdd = function (map) {
        var div = L.DomUtil.create("div", "det");
        div.innerHTML += '<p style="color:white;text-align:center;">Allow Location / Click on locations to get Details </p>';
        return div;
    };

    det.addTo(map);
}
