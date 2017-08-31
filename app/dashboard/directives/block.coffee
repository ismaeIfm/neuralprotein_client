angular.module('comss.dashboard').directive 'block', () ->
	templateUrl: 'templates/dashboard/block'
	transclude: true
	scope: 
		blockTitle: '@title'
		blockSize: '@size'
		blockId: '@id'
		blockIcon: '@icon'
	controller: ($scope)->
		if not $scope.blockSize
			$scope.blockSize = 12
		else
			$scope.blockSize = parseInt $scope.blockSize