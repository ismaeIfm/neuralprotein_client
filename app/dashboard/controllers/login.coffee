angular.module('comss.dashboard').controller 'DashboardLoginController', ($scope, UserService, $state, toaster)->
  $scope.user = {}

  $scope.login = ->
    UserService.login($scope.user).then (response)->
      toaster.pop 'success', 'Bienvenido'

      $state.go 'index'
      return
  return