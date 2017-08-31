#!/usr/bin/python

import os
import json
import sys

# var = raw_input("Change main name: ")

# raw_input("Change main name: ")

default_app_name = "angular"
json_files = ["package.json", "bower.json"]


services_template = """
angular.module('{module_name}').service "ServiceName", ($http)->
  return
"""

app_template = """
angular.module('{module_name}', []).config ($routeProvider) ->

  $routeProvider.when "/url/:id",
    templateUrl: settings.getTemplateUrl '{app_name}', "templatename"
    controller: "ControllerName"


  return

angular.module('{module_name}', []).run ()->
  return
"""

directive_template = """
angular.module('{module_name}').directive '{directive_name}', () ->
  scope:
  link: (scope, element, attrs)->
   return
  controller: ($scope)->
   return
"""

controller_template = """
angular.module('{module_name}').controller '{controller_name}', ($scope)->
 return
"""

template_template = """
tempalte.tpl.html
"""

dirs = ["controllers", "directives", "templates", "less"]
app_dir = "app"


def get_main_name():
    names = []
    for json_file in json_files:
        f = open(json_file, "r")

        data = json.loads(f.read())

        print "Name in %s is %s" % (json_file, data["name"])
        names.append(data["name"])
        f.close()

    return names


def change_main_app_name(new_name=None):
    if new_name is None:
        new_name = raw_input("Change main name: ")

    for json_file in json_files:
        f = file(json_file, "r")

        data = json.loads(f.read())

        data["name"] = new_name

        try:
            data["moduleName"] = new_name
        except KeyError, e:
            pass

        new_json = json.dumps(data, indent=4, sort_keys=True)

        f.close()

        f = open(json_file, "wb")

        f.write(new_json)

        f.close()


def make_dir(name, app_name=None):
    if app_name is None:
        os.mkdir("%s/%s" % (app_dir, name))
    else:
        os.mkdir("%s/%s/%s" % (app_dir, app_name, name))


def write_file(path, string, name):
    if name == "template":
        ext = ".tpl.html"
    elif ".tpl" in name:
        ext = ".html"
    else:
        ext = ".coffee"

    full_path = "%s%s%s" % (path, name, ext)
    print "Writing in: %s" % full_path
    f = open(full_path, "wb")
    f.write(string)
    f.close()


def start_app(app_name=None, name=None):
    # Copy files
    # Replace text
    # Write new
    module_name = "%s.%s" % (name, app_name)
    path = "%s/%s/" % (app_dir, app_name)

    directives_path = path + "directives/"
    templates_path = path + "templates/"
    controllers_path = path + "controllers/"

    if app_name is None:
        app_name = raw_input("App name: ")

    make_dir(app_name)

    for name in dirs:
        make_dir(name, app_name=app_name)

    app_string = app_template.format(module_name=module_name, app_name=app_name)
    write_file(path, app_string, "app_%s" % app_name)

    services_string = services_template.format(module_name=module_name)
    write_file(path, services_string, "services_%s" % app_name)

    # directive_string = directive_template.format(module_name=module_name, directive_name="DirectiveName")
    # write_file(directives_path, directive_string, "directive")

    # template_string = template_template
    # write_file(templates_path, directive_string, "template")

    # controllers_string = controller_template.format(module_name=module_name, controller_name="ControllerName")
    # write_file(controllers_path, controllers_string, "controller")


def underscore_to_camel_case(file_name):
    file_name_split = file_name.split("_")
    string = ""

    for fn in file_name_split:
        string += fn.title()

    return string


def make_file(app_name, file_type=None, name=None, file_name=None):
    path = "%s/%s/%ss/" % (app_dir, app_name, file_type)
    module_name = "%s.%s" % (name, app_name)

    if file_name is None:
        file_name = raw_input("%s name: " % file_type.title())

    if file_type == "directive":
        string = directive_template.format(module_name=module_name, directive_name=underscore_to_camel_case(file_name) + "Directive")
    elif file_type == "controller":
        string = controller_template.format(module_name=module_name, controller_name=underscore_to_camel_case(file_name) + "Controller")

        write_file("%s/%s/%ss/" % (app_dir, app_name, "template"), "", file_name + ".tpl")
    else:
        print "Missing 'file_type'"
        return

    write_file(path, string, file_name)

names = get_main_name()

if default_app_name in names:
    print "Must change main app name."
    change_main_app_name()


name = names[0]

actions = "(changename, startapp, makedirective, makecontroller)"

try:
    action = sys.argv[1]
except IndexError, e:
    print "Must use an argument %s" % actions


if action == "changename":
    try:
        new_name = sys.argv[2]
    except IndexError, e:
        new_name = None

    change_main_app_name(new_name=new_name)
elif action == "startapp":
    try:
        app_name = sys.argv[2]
    except IndexError, e:
        app_name = None

    start_app(app_name=app_name, name=name)

elif action == "makecontroller":
    try:
        app_name = sys.argv[2]
    except IndexError, e:
        app_name = raw_input("App name: ")

    try:
        file_name = sys.argv[3]
    except IndexError, e:
        file_name = None

    make_file(app_name, file_type="controller", name=name, file_name=file_name)
elif action == "makedirective":
    try:
        app_name = sys.argv[2]
    except IndexError, e:
        app_name = raw_input("App name: ")

    try:
        file_name = sys.argv[3]
    except IndexError, e:
        file_name = None

    make_file(app_name, file_type="directive", name=name, file_name=file_name)
else:
    print "Action must be one of: %s" % actions

