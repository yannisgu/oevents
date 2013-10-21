module App.Directives {

    export class ResultsByClub {
        templateUrl = 'templates/ResultsByClub.html';
        restrict = 'E';
        scope = {
        };
        transclude = true;

        link($scope, element:JQuery, attrs:ng.IAttributes) {

        }
    }

}


App.registerDirective('ResultsByClub', []);
