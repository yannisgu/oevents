module App.Directives {

    export function ResutsTableByPerson (){
return {
        templateUrl : 'templates/resutsTableByPerson.html',
        restrict : 'E',
        scope: {
            "results": "="
        },
        transclude: true,
        link : function($scope, element: JQuery, attrs: ng.IAttributes) {
            $scope.sortField = "date";

            $scope.sort = function (field) {
                $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
            }
        }
    }
    }
}


App.registerDirective('ResutsTableByPerson', []);
