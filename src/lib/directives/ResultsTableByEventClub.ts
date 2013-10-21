module App.Directives {

    export class ResultsTableByEventClub {
        templateUrl = 'templates/ResultsTableByEventClub.html';
        restrict = 'E';
        scope = {
        };
        transclude = true;

        link($scope, element:JQuery, attrs:ng.IAttributes) {

        }
    }

}


App.registerDirective('ResultsTableByEventClub', []);
