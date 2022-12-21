// jQuery to collapse the navbar on scroll
const navbarCollapse = function () {
    if ($('.navbar').offset().top > 50) {
        $('.navbar-custom').addClass('top-nav-collapse');
    } else {
        $('.navbar-custom').removeClass('top-nav-collapse');
    }
};
$(window).scroll(navbarCollapse);
$(document).ready(navbarCollapse);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
    $('a.page-scroll').bind('click', function (event) {
        const $anchor = $(this);
        const href = $anchor.attr('href');
        $('html, body')
            .stop()
            .animate(
                {
                    scrollTop: $(href).offset().top
                },
                1200,
                'easeInOutExpo'
            );
        event.preventDefault();
        if (!$anchor.hasClass('page-scroll-silent')) {
            history.pushState({}, document.title, href);
        }
    });
});
