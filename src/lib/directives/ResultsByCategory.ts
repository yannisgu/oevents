module App.Directives {

    export class ResultsByCategory {
        templateUrl = 'templates/ResultsByCategory.html';
        restrict = 'E';
        scope = {
        };
        transclude = true;

        link($scope, element:JQuery, attrs:ng.IAttributes) {

        }
    }

}


App.registerDirective('ResultsByCategory', []);
