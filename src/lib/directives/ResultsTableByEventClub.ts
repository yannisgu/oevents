module App.Directives {

    export function ResultsTableByEventClub() {
        return {
            templateUrl: 'templates/resultsTableByEventClub.html',
            restrict: 'E',
            scope: {
                "isOpen": "=",
                "results": "="
            },
            transclude: true,

            link: function($scope, element:JQuery, attrs:ng.IAttributes) {

                $scope.sortEvent = function(field) {
                    $scope.sortFieldEvent = $scope.sortFieldEvent == field ? "-" +field : field;
                }
            }
        }
    }

}


App.registerDirective('ResultsTableByEventClub', []);
