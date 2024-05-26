$(function () {

    // Collapse the navbar on scroll
    $(document).on('scroll', function () {
        //console.debug('scroll');
        $('.navbar-custom').toggleClass('top-nav-collapse', ($('.navbar').offset().top > 50));
    });

    // cacher dynamiquement les éléments de la navigation
    const navToHide = ['contribution.html', 'inscription.html'];
    $('.nav-link').each(function () {
        //console.debug($(this).text() + " | href=" + $(this).attr("href"));
        if (navToHide.includes($(this).attr('href')))
            $(this).addClass('hidden');
    });

    // cacher l'appel à contribution après une certaine date
    const now = new Date();
    const futureDate = new Date('2024-05-01');
    const state = (now >= futureDate);
    $('.contributionCall').each(function () {
        if (state) $(this).toggle();
    });

    // Démarrer les tooltips pour les sponsors
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
