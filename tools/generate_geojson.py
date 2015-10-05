#!/usr/bin/env python

import json
import csv
import copy

geodata = json.loads(open("../data/ghi-countries.geo.json", "r").read())
scores = csv.DictReader(open("../data/ghi-scores.csv", "r"))
ind_reader = csv.DictReader(open("../data/ghi-indicators.csv", "r"))
indicators = {}
for row in ind_reader:
    country = row['country']
    del row['country']
    info = row
    indicators[country] = info

country_codes = [entry['id'] for entry in geodata['features']]
years = [1990, 1995, 2000, 2005, 2015]

for s in scores:
    if s['countrycode3'] in country_codes:
        exists = False
        for entry in geodata['features']:
            if entry['id'] == s['countrycode3']:
                exists = True
                entry['properties']['name'] = s['country']
                entry['properties']['score'] = {
                    'year2015': s['score2015'],
                    'year2005': s['score2005'],
                    'year2000': s['score2000'],
                    'year1995': s['score1995'],
                    'year1990': s['score1990'],
                }
                break
        if not exists:
            print "Not in scores: " + s['country']

    else:
        print "Not found: " + s['country']

# zero out industrialized countries' scores, needed for Leaflet to parse this
# correctly
for entry in geodata['features']:
    if not entry['properties'].get('score'):
        entry['properties']['score'] = {
            'year2015': 'nc',
            'year2005': 'nc',
            'year2000': 'nc',
            'year1995': 'nc',
            'year1990': 'nc',
        }

# divide into yearly files
for year in years:
    year_data = copy.deepcopy(geodata)
    year_data['features'] = []
    for entry in geodata['features']:
        # copy entry
        new_entry = copy.deepcopy(entry)
        # replace score dict with value for this year
        new_entry['properties']['score'] = new_entry['properties']['score']['year' + str(year)]
        year_data['features'].append(new_entry)
    f = open("../site/app/data/countrydata-%d.geo.json" % year, 'w')
    f.write(json.dumps(year_data, indent=2))
    f.close()


f = open("../site/app/data/countrydata.geo.json", 'w')
f.write(json.dumps(geodata, indent=2))
f.close()

# table data
table_entries = []
for entry in geodata['features']:
    if entry['properties']['score']['year2015'] == 'nc':
        continue

    country_name = entry['properties']['name']
    country_id = entry['id']
    d = {'name': country_name,
         'id': country_id,
         'score': entry['properties']['score'],
         'details': {
             'undernourished': {
                 1990: {'score': indicators[country_name]['under-1990'],
                        'estimate': bool(indicators[country_name]['under-1990-est'])},
                 1995: {'score': indicators[country_name]['under-1995'],
                        'estimate': bool(indicators[country_name]['under-1995-est'])},
                 2000: {'score': indicators[country_name]['under-2000'],
                        'estimate': bool(indicators[country_name]['under-2000-est'])},
                 2005: {'score': indicators[country_name]['under-2005'],
                        'estimate': bool(indicators[country_name]['under-2005-est'])},
                 2015: {'score': indicators[country_name]['under-2015'],
                        'estimate': bool(indicators[country_name]['under-2015-est'])},
             },
             'stunting': {
                 1990: {'score': indicators[country_name]['stunting-1990'],
                        'estimate': bool(indicators[country_name]['stunting-1990-est'])},
                 1995: {'score': indicators[country_name]['stunting-1995'],
                        'estimate': bool(indicators[country_name]['stunting-1995-est'])},
                 2000: {'score': indicators[country_name]['stunting-2000'],
                        'estimate': bool(indicators[country_name]['stunting-2000-est'])},
                 2005: {'score': indicators[country_name]['stunting-2005'],
                        'estimate': bool(indicators[country_name]['stunting-2005-est'])},
                 2015: {'score': indicators[country_name]['stunting-2015'],
                        'estimate': bool(indicators[country_name]['stunting-2015-est'])},
             },
             'wasting': {
                 1990: {'score': indicators[country_name]['wasting-1990'],
                        'estimate': bool(indicators[country_name]['wasting-1990-est'])},
                 1995: {'score': indicators[country_name]['wasting-1995'],
                        'estimate': bool(indicators[country_name]['wasting-1995-est'])},
                 2000: {'score': indicators[country_name]['wasting-2000'],
                        'estimate': bool(indicators[country_name]['wasting-2000-est'])},
                 2005: {'score': indicators[country_name]['wasting-2005'],
                        'estimate': bool(indicators[country_name]['wasting-2005-est'])},
                 2015: {'score': indicators[country_name]['wasting-2015'],
                        'estimate': bool(indicators[country_name]['wasting-2015-est'])},
             },
             'mortality': {
                 1990: {'score': indicators[country_name]['mortality-1990']},
                 1995: {'score': indicators[country_name]['mortality-1995']},
                 2000: {'score': indicators[country_name]['mortality-2000']},
                 2005: {'score': indicators[country_name]['mortality-2005']},
                 2013: {'score': indicators[country_name]['mortality-2013']},
             }}}
    table_entries.append(d)

# https://stackoverflow.com/a/73044
# table_entries.sort(lambda x, y: cmp(x['score']['year2015'], y['score']['year2015']))

table_data = {'data': table_entries}

f = open("../data/table_data.json", 'w')
f.write(json.dumps(table_data, indent=2))
f.close()
