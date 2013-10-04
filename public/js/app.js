var Controllers;
(function (Controllers) {
    var IndexCtrl = (function () {
        function IndexCtrl($scope) {
        }
        return IndexCtrl;
    })();
    Controllers.IndexCtrl = IndexCtrl;
})(Controllers || (Controllers = {}));
var Controllers;
(function (Controllers) {
    var ResultsByCategoryCtrl = (function () {
        function ResultsByCategoryCtrl($scope) {
            $scope.sortField = "name";

            $scope.search = function () {
                $scope.loading = true;
                $scope.groups = [];

                dpd.results.get({ category: $scope.category }, function (res, err) {
                    $scope.loading = false;
                    if (err) {
                        $scope.$apply();
                        throw err;
                    }
                    var persons = _.reduce(res, function (merged, object, index) {
                        var index = object.name + object.yearOfBirth;
                        merged[index] = merged[index] || {
                            name: object.name,
                            yearOfBirth: object.yearOfBirth,
                            victories: 0,
                            counts: 0,
                            podiums: 0
                        };
                        if (object.rank == 1)
                            merged[index].victories++;
                        if (_.indexOf([1, 2, 3], object.rank, true) > -1)
                            merged[index].podiums++;
                        merged[index].counts++;
                        return merged;
                    }, {});

                    if ($scope.fromDate || $scope.toDate) {
                        res = _.filter(res, function (result) {
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
                    var personsArray = [];

                    for (var i in persons) {
                        personsArray.push(persons[i]);
                    }

                    var groups = [];

                    groups.push({
                        title: "All",
                        persons: personsArray,
                        isOpen: true
                    });

                    $scope.groups = groups;
                    $scope.$apply();
                });
            };

            $scope.sort = function (field) {
                $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
            };
        }
        return ResultsByCategoryCtrl;
    })();
    Controllers.ResultsByCategoryCtrl = ResultsByCategoryCtrl;
})(Controllers || (Controllers = {}));
var Controllers;
(function (Controllers) {
    var ResultsCtrl = (function () {
        function ResultsCtrl($scope) {
            $scope.Message = "yxvc";
        }
        return ResultsCtrl;
    })();
    Controllers.ResultsCtrl = ResultsCtrl;
})(Controllers || (Controllers = {}));
var Controllers;
(function (Controllers) {
    var ResultsByPersonCtrl = (function () {
        function ResultsByPersonCtrl($scope) {
            $scope.sortField = "event.date";

            $scope.search = function () {
                var yearOfBirth = $scope.yearOfBirth;
                if (yearOfBirth.length == 4) {
                    yearOfBirth = yearOfBirth.substr(2);
                }

                $scope.loading = true;
                $scope.groups = [];

                dpd.resultsevents.get({ name: $scope.name, yearOfBirth: yearOfBirth }, function (res, err) {
                    $scope.loading = false;
                    if (err) {
                        $scope.$apply();
                        throw err;
                    }
                    res = _.map(res, function (result) {
                        if (result.event && result.event.date) {
                            result.event.date = new Date(result.event.date);
                        }
                        return result;
                    });

                    if ($scope.fromDate || $scope.toDate) {
                        res = _.filter(res, function (result) {
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

                    var groups = [];

                    if ($scope.groupByYear) {
                        var groupObj = _.groupBy(res, function (result) {
                            return result.event.date.getFullYear();
                        });

                        for (var i in groupObj) {
                            groups.push({
                                title: i,
                                results: groupObj[i],
                                isOpen: false
                            });
                        }

                        groups = _.sortBy(groups, "title");
                    } else {
                        groups.push({
                            title: "All",
                            results: res,
                            isOpen: true
                        });
                    }

                    $scope.groups = groups;
                    $scope.$apply();
                });
            };

            $scope.sort = function (field) {
                $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
            };
        }
        return ResultsByPersonCtrl;
    })();
    Controllers.ResultsByPersonCtrl = ResultsByPersonCtrl;
})(Controllers || (Controllers = {}));
angular.module('app', ["templates-main", "controllers", "ui.bootstrap"]).config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/index', { templateUrl: 'templates/index.html', controller: "IndexCtrl" }).when('/results', { templateUrl: 'templates/results.html', controller: "ResultsCtrl" }).otherwise({ redirectTo: '/index' });
    }
]);
angular.module('controllers', []).controller(Controllers);
//# sourceMappingURL=file:////Users/yannisgu/Documents/Development/projects/oevents/public/js/app.js.map
