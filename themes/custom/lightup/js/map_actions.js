var map; // Global map object
var n;
(function ($) {

    // initial stuff: create map and add base layer
    // Add base map

    var baseLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });
    // Create map and set center and zoom.
        map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: false,
        center: [42.06, -71.715],
        zoom: 9
    });
    // Add basemap to map.
    map.addLayer(baseLayer);

    // images for pins
    L.Icon.Default.imagePath = '/themes/custom/lightup/images/leaflet/';

    // need this for clustering
    var markerClusters = L.markerClusterGroup();
    // Create SubGroups.
    // var lightsMarkerSub = L.featureGroup.subGroup(markerClusters).addTo(map);
    // var userMarkerSub = L.featureGroup.subGroup(markerClusters).addTo(map);
    // // For Layers Control.
    // var overlayMaps = {
    //     "Lights": lightsMarkerSub,
    //     "User": userMarkerSub
    // };

    // Add points
    function addDataToMap(data, map) {
        var dataLayer = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
              var html = feature.properties.field_representative_text;
              var div = document.createElement("div");
              div.innerHTML = html;
              var name = div.textContent || div.innerText || "";
              var popupText = feature.properties.title + ': a call was made to ' + name + ' on ' + feature.properties.created;
              layer.bindPopup(popupText);
            }
        });
        // this is for no clustering
        // dataLayer.addTo(map);
        // this is for clustering
        markerClusters.addLayer( dataLayer );
    }

    // add districts
    function addDistrictsToMap(data, map) {
        var dataLayer = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                var popupText = feature.properties.REP_DIST;
                layer.bindPopup(popupText);
                // set style
                layer.setStyle({fillColor :'#faca06', fillOpacity: 0.1, color : '#faca06', weight : .2});
                // mouse over districts
                layer.on('mouseover', function() {
                    this.setStyle({fillColor :'#faca06', fillOpacity: 0.2, color : '#faca06', weight : .2 });
                });
                layer.on('mouseout', function() {
                    this.setStyle({fillColor :'#faca06', fillOpacity: 0.1, color : '#faca06', weight : .2});
                });
                // this is just a test of if
                // if(feature.properties.REP_DIST == '1st Barnstable') {
                //    layer.setStyle({fillColor :'red', fillOpacity: 1})
                // }
            }
        });
        dataLayer.addTo(map);
    }

    //var userMarker = L.geoJson(null, userOptions); // DO NOT add to map.
    //var lightsMarker = L.geoJson(null, lightsOptions); // Same story.

    // get the lights data for logged-in user (not used)
    // $.getJSON('/json-lights-user', function(data) {
    //     addDataToMapUser(data, map);
    // });
    // get the lights data
    // this comes from a Drupal view admin/structure/views/view/lights_json
    $.getJSON('/lights-json/' + action_nid, function(data) {
        addDataToMap(data, map);
    });
    // get the districts data
    $.getJSON("/themes/custom/lightup/js/from_pat.geojson",function(data){
        //L.geoJson( data ).addTo(map);
        addDistrictsToMap(data, map);
    });

    map.addLayer( markerClusters );
    //map.addLayer( markerClustersUser );


    // see https://stackoverflow.com/questions/35949424/leaflet-clustering-with-multiple-layers-use-markercluster-layersupport

    // Create a normal Marker Cluster Group.
    //var mcg = L.markerClusterGroup().addTo(map);

    //var mcg = L.markerClusterGroup().addTo(map);

    // Create SubGroups.
    //var beerMarkerSub = L.featureGroup.subGroup(mcg).addTo(map);
    //var wineMarkerSub = L.featureGroup.subGroup(mcg).addTo(map);

    //var beerMarkerSub = L.featureGroup.subGroup(mcg).addTo(map);

    // For Layers Control.
    // var overlayMaps = {
    //     "Breweries": beerMarkerSub,
    //     "Wineries": wineMarkerSub
    // };

    // That is it! No need to check-in.

    // var beerMarker = L.geoJson(null, beerOptions); // DO NOT add to map.
    // var wineMarker = L.geoJson(null, wineOptions); // Same story.
    //

    // var beerMarker = L.geoJson(null, beerOptions); // DO NOT add to map.
    // $.getJSON('/json-lights-user', function(data) {
    //     beerMarker.addData(data); // GeoJSON conversion.
    //     // Then transfer all features into the corresponding sub-group.
    //     beerMarker.eachLayer(function (layer) {
    //         layer.addTo(beerMarkerSub);
    //     });
    // });

    //
    // $.getJSON('/json-lights', function(data) {
    //     wineMarker.addData(data); // GeoJSON conversion.
    //     // Then transfer all features into the corresponding sub-group.
    //     wineMarker.eachLayer(function (layer) {
    //         layer.addTo(wineMarkerSub);
    //     });
    // });

    //map.addLayer( mcg );

})(jQuery);
