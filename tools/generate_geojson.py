#!/usr/bin/env python

import json
import csv

geodata = json.loads(open("ghi-countries.geo.json", "r").read())
scores = csv.DictReader(open("ghi-scores.csv", "r"))

country_names = [entry['properties']['name'] for entry in geodata['features']]

for entry in geodata['features']:
    print entry
    print

for s in scores:
    if s['country'] in country_names:
        for entry in geodata['features']:
            if entry['properties']['name'] == s['country']:
                entry['properties']['score'] = s['score2015']
                break
    else:
        print "Not found: " + s['country']

f = open("mockdata.geo.json", 'w')
f.write(json.dumps(geodata, indent=2))
f.close()
