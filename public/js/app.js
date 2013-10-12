angular.module('app.controllers', []);

angular.module('app', ["templates-main", "app.controllers", "ui.bootstrap"]).config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/index', { templateUrl: 'templates/index.html', controller: "IndexCtrl" }).when('/results', { templateUrl: 'templates/results.html', controller: "ResultsCtrl", reloadOnSearch: false }).otherwise({ redirectTo: '/index' });
    }
]);

var App;
(function (App) {
    function registerController(className, services) {
        if (typeof services === "undefined") { services = []; }
        var controller = 'app.controllers.' + className;
        services.push(App.Controllers[className]);
        angular.module('app.controllers').controller(className, services);
    }
    App.registerController = registerController;
})(App || (App = {}));
var App;
(function (App) {
    (function (Controllers) {
        var IndexCtrl = (function () {
            function IndexCtrl($scope) {
            }
            return IndexCtrl;
        })();
        Controllers.IndexCtrl = IndexCtrl;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));

App.registerController("IndexCtrl", []);
var App;
(function (App) {
    (function (Controllers) {
        var ResultsByCategoryCtrl = (function () {
            function ResultsByCategoryCtrl($scope, $location) {
                $scope.sortField = "name";

                $scope.openPerson = function (person) {
                    $location.search({ queryPerson: JSON.stringify({ name: person }), tab: 'person' });
                };

                $scope.search = function () {
                    $scope.groups = [];
                    var query = { category: $scope.category };
                    $location.search({ queryCategory: JSON.stringify(query), tab: "category" });
                };

                $scope.$on("newQuery", function () {
                    queryData();
                });

                $scope.sort = function (field) {
                    $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
                };

                queryData();

                function queryData() {
                    var queryString = $location.search().queryCategory;
                    if (queryString) {
                        var query = JSON.parse(queryString);
                        if (JSON.stringify(query) != JSON.stringify($scope.query)) {
                            $scope.query = query;
                            $scope.loading = true;
                            $scope.category = query.category;

                            searchResults(query, $scope);
                        }
                    }
                }
            }
            return ResultsByCategoryCtrl;
        })();
        Controllers.ResultsByCategoryCtrl = ResultsByCategoryCtrl;

        function getQuery($scope) {
            return { category: $scope.category };
        }

        function searchResults(query, $scope) {
            dpd.results.get(query, function (res, err) {
                $scope.loading = false;
                if (err) {
                    $scope.$apply();
                    throw err;
                }

                console.log(new Date().getTime());

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

                var personsArray = [];

                for (var i in persons) {
                    personsArray.push(persons[i]);
                }

                $scope.persons = personsArray;

                $scope.$apply();
            });
        }
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));

App.registerController("ResultsByCategoryCtrl", ["$scope", "$location"]);
var App;
(function (App) {
    (function (Controllers) {
        var ResultsCtrl = (function () {
            function ResultsCtrl($scope, $location) {
                routeUpdate();

                $scope.$on('$routeUpdate', function () {
                    routeUpdate();
                });

                function routeUpdate() {
                    $scope.tabCategoryOpen = $location.search().tab == "category";
                    console.log("tabCategoryOPen" + $scope.tabCategoryOpen);
                    $scope.tabPersonOpen = $location.search().tab == "person";

                    console.log("tabPersonOpen" + $scope.tabPersonOpen);
                    $scope.$broadcast("newQuery");
                }
            }
            return ResultsCtrl;
        })();
        Controllers.ResultsCtrl = ResultsCtrl;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));

App.registerController("ResultsCtrl", ["$scope", "$location"]);
var App;
(function (App) {
    (function (Controllers) {
        var ResultsByPersonCtrl = (function () {
            function ResultsByPersonCtrl($scope, $location) {
                $scope.groups = [];

                $scope.$on("newQuery", function () {
                    queryData();
                });

                $scope.search = function () {
                    $location.search({ queryPerson: JSON.stringify(getQuery($scope)), tab: 'person' });
                };

                $scope.sort = function (field) {
                    $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
                };

                $scope.sortField = "event.date";

                queryData();

                function queryData() {
                    var queryString = $location.search().queryPerson;
                    if (queryString) {
                        var query = JSON.parse(queryString);
                        if (JSON.stringify(query) != JSON.stringify($scope.query)) {
                            $scope.query = query;
                            $scope.loading = true;
                            $scope.name = query.name;

                            $scope.yearOfBirth = query.yearOfBirth;

                            searchResults(query, $scope);
                        }
                    }
                }
            }
            return ResultsByPersonCtrl;
        })();
        Controllers.ResultsByPersonCtrl = ResultsByPersonCtrl;
        function getQuery($scope) {
            var query = { name: $scope.name };

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
                res = _.map(res, function (result) {
                    if (result.event && result.event.date) {
                        result.event.date = new Date(result.event.date);
                    }
                    if (result.event && result.event.urlSource) {
                        result.event.url = result.event.urlSource.replace("kind=all", "kat=" + result.category);
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
                            isOpen: true
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
        }
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));

App.registerController("ResultsByPersonCtrl", ["$scope", "$location"]);
//# sourceMappingURL=file:////Users/yannisgu/Documents/Development/projects/oevents/public/js/app.js.map
