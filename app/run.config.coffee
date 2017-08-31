angular.module('comss').run ($rootScope, $state, $stateParams, $localStorage, $transitions, UserService, DjNotification, $interval, webNotification, UserAPI)->
  $rootScope.$state = $state
  $rootScope.$stateParams = $stateParams
  $rootScope.host = 'https://seicento-backend.herokuapp.com'
  # $rootScope.host = 'http://localhost:8080'
  return