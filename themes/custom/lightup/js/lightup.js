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
        //alert( "Handler for .click() called." );
        $( this ).next().toggle();
    });
});