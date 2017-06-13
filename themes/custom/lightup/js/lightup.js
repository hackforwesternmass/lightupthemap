// custom js

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
var action = getUrlParameter('action');
//console.log( action )
jQuery(document).ready(function($){
    $("input[value=" + action + "]").prop('checked', true);
    // stuff for actions list
    $(".action-info").hide();
    $( ".action-title" ).click(function() {
        $( this ).next().toggle();
    });
    $(".district-info").hide();
    $( ".district-title" ).click(function() {
        $( this ).next().toggle();
    });

    //$('a').filter(function(index) { return $(this).text() === "/node/29"; }).css({background:"#F00"});
    $('a[href$="/node/29"]').css({color:"#F00"});

    document.querySelectorAll('.leaflet-container a[href$="/node/29"]').css({color:"#F00"});
});

L.Map = L.Map.extend({
    openPopup: function(popup) {
        // this.closePopup();
        this._popup = popup;
        return this.addLayer(popup).fire('popupopen', {
            popup: this._popup
        });
    }
});

