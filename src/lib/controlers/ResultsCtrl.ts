
module App.Controllers{
    export class ResultsCtrl{

        constructor($scope,  $location : ng.ILocationService){
            routeUpdate();

            $scope.$on('$routeUpdate', function(){
                routeUpdate();
            });

            function routeUpdate() {
                $scope.tabCategoryOpen = true; //$location.search().tab == "category";
                $scope.tabPersonOpen = false; //$location.search().tab == "person";
                $scope.$broadcast("newQuery")

            }
        }
    }

}


App.registerController("ResultsCtrl", ["$scope", "$location"]);
