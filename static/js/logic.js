var myMap;
var link2 = "data/Plates.geojson";

d3.json(link2,function(response){
    //console.log(response);
    plates = L.geoJSON(response,{  
        style: function(feature){
            return {
                color:"orange",
                fillColor: "white",
                fillOpacity:0
            }
        },      
        onEachFeature: function(feature,layer){
            console.log(feature.coordinates);
            layer.bindPopup("Plate Name: "+feature.properties.PlateName);
        }
        
    })

    
    var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    

    d3.json(link,function(data){
    console.log(data);
   
    function createCircleMarker(feature,latlng){
        let options = {
            radius:feature.properties.mag*2.5,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: .5,
            opacity: 2,
            fillOpacity: .8
        }
        return L.circleMarker( latlng, options);

    }


    var earthQuakes = L.geoJSON(data,{
        onEachFeature: function(feature,layer){
            layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker

    });

    createMap(plates, earthQuakes);

    });

    
});


  


  function createMap(plates,earthQuakes) {

    
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: config.API_KEY
    });

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: config.API_KEY
    });
  
    var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: config.API_KEY
    });

  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satellite,
      "Streetmap": streetmap,
      "Grayscale": grayscale
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthQuakes
    };
  
    // Create our map
    var myMap = L.map("map", {
      center: [
        30,0
      ],
      zoom: 1,
      layers: [satellite, earthQuakes]
    });
  
    
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var info = L.control({
        position: "bottomleft"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();

  }


  function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "lightgreen";
        case (mag<2):
            return "greenyellow";
        case (mag<3):
            return "gold";
        case (mag<4):
            return "DarkOrange";
        case (mag<5):
            return "red";
        default:
            return "purple";
    };
}

function displayLegend(){
    var legendInfo = [{
        limit: "Mag: 0-1",
        color: "lightgreen"
    },{
        limit: "Mag: 1-2",
        color: "greenyellow"
    },{
        limit:"Mag: 2-3",
        color:"gold"
    },{
        limit:"Mag: 3-4",
        color:"DarkOrange"
    },{
        limit:"Mag: 4-5",
        color:"red"
    },{
        limit:"Mag: 5+",
        color:"purple"
    }];

    var header = "<h3>Magnitude</h3><hr>";

    var strng = "";
   
    for (i = 0; i < legendInfo.length; i++){
        strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    
    return header+strng;

}