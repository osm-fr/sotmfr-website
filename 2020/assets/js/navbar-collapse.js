// jQuery to collapse the navbar on scroll
var navbarCollapse = function() {
    // not use for the moments
    if ($(".navbar").offset().top > 50) {
        $(".navbar-custom").addClass("top-nav-collapse");
        $(".links").css({'transform' : 'translate(-21%, 0)'});
        $(".navbar-brand").css('margin-left', '1em');
    } else {
        $(".navbar-custom").removeClass("top-nav-collapse");
        $(".links").css({'transform' : 'translate(0, 0)'});
    }
    // $(".navbar-fixed-top").addClass("top-nav-collapse");
};
$(window).scroll(navbarCollapse);
$(document).ready(navbarCollapse);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        const $anchor = $(this);
        const href = $anchor.attr('href');
        $('html, body').stop().animate({
            scrollTop: $(href).offset().top
        }, 1200, 'easeInOutExpo');
        event.preventDefault();
        if (!$anchor.hasClass('page-scroll-silent')) {
            history.pushState({}, document.title, href);
        }
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});
