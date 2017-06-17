// custom js

(function ($) {

    $('.action-info').hide();
    $( '.action-title' ).click(function() {
        $(this).next('.action-info').toggle();
    });

    $(window).scroll(function(e){
        var $el = $('#branding');
        var isPositionFixed = ($el.css('position') == 'fixed');
        if ($(this).scrollTop() > 5 && !isPositionFixed){
            $('#branding').css({'position': 'fixed', 'top': '0px'});
        }
        if ($(this).scrollTop() < 5 && isPositionFixed)
        {
            $('#branding').css({'position': 'static', 'top': '0px'});
        }
    });

})(jQuery);





