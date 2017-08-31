angular.module('comss.dashboard', []).config(function($routeProvider) {
  $routeProvider.when("/url/:id", {
    templateUrl: settings.getTemplateUrl('dashboard', "templatename"),
    controller: "ControllerName"
  });
});

angular.module('comss.dashboard', []).run(function() {});
