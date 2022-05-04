const programmeSelector = ".programme";
let rows;
const salleSet = new Set();
const tagSet = new Set();

// Après chargement de la page
$(function () {
  // Afficher la programmation
  // "?20220502" : force la mise à jour du cache à chaque changement.
  $.getJSON("assets/js/programme.json?20220503", function (data) {
    // TODO trier par date
    $.each(data, function (index, element) {
      programme(index, element, programmeSelector);
      if (element.salle) {
        salleSet.add(element.salle);
      }
      if (element.tags) {
        element.tags.forEach(t => tagSet.add(t));
      }
    });

    // Ajouter un filtre par jour
    const jourMap = new Map();
    jourMap.set("Fr", jours["Fr"]);
    jourMap.set("Sa", jours["Sa"]);
    jourMap.set("Su", jours["Su"]);
    addFilter(jourMap);

    // Ajouter un filtre par salle
    const salleMap = new Map();
    Array.from(salleSet).sort().map(value => {
      salleMap.set(getCodeSalle(value), value);
    });
    addFilter(salleMap);

    // Ajouter un filtre par tag
    const tagMap = new Map();
    Array.from(tagSet).sort().map(value => {
      tagMap.set(getCodeTag(value), value);
    });
    addFilter(tagMap);

    // Lignes fitrables
    rows = $(programmeSelector + " [data-filter]");
    // Accordion
    $(programmeSelector + " [data-toggle='collapse']").click(function () {
      event.preventDefault();
      let $icon = $("img", this);
      let src = $icon.attr('src');
      if (src.includes('-up')) {
        src = src.replace('-up', '-down');
      } else if (src.includes('-down')) {
        src = src.replace('-down', '-up');
      }
      $icon.attr('src', src);
      $(this).next().toggleClass("collapse");
    });
  });

  // Message caché par défault car aucun filtre n'est activé
  $(".no-result").hide();

  $(".filter").on("click", "button[data-filter]", onFilter);

  // Filtre de recherche
  $("#search").keyup(function () {
    $(".filter [data-filter]").removeClass("active");
    let val = "^(?=.*\\b" + $.trim($(this).val()).split(/\s+/).join("\\b)(?=.*\\b") + ").*$",
      reg = RegExp(val, "i"),
      text;
    let hiddenRows = rows.show().filter(function () {
      text = $(this).text().replace(/\s+/g, " ");
      return !reg.test(text);
    }).hide();
    checkNoResult();
  });

});

// Filtre
function checkNoResult () {
  let visible = rows.filter(":visible").length;
  if (visible === 0) {
    $(".no-result").show();
  } else {
    $(".no-result").hide();
  }
}

function onFilter (e) {
  e.preventDefault();

  // Get filter data from active link
  let filterValue = $(this).attr("data-filter");

  // Change active filter tag
  let currentFilter = $(this).closest("[data-filter]");
  currentFilter.toggleClass("active");
  $(this).parent().children().filter("[data-filter]").not(currentFilter).removeClass("active");
  //Remove search field content when choosing a filter
  $("#search").val("");

  // Show filtered list by matching data-filter with data-filter of item
  if (filterValue === "all") {
    rows.fadeIn("slow");
    // Désactiver tous les filtres actifs
    $(".filter button[data-filter!='all']").removeClass("active");
  } else {
    // Désactiver le filtre ALL
    $(".filter button[data-filter='all']").removeClass("active");
    // Prendre en compte tous les filtres actifs
    rows.hide();
    let filterValues = [];
    $(".filter button[data-filter].active").each(function () {
      filterValues.push($(this).attr("data-filter"));
    });
    rows.filter(function () {
      let dataFilter = $(this).attr("data-filter");
      return filterValues.reduce(function (accumulator, currentValue) {
        return accumulator && dataFilter.includes(currentValue);
      }, true);
    }).fadeIn("slow");
  }
  checkNoResult();
}

//===========================================
//|  Le code pour générer la programmation  |
//===========================================

const jours = {
  "Mo": "Lundi",
  "Tu": "Mardi",
  "We": "Mercredi",
  "Th": "Jeudi",
  "Fr": "Vendredi",
  "Sa": "Samedi",
  "Su": "Dimanche",
};

const regex = /(Mo|Tu|We|Th|Fr|Sa|Su) (\d+):(\d+)-(\d+):(\d+)/;

let tr_model;
let filter_model;

function getTrModel (selector) {
  if (!tr_model) {
    tr_model = $(selector + " tr.tr_model");
    tr_model.removeClass("tr_model");
    tr_model.hide();
  }
  return tr_model.clone();
}

function getFilterModel (selector) {
  if (!filter_model) {
    filter_model = $(selector + " button.filter-model");
    filter_model.removeClass("filter-model");
    filter_model.hide();
  }
  return filter_model.clone();
}

/**
 * Retourner un code salle.
 **/
function getCodeSalle (salle) {
  if (!salle) return "";
  // ex: "Amphi 6" --> "A_6"
  let code = salle.toUpperCase().replace(/^([A-Z]).+ ([A-Z0-9]+)$/, "$1_$2");
  return code || "";
}

/**
 * Retourner un code tag.
 **/
 function getCodeTag (tag) {
  if (!tag) return "";
  // ex: "Communauté" --> "COM"
  let code = tag.substring(0, 3).toUpperCase();
  return code || "";
}

/**
 * Retourner un tableau de codes tags.
 **/
function getCodesTags (tags) {
  if (!tags) return "";
  return tags.map(tag => getCodeTag(tag));
}

let previousTd = {
  text: function () {},
};

/**
 * Afficher un programme, sous forme de ligne de tableau,
 * à partir d'un modèle HTML.
 **/
function programme (key, prog, selector = "table.programme") {
  let tr = getTrModel(selector);
  let rowspan = false;

  // Colonne avec les heures
  let thHoraire = $(".horaire", tr);

  // Colonne avec les propriétés du programme
  let tdPresentation = $(".program-presentation", tr);

  // Horaire
  let previousHoraire = previousTd.text() || "--";
  let horaire = prog.horaire;
  let jour = prog.jour;

  let periode, m, codeJour;

  if (jQuery.type(horaire) === "array") {
    // Tableau
    periode = horaire.join(" - ");
  } else if ((
    m = regex.exec(horaire)
  ) !== null) {
    // Format opening_hours
    periode = `${parseInt(m[2])}h${m[3]} - ${parseInt(m[4])}h${m[5]}`;
    codeJour = m[1];
    jour = jours[codeJour];
  } else {
    periode = horaire;
  }
  // J'indique le jour en plus de l'horaire
  if (rowspan && text === previousHoraire) {
    previousTd.attr("rowspan", 1 + parseInt(previousTd.attr("rowspan") || 1, 10));
    thHoraire.remove();

  } else {
    $('<span>', {
      text: jour,
      class: 'jour',
    }).appendTo(thHoraire);
    $('<br>').appendTo(thHoraire);
    $('<span>', {
      text: periode,
      class: 'heures',
    }).appendTo(thHoraire);
    thHoraire.attr("title", jour);
    previousTd = thHoraire;
  }

  // Si c'est un pause
  if (prog.break === "true") {
    //thHoraire.addClass("break");
    //tdPresentation.addClass("breakmain");
    if (!prog.libelle) prog.libelle = "Pause";
    $(".card", tdPresentation).addClass("text-white bg-secondary");
    $(".card-body", tdPresentation).remove();
  }

  // Calculer le filtre
  let filter = prog["salle-filter"];
  if (!filter) {
    // ex: "Vendredi, Amphi 6, Géomatique, Territoire" --> "ve A_6 GÉO TER"
    let arr = [];
    arr.push(codeJour);
    arr.push(getCodeSalle(prog.salle));
    if (prog.tags && jQuery.type(prog.tags) === "array") {
      Array.prototype.push.apply(arr, getCodesTags(prog.tags));
    }
    filter = arr.join(" ");
  }
  tr.attr("data-filter", filter);

  // Afficher les valeurs
  for (let key of [
    "salle", "numero", "libelle", "description", "conferencier", "organisation", "videos", "presentations", "tags",
  ]) {
    let classSelector = "." + key;
    if (prog[key]) {
      if (jQuery.type(prog[key]) === "string") {
        // Texte
        let html = $.parseHTML(prog[key].replace("\n", "<br>"));
        $(classSelector, tdPresentation).html(html);
      } else if (jQuery.type(prog[key]) === "array") {
        // Tableau
        let liste = $(classSelector, tdPresentation);
        if (key === "tags") {
          let node_model = $(":first-child", liste);
          // Mot clé
          for (let el of prog.tags) {
            let tag = node_model.clone();
            tag.text(el);
            tag.appendTo(liste);
          }
          node_model.remove();
        } else {
          let node_model = $("li:first-child", liste);
          // Hyperlien
          for (let el of prog[key]) {
            let node = node_model.clone();
            $("a:first-child", node)
            .text(el.text || el.name || "Voir le lien")
            .attr("href", el.href);
            liste.append(node);
          }
          node_model.remove();
        }
        // Sinon, supprimer
      } else {
        $(classSelector, tdPresentation).remove();
      }
    } else {
      $(classSelector, tdPresentation).remove();
    }
    if (!prog["description"]) {
      $("[data-toggle]", tdPresentation).remove();
    }
  }
  tr.appendTo(selector).show();
}
/**
 * Ajouter un groupe de filtre
 * @param {Map} myMap 
 */
function addFilter(myMap) {
  let filterGroup = $('<hr><div class="filter">').appendTo("#filter-group");

  // Ajouter un groupe de filtre  
  myMap.forEach(function(value, key) {
    let filterButton = getFilterModel(".filter");
    filterButton.text(value);
    filterButton.attr("data-filter", key);
    filterButton.on("click", onFilter);
    filterGroup.append(filterButton);
    filterButton.show();
  })
}
