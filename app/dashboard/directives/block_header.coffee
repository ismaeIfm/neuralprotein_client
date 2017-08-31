angular.module('comss.dashboard').directive 'blockHeader', () ->
	templateUrl: 'templates/dashboard/block_header'
	scope:
		title: '@title'
		subtitle: '@subtitle'
		icon: '@icon'
	controller: ($scope, $state, $rootScope)->
		$scope.updateHeader = ->
			if not $scope.icon
				$scope.icon = 'fa-dashboard'

			if not $scope.title
				if $state.current.header and $state.current.header.title
					$scope.title = $state.current.header.title
				else
					$scope.title = 'Dashboard'

			if not $scope.subtitle
				if $state.current.header and $state.current.header.subtitle
					$scope.subtitle = $state.current.header.subtitle
				else
					$scope.subtitle = 'Statistics Overview'

		$scope.updateHeader()
		$rootScope.$on 'stateChange', (trasn)->
			console.log 'juan'
			$scope.updateHeader()
			