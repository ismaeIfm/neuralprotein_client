angular.module('comss').run(function($rootScope, $state, $stateParams, $localStorage, $transitions, UserService, DjNotification, $interval, webNotification, UserAPI) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.host = 'https://seicento-backend.herokuapp.com';
});

var interceptor;

interceptor = function($q, $injector, $rootScope, $state) {
  return {
    request: function(config) {
      var userAuth;
      userAuth = $injector.get("UserService");
      if (_.startsWith(config.url, "templates") || config.url.replace(".html") !== config.url) {
        return config;
      }
      if (_.startsWith(config.url, "/api")) {
        config.url = $rootScope.host + config.url;
        if (config.url.replace('token-auth') === config.url) {
          config.headers.Authorization = "Token " + userAuth.token;
        }
      }
      return angular.copy(config) || $q.when(angular.copy(config));
    },
    requestError: function(rejection) {
      return $q.reject(rejection);
    },
    response: function(response) {
      if (_.startsWith(response.config.url, "templates" || _.startsWith(response.config.url, "/templates"))) {
        return response;
      }
      return response;
    },
    responseError: function(rejection) {
      var err, error, msg, toaster, userAuth;
      toaster = $injector.get("toaster");
      userAuth = $injector.get("UserService");
      console.log("rejection", rejection);
      try {
        msg = rejection.data.detail;
      } catch (error) {
        err = error;
        msg = rejection.statusText;
      }
      if (rejection.status === 400) {
        toaster.pop('warning', 'Datos incorrectos', rejection.data);
      } else if (rejection.status >= 401 && rejection.status <= 403) {
        toaster.pop('warning', 'Error de sessión', rejection.data.detail);
        userAuth.logout();
        $state.go('login');
      } else if (rejection.status >= 500) {
        toaster.pop('error', 'Servicio fuera de línea', 'Intenta de nuevo en unos minutos.');
      } else if (rejection.status >= 400) {
        toaster.warning(msg);
      }
      return $q.reject(rejection);
    }
  };
};

angular.module('comss').service("DashboardSettings", function($http) {
  this.getTemplateUrl = function(appName, templateName) {
    return "templates/" + appName + "/" + templateName;
  };
});

angular.module('comss').config(function($stateProvider, $locationProvider, $localStorageProvider, $httpProvider, $qProvider) {
  $stateProvider.state('index', {
    templateUrl: "templates/dashboard/master_dashboard",
    url: '/',
    controller: function($scope, $state) {
      if ($state.current.name === 'index') {
        return $state.go('index.dashboard');
      }
    }
  });
  $stateProvider.state('index.dashboard', {
    templateUrl: "templates/dashboard/home",
    url: 'dashboard'
  });
  $stateProvider.state('index.nf', {
    templateUrl: "templates/dashboard/nf",
    url: 'neighbor-finder'
  });
  $stateProvider.state('index.about', {
    templateUrl: "templates/dashboard/about",
    url: 'about'
  });
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push(interceptor);
  $localStorageProvider.setKeyPrefix('neural.comss.');
  $qProvider.errorOnUnhandledRejections(false);
});
