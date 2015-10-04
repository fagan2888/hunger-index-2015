#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Options:

 -c Clear local repos and clone everything again
 -o Offline, don't clone or pull remote repos

TODO:
- read scripts/ dir and run the preparation scripts

'''

import jinja2
import json
import csv
import codecs

config_file = "settings.conf"
output_dir = "_output"
repo_dir = "repos"
datasets_dir = "datasets"
files_dir = "download"
themes_dir = "themes"

# set up Jinja
template_dir = "../site/jinja_templates"
env = jinja2.Environment(loader=jinja2.FileSystemLoader([template_dir]))


def get_level_from_score(score):
    level = ""
    if score == "-":
        level = "no-data"
    elif score == "<5":
        level = "low"
    elif float(score) >= 50:
        level = "extra-alarming"
    elif float(score) >= 35:
        level = "alarming"
    elif float(score) >= 20:
        level = "serious"
    elif float(score) >= 10:
        level = "moderate"
    elif float(score) >= 0:
        level = "low"
    else:
        print "Unexpected score: ", score
    return level

'''

  return d >= 50 ? '#ab0635' :
    d >= 35  ? '#e9841d' :
    d >= 20  ? '#fbe0c7' :
    d >= 10  ? '#bedcb3' :
    d >= 0   ? '#4caf45' :
    '#eaeaea';

'''


def create_index_page():
    '''Generates the index page with the list of available packages.
    Accepts a list of pkg_info dicts, which are generated with the
    process_datapackage function.'''
    template = env.get_template("index.html")

    table_entries = json.loads(open("../data/table_data.json", "r").read())["data"]
    for entry in table_entries:
        entry['level'] = get_level_from_score(entry['score'])

    csvdata = csv.reader(open("../data/messages.csv", 'r'))
    messages = {label: text for label, text, text_de in csvdata}

    context = {"table_entries": table_entries,
               "m": messages,
               }
    contents = template.render(**context)
    f = codecs.open("../site/app/html/index.html", 'w', 'utf-8')
    f.write(contents)
    f.close()

if __name__ == "__main__":
    create_index_page()
