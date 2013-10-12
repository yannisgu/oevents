
module App.Controllers{
    export class ResultsCtrl{

        constructor($scope,  $location : ng.ILocationService){
            routeUpdate();

            $scope.$on('$routeUpdate', function(){
                routeUpdate();
            });

            function routeUpdate() {
                $scope.tabCategoryOpen = $location.search().tab == "category";
                console.log("tabCategoryOPen" + $scope.tabCategoryOpen)
                $scope.tabPersonOpen = $location.search().tab == "person";

                console.log("tabPersonOpen" + $scope.tabPersonOpen)
                $scope.$broadcast("newQuery")

            }
        }
    }

}


App.registerController("ResultsCtrl", ["$scope", "$location"]);
