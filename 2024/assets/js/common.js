/**
 * script partagé par toutes les pages afin de:
 * - cacher dynamiquement les éléments de la navigation qui ne sont pas encore activés, sans avoir à commenter le html dans toutes les pages
 * - cacher l'appel à contribution après une certaine date
 * @type {NodeListOf<Element>}
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('scripts en commun')

  const nav_to_hide = ['programme', 'sponsors', 'inscription']
  let categories = document.querySelectorAll('.nav-link');

  /**
   * cacher les nav links qui contiennt le texte recherché dans nav_to_hide
   */
  categories.forEach((category) => {
    let textContentLowerCase = category.textContent.toLowerCase();
    nav_to_hide.map(searchTerm => {
      if (textContentLowerCase.indexOf(searchTerm) !== -1) {
        console.log('trouvé', searchTerm)
        category.classList.add('hidden');
      }
    })
  });


  /**
   * cacher l'appel à contribution après une certaine date
   */
  const closeContributionsDate = '2024-05-01';

  function hideContributionAfterDate(dateToHideUntil) {
    const now = new Date();
    const futureDate = new Date(dateToHideUntil);

    // If today's date is past or equal to the specified date
    if (now >= futureDate) {
      const elementsToHide = document.querySelectorAll('.contributionCall');
      elementsToHide.forEach((element) => {
        element.classList.add('hidden');
      });
    }
  }

  hideContributionAfterDate(closeContributionsDate);

}, false);