angular.module('comss.dashboard').controller('DashboardLoginController', function($scope, UserService, $state, toaster) {
  $scope.user = {};
  $scope.login = function() {
    return UserService.login($scope.user).then(function(response) {
      toaster.pop('success', 'Bienvenido');
      $state.go('index');
    });
  };
});
