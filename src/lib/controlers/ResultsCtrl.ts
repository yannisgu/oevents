
module App.Controllers{
    export class ResultsCtrl{

        constructor($scope,  $location : ng.ILocationService){

            $scope.searchPerson = function() {
                 if($scope.person){
                     $location.path('person').search({person: $scope.person})
                 }
            }

            $scope.onCategorySearch = function(query) {
                $location.search({queryCategory: JSON.stringify(query)});
            }
            $scope.onClubSearch = function(query) {
                $location.search({queryClub: JSON.stringify(query)});
            }


            routeUpdate();

            $scope.$on('$routeUpdate', function(){
                routeUpdate();
            });

            function routeUpdate() {
                if($location.search().queryCategory) {
                    $scope.tabCategoryOpen = true;
                    $scope.categoryQuery = JSON.parse($location.search().queryCategory);
                }

                if($location.search().queryClub) {
                    $scope.tabClubOpen = true;
                    $scope.queryClub = JSON.parse($location.search().queryClub);
                }

            }
        }
    }

}


App.registerController("ResultsCtrl", ["$scope", "$location"]);
