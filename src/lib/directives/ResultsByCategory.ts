module App.Directives {

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

// db.results.group({key: {personId: 1},cond: {category: "D14"},reduce:  function(curr, res){res.count++; res.name =  curr; return res; } ,initial: {count: 0}})
    export function ResultsByCategory($location) {
        return {
            templateUrl: 'templates/resultsByCategory.html',
            restrict: 'E',
            scope: {
                "query": "=",
                "onSearch": '&'
            },
            transclude: true,

            link: ($scope, element:JQuery, attrs:ng.IAttributes) => {
                $scope.sortField = "-counts";
                $scope.limit = 50;

                $scope.openPerson = (person) => {
                    $location.path("person").search({person: person });
                }

                $scope.more = function () {
                    $scope.limit += 50;
                }

                $scope.search = () => {
                    $scope.groups = [];
                    $scope.query = {category: $scope.category.toUpperCase()};
                    $scope.onSearch({query: $scope.query});
                    queryData();
                }


                $scope.sort = function (field) {
                    $scope.sortField = $scope.sortField == "-" + field ? field : "-" + field;
                }

                queryData();

                function queryData() {
                    if ($scope.query) {
                        var query:ICategoryQuery = $scope.query;

                        $scope.loading = true;
                        $scope.category = query.category

                        searchResults(query, $scope);
                    }
                }
            }
        }
    }

    function searchResults(query, $scope) {

        query.$fields = {personId: 1, name: 1, yearOfBirth: 1, rank: 1};

        dpd.results.get(query, function (res, err) {
            $scope.loading = false;
            if (err) {
                $scope.$apply();
                throw err;
            }

            console.log(new Date().getTime())

            var persons = _.reduce(res, function (merged, object : any, index2) {
                var index = object.personId;
                merged[index] = merged[index] || {
                    name: object.name,
                    personId: object.personId,
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


App.registerDirective('ResultsByCategory', ["$location"]);
