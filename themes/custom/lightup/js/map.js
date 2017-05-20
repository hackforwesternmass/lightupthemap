(function ($) {
    // Add basemap.
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

    L.Icon.Default.imagePath = '/themes/custom/lightup/images/leaflet/';

    // Add points.
    function addDataToMap(data, map) {
        var dataLayer = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                var popupText = feature.properties.name;
                layer.bindPopup(popupText);
            }
        });
        dataLayer.addTo(map);
    }

    $.getJSON('/lights', function(data) {
        addDataToMap(data, map);
    });

})(jQuery);

