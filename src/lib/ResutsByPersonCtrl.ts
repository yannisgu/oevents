module Controllers{
    export interface IResultsByPersonScope extends ng.IScope {
        name: String;
        yearOfBirth : Number;
        search: Function;
        results: Array;

    }


    export class ResultsByPersonCtrl{



        constructor($scope : IResultsByPersonScope){
            $scope.yearOfBirth = 1994;
            $scope.search = function() {
                dpd.results.get({name: $scope.name, yearOfBirth: $scope.yearOfBirth.toString()}, function(res, err){
                    if(err) {
                        throw err;
                    }
                    res = _.map(res, function(result) {
                        if(result.event && result.event.date){
                            result.event.date = new Date(result.event.date);
                        }
                        return result;
                    });

                    res = _.sortBy(res, function(result){
                        return result.event ? result.event.date : 0;
                    });

                    $scope.results = res;
                    $scope.$apply();
                });
            }
        }
    }
}