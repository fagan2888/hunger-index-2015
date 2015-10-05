#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Options:

 -c Clear local repos and clone everything again
 -o Offline, don't clone or pull remote repos

TODO:
- read scripts/ dir and run the preparation scripts

'''

import os
import jinja2
import json
import csv
import codecs
import markdown

# Specify the static page names to render
static_pages = ["about", "contact", "hunger", "methodology", "trends"]

# set up Jinja
template_dir = "../site/jinja_templates"
env = jinja2.Environment(loader=jinja2.FileSystemLoader([template_dir]))

csvdata = csv.reader(open("../data/messages.csv", 'r'))
messages = {label: text for label, text, text_de in csvdata}


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


def create_index_page():
    template = env.get_template("index.html")

    table_entries = json.loads(open("../data/table_data.json", "r").read())["data"]
    for entry in table_entries:
        entry['level'] = get_level_from_score(entry['score']['year2015'])

    context = {"table_entries": table_entries,
               "m": messages,
               "relpath": "",
               }
    contents = template.render(**context)
    f = codecs.open("../site/app/html/index.html", 'w', 'utf-8')
    f.write(contents)
    f.close()


def create_static_page(name):
    template = env.get_template("static.html")

    content = markdown.markdown(open("../data/pages/%s.md" % name, "r").read())
    context = {"md_content": content,
               "m": messages,
               "relpath": "../",
               }
    contents = template.render(**context)
    dirname = "../site/app/html/%s/" % name
    if not os.path.exists(dirname):
        os.makedirs(dirname)
    f = codecs.open(os.path.join(dirname, "index.html"), 'w', 'utf-8')
    f.write(contents)
    f.close()

if __name__ == "__main__":
    create_index_page()
    for p in static_pages:
        create_static_page(p)
