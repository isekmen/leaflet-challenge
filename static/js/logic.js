// Define the url for the GeoJSON earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map object with options.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
});

  // Create the tile layer that will be the background of the map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: mapColor(feature.geometry.coordinates[2]),
      color: "black",
      radius: mapRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
        };

// Add colors for depth
    }
    function mapColor(depth) {
      if (depth < 10) return "#00FF00";
      else if (depth < 30) return "greenyellow";
      else if (depth < 50) return "yellow";
      else if (depth < 70) return "orange";
      else if (depth < 90) return "orangered";
      else return "#FF0000";
    };

// Add magnitude size
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }

        return mag * 5;
    }

// Add data to the map
  L.geoJson(data, {

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
      },

      style: mapStyle,

      onEachFeature: function (feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

      }
    }).addTo(myMap);

// Add the legend with colors
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];

  for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};

// Add the legend to the map
legend.addTo(myMap)
});