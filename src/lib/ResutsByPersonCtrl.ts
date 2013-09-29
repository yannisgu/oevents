module Controllers{
    export interface IResultsByPersonScope extends ng.IScope {
        name: String;
        yearOfBirth : String;
        sortField: String;
        search: Function;
        sort: Function;
        groups: Array<IGroupResults>;
        loading : Boolean;
        groupByYear: Boolean;
        fromDate: Date;
        toDate: Date;

    }

    export interface IGroupResults {
        title;
        results: Array;
        isOpen: Boolean;
    }


    export class ResultsByPersonCtrl{



        constructor($scope : IResultsByPersonScope){
            $scope.sortField = "event.date";

            $scope.search = function() {
                var yearOfBirth = $scope.yearOfBirth;
                if(yearOfBirth.length == 4){
                    yearOfBirth = yearOfBirth.substr(2);
                }

                $scope.loading = true;
                $scope.groups = [];

                dpd.results.get({name: $scope.name, yearOfBirth: yearOfBirth}, function(res, err){
                    $scope.loading = false;
                    if(err) {
                        $scope.$apply();
                        throw err;
                    }
                    res = _.map(res, function(result) {
                        if(result.event && result.event.date){
                            result.event.date = new Date(result.event.date);
                        }
                        return result;
                    });

                    if($scope.fromDate || $scope.toDate) {
                        res = _.filter(res, function(result){
                            var returnValue = true;
                            if($scope.fromDate) {
                                returnValue = returnValue && $scope.fromDate <= result.event.date;
                            }
                            if($scope.toDate) {
                                returnValue = returnValue && $scope.toDate >= result.event.date;
                            }

                            return returnValue;
                        });
                    }

                    var groups : Array<IGroupResults> = [];

                    if($scope.groupByYear){
                        var groupObj =  _.groupBy(res, function(result){
                            return result.event.date.getFullYear();
                        })

                        for(var i in groupObj){
                            groups.push({
                                title: i,
                                results: groupObj[i],
                                isOpen: false
                            })
                        }

                       groups = _.sortBy(groups, "title" );
                    }
                    else{
                        groups.push({
                            title : "All",
                            results: res,
                            isOpen: true
                        })
                    }

                    $scope.groups = groups;
                    $scope.$apply();
                });
            }

            $scope.sort = function(field) {
                $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField :  field;
            }
        }
    }
}