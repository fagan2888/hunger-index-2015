#!/usr/bin/env python

import json
import csv

geodata = json.loads(open("ghi-countries.geo.json", "r").read())
scores = csv.DictReader(open("ghi-scores.csv", "r"))

country_codes = [entry['id'] for entry in geodata['features']]

for s in scores:
    if s['countrycode3'] in country_codes:
        for entry in geodata['features']:
            if entry['id'] == s['countrycode3']:
                entry['properties']['name'] = s['country']
                entry['properties']['score'] = s['score2015']
                break
    else:
        print "Not found: " + s['country']

f = open("../site/app/data/mockdata.geo.json", 'w')
f.write(json.dumps(geodata, indent=2))
f.close()
