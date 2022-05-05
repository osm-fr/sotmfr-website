import json
import csv
import sys

from typing import List, Union

# colonnes
# 0 numéro
# 1 placement
# 2 intitulé

# 3 prenom nom 1
# 4 organisme 1
# 5 fonction 1
# 6 pseudo osm 1

# 7 prenom nom 2
# 8 organisme 2
# 9 fonction 2
# 10 pseudo osm 2

# 11 prenom nom 3
# 12 organisme 3
# 13 fonction 3
# 14 pseudo osm 3

# 15 format
# 16 date
# 17 date
# 18 date
# 19 date
# 20 date
# 21 date

# 22 resume

# tags -----
# 23 public visé
# 24 communaute
# 25 animer
# 26 contribuer
# 27 utiliser
# 28 visualiser
# 29 outils
# 30 cartographie
# 31 geomatique
# 32 adresses
# 33 humanitaire
# 34 indoor
# 35 territoires
# 36 mobilites
# 37 plein air
# 38 enseignement et recherche

# 39 renseignements complementaires

if len(sys.argv) < 2:
    print('Usage: generateProgramme.py <csv input> <json output>\n')
    print('Example: generateProgramme.py programme.csv programme.json\n')
    print(
        'The json programme should already have the time, name, number, and room for the output to be complete'
    )
    sys.exit(1)

TAGS = {
    24: 'Communauté',
    25: 'Animer',
    26: 'Contribuer',
    27: 'Utiliser',
    28: 'Visualiser',
    29: 'Outils',
    30: 'Cartographie',
    31: 'Géomatique',
    32: 'Adresses',
    33: 'Humanitaire',
    34: 'Indoor',
    35: 'Territoires',
    36: 'Mobilités',
    37: 'Plein-air',
    38: 'Enseignement et recherche',
}

with open(sys.argv[1], 'r',
          encoding='utf-8') as csvfile, open(sys.argv[2],
                                             'r',
                                             encoding='utf-8') as jsonfile:
    progjson: List[dict[str, Union[str, List]]] = json.load(jsonfile)
    progcsv = csv.reader(csvfile, delimiter=',')
    next(progcsv)  # skip header

    for row in progcsv:
        for event in progjson:
            if event.get('numero', 0) == row[0]:
                conferenciers: str = ''
                for i in [3, 7, 11]:
                    if row[i] != '':
                        conferenciers += row[i].title() + ', '

                conferenciers = conferenciers[:-2]  # trim last comma
                event['conferencier'] = conferenciers

                organisations: str = ''
                for i in [4, 8, 12]:
                    if row[i] != '':
                        if row[i] not in organisations:  # in case several spaker have the same company
                            organisations += row[i] + ', '

                organisations = organisations[:-2]  # trim last comma
                event['organisation'] = organisations

                event['description'] = row[22]

                eventTags: List[str] = []

                if 'Intermédiaire' in row[23]:
                    eventTags.append('Intermédiaire')
                else:
                    eventTags.append(row[23])

                for i in range(24, 39):
                    if row[i] != '':
                        eventTags.append(TAGS[i])

                event['tags'] = eventTags

        # not breaking the loop because there might be an event cut in two

    # not using json.dump because it puts \\n in strings instead of \n
    f = open(sys.argv[2], 'w', encoding='utf-8')
    f.write(
        json.dumps(progjson, indent=4,
                   ensure_ascii=False).replace(r'\\n', r'\n'))
    f.close()
