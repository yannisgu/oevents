
declare var dpd;


angular.module('app', ["templates-main", "controllers", "ui.bootstrap"]).
   config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/index', {templateUrl: 'templates/index.html',   controller: "IndexCtrl"}).
            when('/results', {templateUrl: 'templates/results.html', controller: "ResultsCtrl"}).
            otherwise({redirectTo: '/index'})
    }]);

