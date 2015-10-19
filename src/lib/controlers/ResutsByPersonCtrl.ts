module App.Controllers {
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
        query: Object;

    }

    export interface IGroupResults {
        title;
        results: Array<any>;
        isOpen: Boolean;
    }


    export interface IQuery{
        name : String;
        yearOfBirth? : String;
    }


    export class ResultsByPersonCtrl {

        constructor($scope:IResultsByPersonScope, $location:ng.ILocationService) {

            $scope.groups = [];

            $scope.$on("newQuery", function () {
                queryData();
            })


            $scope.search = function () {
                $location.search({queryPerson: JSON.stringify(getQuery($scope)), tab: 'person'});
            }


            $scope.sort = function (field) {
                $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
            }

            $scope.sortField = "event.date";

            queryData();

            function queryData() {
                var queryString = $location.search().queryPerson;
                if (queryString) {
                    var query:IQuery = JSON.parse(queryString);
                    if (JSON.stringify(query) != JSON.stringify($scope.query)) {
                        $scope.query = query;
                        $scope.loading = true;
                        $scope.name = query.name

                        $scope.yearOfBirth = query.yearOfBirth

                        searchResults(query, $scope);
                    }
                }
            }

        }

    }
    function getQuery($scope) {
        var query:IQuery = {name: $scope.name};

        var yearOfBirth = $scope.yearOfBirth;
        if (yearOfBirth) {
            if (yearOfBirth.length == 4) {
                yearOfBirth = yearOfBirth.substr(2);
            }
            query.yearOfBirth = yearOfBirth;
        }

        return query;
    }

    function searchResults(query, $scope) {
        dpd.resultsevents.get(query, function (res, err) {
            $scope.loading = false;
            if (err) {
                $scope.$apply();
                throw err;
            }
            res = _.map(res, function (result : any) {
                if (result.event && result.event.date) {
                    result.event.date = new Date(result.event.date);
                }
                if (result.event && result.event.urlSource) {
                    result.event.url = result.event.urlSource.replace("kind=all", "kat=" + result.category)

                }
                return result;
            });

            if ($scope.fromDate || $scope.toDate) {
                res = _.filter(res, function (result : any) {
                    var returnValue = true;
                    if ($scope.fromDate) {
                        returnValue = returnValue && $scope.fromDate <= result.event.date;
                    }
                    if ($scope.toDate) {
                        returnValue = returnValue && $scope.toDate >= result.event.date;
                    }

                    return returnValue;
                });
            }

            var groups:Array<IGroupResults> = [];

            if ($scope.groupByYear) {
                var groupObj = _.groupBy(res, function (result : any) {
                    return result.event.date.getFullYear();
                })

                for (var i in groupObj) {
                    groups.push({
                        title: i,
                        results: groupObj[i],
                        isOpen: true
                    })
                }

                groups = _.sortBy(groups, "title");
            }
            else {
                groups.push({
                    title: "All",
                    results: res,
                    isOpen: true
                })
            }

            $scope.groups = groups;
            $scope.$apply();

        });
    }
}

App.registerController("ResultsByPersonCtrl", ["$scope", "$location"]);
