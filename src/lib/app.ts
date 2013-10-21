
declare var dpd;


//angular.module("app.services", []);
angular.module('app.controllers', []);
angular.module('app.directives', []);

angular.module('app', ["templates-main", "app.controllers", "app.directives", "ui.bootstrap", "pascalprecht.translate", 'pasvaz.bindonce']).
   config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/index', {templateUrl: 'templates/index.html',   controller: "IndexCtrl"}).
            when('/results', {templateUrl: 'templates/results.html', controller: "ResultsCtrl",  reloadOnSearch: false}).
            when('/person', {templateUrl: 'templates/person.html', controller: "PersonCtrl",  reloadOnSearch: false}).
            otherwise({redirectTo: '/index'})
    }]).config(['$translateProvider', function ($translateProvider) {
        var userlang = navigator.language || navigator.userLanguage;
        if(userlang && userlang.length > 1){
            $translateProvider.preferredLanguage(userlang.substring(0, 2));
        }
        $translateProvider.fallbackLanguage("de");
    }]);
    ;


module App {
    export module Services {};
    export module Controllers {};
    export module Directives {};

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

    /**
     * Register new directive.
     *
     * @param className
     * @param services
     */
    export function registerDirective (className: string, services = []) {
        var directive = className[0].toLowerCase() + className.slice(1);
        services.push(App.Directives[className]);
        angular.module('app.directives').directive(directive, services);
    }

    export function registerTranslation(language, strings){
        angular.module('app').config(['$translateProvider', function ($translateProvider) {
            // deutsche Sprache
            $translateProvider.translations(language,strings);



        }]);
    }
}