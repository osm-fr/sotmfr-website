$(function () {

    // Collapse the navbar on scroll
    $(document).on('scroll', function () {
        //console.debug('scroll');
        $('.navbar-custom').toggleClass('top-nav-collapse', ($('.navbar').offset().top > 50));
    });

    // cacher dynamiquement les éléments de la navigation
    const navToHide = ['index.html','contribution.html'];
    $('.nav-link').each(function () {
        //console.debug($(this).text() + " | href=" + $(this).attr("href"));
        if (navToHide.includes($(this).attr('href')))
            $(this).addClass('hidden');
    });

    // Démarrer les tooltips pour les sponsors
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('js/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      }
});
