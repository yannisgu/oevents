module Controllers {


    export interface IResultsByCategoryScope extends ng.IScope {
        category : String;
        search : Function;
        fromDate: Date;
        toDate: Date;
        loading : Boolean;
        sortField: String;
        sort: Function;
        groups: Array<IGroupCategoryResults>;
    }



    export interface IGroupCategoryResults {
        title;
        persons;
        isOpen: Boolean;
    }

    export class ResultsByCategoryCtrl {

        constructor($scope : IResultsByCategoryScope){
            $scope.sortField = "name";

            $scope.search = function() {
                $scope.loading = true;
                $scope.groups = [];

                dpd.results.get({category: $scope.category}, function(res, err){
                    $scope.loading = false;
                    if(err) {
                        $scope.$apply();
                        throw err;
                    }
                    var persons = _.reduce(res, function(merged, object, index){
                        var index = object.name + object.yearOfBirth;
                        merged[index] = merged[index] || {
                            name: object.name,
                            yearOfBirth: object.yearOfBirth,
                            victories : 0,
                            counts : 0,
                            podiums: 0

                        }
                        if(object.rank == 1) merged[index].victories++;
                        if(_.indexOf([1,2,3], object.rank, true) > -1) merged[index].podiums++;
                        merged[index].counts++;
                        return merged;
                    }, {});



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
                    var personsArray = [];

                    for(var i in persons){
                        personsArray.push(persons[i]);
                    }


                    var groups : Array<IGroupCategoryResults> = [];

                    /*if($scope.groupByYear){
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
                    else{*/
                        groups.push({
                            title : "All",
                            persons: personsArray,
                            isOpen: true
                        })
                   // }

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