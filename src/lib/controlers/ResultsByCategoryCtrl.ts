module App.Controllers {


    export interface IResultsByCategoryScope extends ng.IScope {
        category : String;
        search : Function;
        fromDate: Date;
        toDate: Date;
        loading : Boolean;
        sortField: String;
        sort: Function;
        openPerson: Function;
        groups: Array<IGroupCategoryResults>;
        query: Object;
    }

    interface ICategoryQuery{
        category : String;
    }


    export interface IGroupCategoryResults {
        title;
        persons;
        isOpen: Boolean;
    }

    export class ResultsByCategoryCtrl {


        constructor($scope:IResultsByCategoryScope, $location:ng.ILocationService) {
            $scope.sortField = "name";

            $scope.openPerson = function (person) {
                $location.search({queryPerson: JSON.stringify({name: person }), tab: 'person'})
            }

            $scope.search = function () {
                $scope.groups = [];
                var query = {category: $scope.category};
                $location.search({queryCategory: JSON.stringify(query), tab: "category" });
            }


            $scope.$on("newQuery", function () {
                queryData();
            })


            $scope.sort = function (field) {
                $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
            }

            queryData();

            function queryData() {
                var queryString = $location.search().queryCategory;
                if (queryString) {
                    var query:ICategoryQuery = JSON.parse(queryString);
                    if (JSON.stringify(query) != JSON.stringify($scope.query)) {
                        $scope.query = query;
                        $scope.loading = true;
                        $scope.category = query.category

                        searchResults(query, $scope);
                    }
                }
            }
        }

    }


    function getQuery($scope){
        return {category: $scope.category};
    }

    function searchResults(query, $scope) {
        dpd.results.get(query, function (res, err) {
            $scope.loading = false;
            if (err) {
                $scope.$apply();
                throw err;
            }

            console.log(new Date().getTime())

            var persons = _.reduce(res, function (merged, object, index) {
                var index = object.name + object.yearOfBirth;
                merged[index] = merged[index] || {
                    name: object.name,
                    yearOfBirth: object.yearOfBirth,
                    victories: 0,
                    counts: 0,
                    podiums: 0

                }
                if (object.rank == 1) merged[index].victories++;
                if (_.indexOf([1, 2, 3], object.rank, true) > -1) merged[index].podiums++;
                merged[index].counts++;
                return merged;
            }, {});

            var personsArray = [];

            for (var i in persons) {
                personsArray.push(persons[i]);
            }

            $scope.persons = personsArray;

            $scope.$apply();
        });
    }


}

App.registerController("ResultsByCategoryCtrl", ["$scope", "$location"]);