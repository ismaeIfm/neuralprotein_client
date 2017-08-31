angular.module('comss.dashboard').directive('badge', function() {
  return {
    templateUrl: 'templates/dashboard/badge'
  };
});

angular.module('comss.dashboard').directive('block', function() {
  return {
    templateUrl: 'templates/dashboard/block',
    transclude: true,
    scope: {
      blockTitle: '@title',
      blockSize: '@size',
      blockId: '@id',
      blockIcon: '@icon'
    },
    controller: function($scope) {
      if (!$scope.blockSize) {
        return $scope.blockSize = 12;
      } else {
        return $scope.blockSize = parseInt($scope.blockSize);
      }
    }
  };
});

angular.module('comss.dashboard').directive('blockHeader', function() {
  return {
    templateUrl: 'templates/dashboard/block_header',
    scope: {
      title: '@title',
      subtitle: '@subtitle',
      icon: '@icon'
    },
    controller: function($scope, $state, $rootScope) {
      $scope.updateHeader = function() {
        if (!$scope.icon) {
          $scope.icon = 'fa-dashboard';
        }
        if (!$scope.title) {
          if ($state.current.header && $state.current.header.title) {
            $scope.title = $state.current.header.title;
          } else {
            $scope.title = 'Dashboard';
          }
        }
        if (!$scope.subtitle) {
          if ($state.current.header && $state.current.header.subtitle) {
            return $scope.subtitle = $state.current.header.subtitle;
          } else {
            return $scope.subtitle = 'Statistics Overview';
          }
        }
      };
      $scope.updateHeader();
      return $rootScope.$on('stateChange', function(trasn) {
        console.log('juan');
        return $scope.updateHeader();
      });
    }
  };
});

angular.module('comss.dashboard').directive('dashboardNav', function() {
  return {
    templateUrl: 'templates/dashboard/nav'
  };
});

angular.module('comss.dashboard').directive('dashboardNavMenu', function() {
  return {
    templateUrl: 'templates/dashboard/nav_menu'
  };
});
