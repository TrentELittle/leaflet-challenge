//Create variable for map and link for plates to call to. 
var myMap;
var link2 = "data/Plates.geojson";

d3.json(link2,function(response){
    //console.log(response);
    plates = L.geoJSON(response,{  
        style: function(feature){
            return {color:"orange",
                    fillColor: "white",
                    fillOpacity:0}
        },      
        onEachFeature: function(feature,layer){
            console.log(feature.coordinates);
            layer.bindPopup("Plate Name: "+feature.properties.PlateName);
        }
      })

// Create link to earthquake data to pull from.    
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    d3.json(link,function(data){
    console.log(data);
   
   // Create function to mark where earthquakes are occuring based on lat,lng information pulled
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

    // Create a variable to provide information on specific earthquake when clicked on
    var earthQuakes = L.geoJSON(data,{
        onEachFeature: function(feature,layer){
            layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker
    });
    createMap(plates, earthQuakes);
    });
});

//use a function to create map layers to visualize where earthquakes are occuring.
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

  
    // Create base map layer from all layers and overlay the earthquake data
  var baseMaps = {
    "Satellite": satellite,
    "Streetmap": streetmap,
    "Grayscale": grayscale
  };
  var overlayMaps = {
    Earthquakes: earthQuakes
  };
  
    // Create the main map layout/size/zoom/centerpoint when loading page
  var myMap = L.map("map", {
    center: [
      30,0
    ],
    zoom: 2,
    layers: [satellite, earthQuakes]
  });
  
    
    // Add selection menue to select which layer of the map you want to view
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

  document.querySelector(".legend").innerHTML=Legend();

}

//provide colors for the earthquake map markers and the different levels of the earthquake's intensity.
function chooseColor(mag){
  switch(true){
    case (mag<1): return "lightgreen";
    case (mag<2): return "greenyellow";
    case (mag<3): return "gold";
    case (mag<4): return "DarkOrange";
    case (mag<5): return "red";
    default: return "purple";
  };
}

//Create legend that shows the corresponding color to the level of magnitude
function Legend(){
    var legendInfo = [{limit:"0-1", color:"lightgreen"},
                      {limit:"1-2", color:"greenyellow"},
                      {limit:"2-3", color:"gold"},
                      {limit:"3-4", color:"DarkOrange"},
                      {limit:"4-5", color:"red"},
                      {limit:"5+", color:"purple"}];

    var header = "<h3 style = 'background-color: white;'>Magnitude</h3><hr>";
    var strng = "";
    for (i = 0; i < legendInfo.length; i++){
        strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    return header+strng;
}