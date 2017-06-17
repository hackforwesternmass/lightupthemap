// custom js

(function ($) {

    $('.action-info').hide();
    $( '.action-title' ).click(function() {
        $(this).next('.action-info').toggle();
    });
    // fix nav on scroll
    // $(window).scroll(function(e){
    //     var $el = $('#branding');
    //     var isPositionFixed = ($el.css('position') == 'fixed');
    //     if ($(this).scrollTop() > 200 && !isPositionFixed){
    //         $('#branding').css({'position': 'fixed', 'top': '0px'});
    //     }
    //     if ($(this).scrollTop() < 200 && isPositionFixed)
    //     {
    //         $('#branding').css({'position': 'static', 'top': '0px'});
    //     }
    // });

})(jQuery);

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
jQuery(document).ready(function($) {
    $("input[value=" + action + "]").prop('checked', true);
});




