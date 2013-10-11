
declare var dpd;


//angular.module("app.services", []);
angular.module('app.controllers', []);

angular.module('app', ["templates-main", "app.controllers", "ui.bootstrap"]).
   config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/index', {templateUrl: 'templates/index.html',   controller: "IndexCtrl"}).
            when('/results', {templateUrl: 'templates/results.html', controller: "ResultsCtrl",  reloadOnSearch: false}).
            otherwise({redirectTo: '/index'})
    }]);


module App {
    export module Services {}
    export module Controllers {}

    /*export function registerService (className: string, services = []) {
        var service = className[0].toLowerCase() + className.slice(1);
        services.push(() => new App.Services[className](arguments));
        angular.module('app.services').factory(service, services);
    }*/

    export function registerController (className: string, services = []) {
        var controller = 'app.controllers.' + className;
        services.push(App.Controllers[className]);
        angular.module('app.controllers').controller(className, services);
    }
}