interceptor = ($q, $injector, $rootScope, $state) ->

  # On request success
  request: (config) ->
    userAuth = $injector.get "UserService"
    if _.startsWith(config.url, "templates") or config.url.replace(".html") isnt config.url
        return config

    if _.startsWith(config.url, "/api")
      config.url = $rootScope.host + config.url

      if config.url.replace('token-auth') is config.url
        config.headers.Authorization = "Token " + userAuth.token

    return angular.copy(config) || $q.when(angular.copy(config))


  # On request failure
  requestError: (rejection) ->
    $q.reject rejection


  # On response success
  response: (response) ->

    if _.startsWith response.config.url, "templates" or _.startsWith response.config.url, "/templates"
        return response
    
    response


  # On response failture
  responseError: (rejection) ->
    toaster = $injector.get "toaster"
    userAuth = $injector.get "UserService"
    console.log "rejection", rejection

    try
        msg = rejection.data.detail
    catch err
        msg = rejection.statusText

    if rejection.status is 400
      toaster.pop 'warning', 'Datos incorrectos', rejection.data
    else if rejection.status >= 401 and rejection.status <= 403
      toaster.pop 'warning', 'Error de sessión', rejection.data.detail
      userAuth.logout()
      $state.go 'login'
    else if rejection.status >= 500
      toaster.pop 'error', 'Servicio fuera de línea', 'Intenta de nuevo en unos minutos.'
    else if rejection.status >= 400
      toaster.warning msg

    return $q.reject(rejection)

angular.module('comss').service "DashboardSettings", ($http)->
  @getTemplateUrl = (appName, templateName)->
    "templates/" + appName + "/" + templateName 
  return



angular.module('comss').config ($stateProvider, $locationProvider, $localStorageProvider, $httpProvider, $qProvider) ->
  $stateProvider.state 'index',
    templateUrl: "templates/dashboard/master_dashboard"
    url: '/'
    controller: ($scope, $state)->
      $state.go('index.dashboard') if $state.current.name is 'index'

  $stateProvider.state 'index.dashboard',
    templateUrl: "templates/dashboard/home"
    url: 'dashboard'

  $stateProvider.state 'index.nf',
    templateUrl: "templates/dashboard/nf"
    url: 'neighbor-finder'

  $stateProvider.state 'index.about',
    templateUrl: "templates/dashboard/about"
    url: 'about'


  $locationProvider.html5Mode true
  $httpProvider.interceptors.push interceptor
  $localStorageProvider.setKeyPrefix 'neural.comss.'
  $qProvider.errorOnUnhandledRejections false

  return














