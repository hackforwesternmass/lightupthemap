(function ($) {

    // initial stuff: create map and add base layer
    // Add basemap
    var baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });
    // Create map and set center and zoom.
    var map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: false,
        center: [42.26, -71.70],
        zoom: 9
    });
    // Add basemap to map.
    map.addLayer(baseLayer);

    // images for pins
    L.Icon.Default.imagePath = '/themes/custom/lightup/images/leaflet/';

    // need this for clustering
    var markerClusters = L.markerClusterGroup();

    // Add points
    function addDataToMap(data, map) {
        var dataLayer = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                var popupText = feature.properties.name;
                layer.bindPopup(popupText);
            }
        });
        // this is for no clustering
        // dataLayer.addTo(map);
        // this is for clustering
        markerClusters.addLayer( dataLayer );
    }

    $.getJSON('/lights', function(data) {
        addDataToMap(data, map);
    });

    map.addLayer( markerClusters );

    // examples from here http://leafletjs.com/examples/quick-start/
    // add a marker
    var greenIcon = L.icon({
        iconUrl: '/themes/custom/lightup/images/leaflet/leaf-green.png',
        //shadowUrl: 'leaf-shadow.png',

        iconSize:     [38, 50], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 4],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var marker = L.marker([41.75, -71.55],{icon:greenIcon });
    map.addLayer(marker);

    // example of adding a circle
    var circle = L.circle([41.87, -71.20], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 4000
    });
    map.addLayer(circle);

    // example of adding a polygon
    var polygon = L.polygon([
        [41.82, -71.43],
        [41.82, -71.33],
        [41.92, -71.33],
        [41.92, -71.43]
    ]);
    map.addLayer(polygon);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

})(jQuery);



