
angular.module('comss.dashboard', []).config ($routeProvider) ->

  $routeProvider.when "/url/:id",
    templateUrl: settings.getTemplateUrl 'dashboard', "templatename"
    controller: "ControllerName"


  return

angular.module('comss.dashboard', []).run ()->
  return
