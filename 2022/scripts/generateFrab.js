const { create } = require('xmlbuilder2');
const fs = require('fs');
const path = require('path');

/**
 * Le but est de générer un programme au format Frab XML
 * afin de l'importer dans une autre application tel que Giggity
 * https://github.com/Wilm0r/giggity/blob/master/tools/gen-xml.py
 */


// Charger le programme JSON
let data = fs.readFileSync(path.join(__dirname + '/../assets/js/') + 'programme.json', 'utf8');
let programme = JSON.parse(data);
const timezone = '+02:00';
const timezone_name = 'Europe/Paris';
const language = 'fr';

// Les jours
const days = ['2022-06-10', '2022-06-11', '2022-06-12'];
const dayNames = [...new Set(programme.map(o => o.horaire.substr(0, 2)))];
if (days.length != dayNames.length) throw 'Error: number of days';

// Détail du programme
const obj = {
    schedule: {
        generator: {
            '@name': 'frab',
            '@version': '0.7'
        },
        conference: {
            acronym: 'SotM-fr2022',
            title: 'State Of The Map France 2022',
            venue: 'Université de Nantes - Campus du Tertre',
            city: 'Nantes',
            start: days[0],
            end: days[days.length - 1],
            days: days.length,
            timeslot_duration: '00:30:00',
            time_zone_name: timezone_name,
            base_url: 'https://sotm2022.openstreetmap.fr'
        }
    }
};
const doc = create(obj);
let root = doc.root();
let roomDefault = 'vide';

// Boucler sur les événements
for (let i = 0; i < programme.length; i++) {
    let prog = programme[i];
    let track = prog.tags ? prog.tags.join(', ') : '';
    let abstract = (prog.numero ? `[${prog.numero}] ` : '');
    abstract += prog.description ? prog.description.substr(0, 40) + ' (...)' : '';

    // Exclure les pauses
    if (prog.break && !!prog.break) {
        continue;
    }

    // Créer le jour si besoin
    let dayIndex = dayNames.indexOf(prog.horaire.substr(0, 2));
    let dayDate = days[dayIndex];
    let dayStart = new Date(`${dayDate}T09:00:00${timezone}`);
    let dayEnd = new Date(`${dayDate}T20:00:00${timezone}`);
    let nDay = root.find(n => {
        return n.node.nodeName === 'day'
            && n.node.getAttribute('index') == String(dayIndex + 1)
    });
    if (!nDay) {
        nDay = root.ele('day')
            .att('index', String(dayIndex + 1))
            .att('date', dayDate)
            .att('start', dayStart.toISOString())
            .att('end', dayEnd.toISOString());
    }
    let start = new Date(`${dayDate}T${prog.horaire.substr(3, 5)}:00${timezone}`);
    let end = new Date(`${dayDate}T${prog.horaire.substr(9, 5)}:00${timezone}`);
    let duration = getDuration(start, end);

    // Créer la salle si besoin
    let roomName = prog.salle || roomDefault;
    let nRoom = nDay.find(
        n => n.node.nodeName === 'room'
            && n.node.getAttribute('name') === roomName);
    if (!nRoom) {
        nRoom = nDay.ele('room')
            .att('name', roomName);
    }

    // Ajouter l'événement
    let nEvent = nRoom.ele('event')
        .att('id', i)
        .ele('date').txt(start.toISOString()).up()
        .ele('start').txt(start.toLocaleTimeString().substring(0, 5)).up()
        .ele('duration').txt(duration).up()
        .ele('slug').up()
        .ele('room').txt(roomName).up()
        .ele('title').txt(prog.libelle).up()
        .ele('subtitle').up()
        .ele('track').txt(track).up()
        .ele('type').txt('Conférence').up()
        .ele('language').txt(language).up()
        .ele('abstract').txt(abstract).up()
        .ele('description').txt(prog.description).up()
        .ele('persons').up()
        .ele('links').up();
    if (prog.conferencier) {
        let nPersons = nEvent.ele('persons');
        prog.conferencier.split(', ').forEach(person => {
            let personTxt = person;
            if (prog.organisation) personTxt += ` (${prog.organisation})`;
            nPersons.ele('person').att('id', getPersonId(person)).txt(personTxt);
        });
    }

}

// XML Frab 
const xml = doc.end({ prettyPrint: true });

// Créer un fichier d'export
try {
    let fileName = 'schedule.xml';
    fs.writeFileSync(`${__dirname}/${fileName}`, xml);
    console.log(`file "${fileName}" written successfully`);
} catch (err) {
    console.error(err);
}

/**
 * Generate a ID for the person
 * @param {string} person 
 * @returns ID
 */
function getPersonId(person) {
    let code = 0;
    for (let i = 0; i < person.length; i++) {
        code += (1 + i) * person.charCodeAt(i);
    }
    return code;
}

/**
 * Get duration between start and end
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns duration in minutes
 */
function getDuration(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
        hours = hours + 24;

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}