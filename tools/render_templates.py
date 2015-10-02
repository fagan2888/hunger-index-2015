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
import sys
import os
import shutil
import markdown
import json
import codecs
from zenlog import log

config_file = "settings.conf"
output_dir = "_output"
repo_dir = "repos"
datasets_dir = "datasets"
files_dir = "download"
themes_dir = "themes"

# set up Jinja
template_dir = "../site/jinja_templates"
env = jinja2.Environment(loader=jinja2.FileSystemLoader([template_dir]))


def create_index_page():
    '''Generates the index page with the list of available packages.
    Accepts a list of pkg_info dicts, which are generated with the
    process_datapackage function.'''
    template = env.get_template("index.html")
    context = {"table_entries": json.loads(open("../data/table_data.json", "r").read())["data"]
               }
    contents = template.render(**context)
    f = codecs.open("../site/app/index.html", 'w', 'utf-8')
    f.write(contents)
    f.close()
    log.info("Created index.html.")

if __name__ == "__main__":
    create_index_page()
