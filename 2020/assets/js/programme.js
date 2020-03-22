// Après chargement de la page
$(function() {
  const programmeSelector = ".programme";
  let rows;

  // Afficher la programmation
  // "?20200322" : force la mise à jour du cache à chaque changement.
  $.getJSON("assets/js/programme.json?20200322", function(data) {
    // TODO trier par date
    $.each(data, function(index, element) {
      programme(index, element, programmeSelector)
    });
    // Lignes fitrables
    rows = $(programmeSelector + " [data-filter]");
    // Accordion
    $(programmeSelector + " [data-toggle='collapse']").click(function() {
      event.preventDefault();
      let $icon = $("i", this);
      $icon.toggleClass("fa-chevron-circle-down");
      $icon.toggleClass("fa-chevron-circle-up");
      $(this).next().toggleClass("collapse");
    });
  });

  // Filtre
  $(".no-result").hide();

  function checkNoResult() {
    let visible = rows.filter(":visible").length;
    if (visible == 0) {
      $(".no-result").show();
    } else {
      $(".no-result").hide();
    }
  }

  $(".filter").on("click", "button[data-filter]", function(e) {
    e.preventDefault();

    //Get filter data from active link
    let filterValue = $(this).attr("data-filter");
    //Change active filter tag
    let currentFilter = $(this).closest("[data-filter]");
    currentFilter.toggleClass("active");
    $(this).parent().children().filter("[data-filter]").not(currentFilter).removeClass("active");
    //Remove search field content when choosing a filter
    $("#search").val("");

    //Show filtered list by matching data-filter with data-filter of item
    if (filterValue == "all") {
      rows.fadeIn("slow");
      // Désactiver tous les filtres actifs
      $(".filter button[data-filter!='all']").removeClass("active");
    } else {
      // Désactiver le filtre ALL
      $(".filter button[data-filter='all']").removeClass("active");
      // Prendre en compte tous les filtres actifs
      rows.hide();
      let filterValues = [];
      $(".filter button[data-filter].active").each(function() {
        filterValues.push($(this).attr("data-filter"));
      });
      rows.filter(function() {
        let dataFilter = $(this).attr("data-filter");
        let setVisible = filterValues.reduce(function(accumulator, currentValue) {
          return accumulator && dataFilter.includes(currentValue);
        }, true);
        return setVisible;
      }).fadeIn("slow");
    }
    checkNoResult();
  });

  // Filtre de recherche
  $("#search").keyup(function() {
    $(".filter [data-filter]").removeClass("active");
    let val = "^(?=.*\\b" + $.trim($(this).val()).split(/\s+/).join("\\b)(?=.*\\b") + ").*$",
      reg = RegExp(val, "i"),
      text;
    let hiddenRows = rows.show().filter(function() {
      text = $(this).text().replace(/\s+/g, " ");
      return !reg.test(text);
    }).hide();
    checkNoResult();
  });

});

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
  "Su": "Dimanche"
}
const regex = /(Mo|Tu|We|Th|Fr|Sa|Su) (\d+):(\d+)-(\d+):(\d+)/;

let tr_model;

function getTrModel(selector) {
  if (!tr_model) {
    tr_model = $(selector + " tr.tr_model");
    tr_model.hide();
  }
  return tr_model.clone().show();
}

/**
 * Retourner un code salle.
 **/
function getCodeSalle(salle) {
  if (!salle) return "";
  // ex: "Amphi 6" --> "A_6"
  let code = salle.toUpperCase().replace(/^([A-Z]).+ ([A-Z0-9]+)$/, "$1_$2");
  return code || "";
}

/**
 * Retourner un tableau de codes tags.
 **/
function getCodesTags(tags) {
  if (!tags) return "";
  // ex: "Communauté" --> "COM"
  return tags.map(tag => tag.substring(0, 3).toUpperCase());
}

let previousTd = {
  text: function() {}
};

/**
 * Afficher un programme, sous forme de ligne de tableau,
 * à partir d'un modèle HTML.
 **/
function programme(key, prog, selector = "table.programme") {
  // console.log(key);
  let tr = getTrModel(selector);
  // Colonne avec les heures
  let td1 = $(".horaire", tr);
  let rowspan = false;
  // Colonne avec les propriétés du programme
  let td2 = $(".presentation", tr);

  // Horaire
  let previousHoraire = previousTd.text() || "--";
  let horaire = prog.horaire;
  let jour = prog.jour;
  let text, m;
  if (jQuery.type(horaire) === "array") {
    // Tableau
    text = horaire.join(" - ");
  } else if ((m = regex.exec(horaire)) !== null) {
    // Format opening_hours
    text = `${parseInt(m[2])}h${m[3]} - ${parseInt(m[4])}h${m[5]}`;
    jour = jours[m[1]];
  } else {
    text = horaire;
  }
  // J'indique le jour en plus de l'horaire
  text = jour + ", " + text;
  if (rowspan && text === previousHoraire) {
    previousTd.attr("rowspan",
      1 + parseInt(previousTd.attr("rowspan") || 1, 10)
    );
    td1.remove();
  } else {
    td1.text(text);
    td1.attr("title", jour);
    previousTd = td1;
  }

  // Si c'est un pause
  if (prog.break == "true") {
    //td1.addClass("break");
    //td2.addClass("breakmain");
    if (!prog.libelle) prog.libelle = "Pause";
    $(".card", td2).addClass("text-white bg-secondary");
    $(".card-body", td2).remove();
  }

  // Calculer le filtre
  let filter = prog["salle-filter"];
  if (!filter) {
    // ex: "Vendredi, Amphi 6, Géomatique, Territoire" --> "ve A_6 GÉO TER"
    let arr = [];
    arr.push(jour.toLowerCase().substring(0, 2));
    arr.push(getCodeSalle(prog.salle));
    if (prog.tags && jQuery.type(prog.tags) === "array") {
      Array.prototype.push.apply(arr, getCodesTags(prog.tags));
    }
    filter = arr.join(" ");
  }
  tr.attr("data-filter", filter);

  // Afficher les valeurs
  for (let key of ["salle", "numero", "libelle", "description",
      "conferencier", "organisation", "videos", "presentations", "tags"
    ]) {
    let classSelector = "." + key;
    if (prog[key]) {
      if (jQuery.type(prog[key]) === "string") {
        // Texte
        $(classSelector, td2).text(prog[key]);
      } else if (jQuery.type(prog[key]) === "array") {
        // Tableau
        let liste = $(classSelector, td2);
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
        $(classSelector, td2).remove();
      }
    } else {
      $(classSelector, td2).remove();
    }
    if (!prog["description"]) {
      $("[data-toggle]", td2).remove();
    }
  }
  tr.appendTo(selector);
}
