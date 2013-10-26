angular.module('app.controllers', []);
angular.module('app.directives', []);

angular.module('app', ["templates-main", "app.controllers", "app.directives", "ui.bootstrap", "pascalprecht.translate", 'pasvaz.bindonce']).config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/index', { templateUrl: 'templates/index.html', controller: "IndexCtrl" }).when('/results', { templateUrl: 'templates/results.html', controller: "ResultsCtrl", reloadOnSearch: false }).when('/person', { templateUrl: 'templates/person.html', controller: "PersonCtrl", reloadOnSearch: false }).otherwise({ redirectTo: '/index' });
        }
    ]).config([
        '$translateProvider',
        function ($translateProvider) {
            var userlang = navigator.language || navigator.userLanguage;
            if (userlang && userlang.length > 1) {
                $translateProvider.preferredLanguage(userlang.substring(0, 2));
            }
            $translateProvider.fallbackLanguage("de");
        }
    ]);
;

var App;
(function (App) {
    ;
    ;
    ;

    function registerController(className, services) {
        if (typeof services === "undefined") {
            services = [];
        }
        var controller = 'app.controllers.' + className;
        services.push(App.Controllers[className]);
        angular.module('app.controllers').controller(className, services);
    }

    App.registerController = registerController;

    function registerDirective(className, services) {
        if (typeof services === "undefined") {
            services = [];
        }
        var directive = className[0].toLowerCase() + className.slice(1);
        services.push(App.Directives[className]);
        angular.module('app.directives').directive(directive, services);
    }

    App.registerDirective = registerDirective;

    function registerTranslation(language, strings) {
        angular.module('app').config([
            '$translateProvider',
            function ($translateProvider) {
                $translateProvider.translations(language, strings);
            }
        ]);
    }

    App.registerTranslation = registerTranslation;
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
        var PersonCtrl = (function () {
            function PersonCtrl($scope, $location) {
                $scope.results = [];

                if ($location.search().person) {
                    $scope.personId = $location.search().person;
                    $scope.loading = true;
                    renderPerson($scope.personId);
                }

                $scope.sortCategory = function (field) {
                    $scope.sortFieldCategory = $scope.sortFieldCategory == field ? "-" + field : field;
                };

                $scope.sortYear = function (field) {
                    $scope.sortFieldYear = $scope.sortFieldYear == field ? "-" + field : field;
                };

                $scope.personChanged = function (id) {
                    $scope.loading = true;
                    $scope.$apply();
                    $location.search({ person: id });

                    renderPerson(id);
                };

                function renderPerson(id) {
                    dpd.resultsevents.get({ personId: id }, function (res, err) {
                        $scope.loading = false;

                        res = _.map(res, function (result) {
                            if (result.event && result.event.date) {
                                result.event.date = new Date(result.event.date);
                            }
                            if (result.event && result.event.urlSource) {
                                result.event.url = result.event.urlSource.replace("kind=all", "kat=" + result.category);
                            }
                            return result;
                        });

                        $scope.yearGroups = groupResultyBy(res, function (result) {
                            return result.event.date.getFullYear();
                        });

                        $scope.categoryGroups = groupResultyBy(res, function (result) {
                            return result.category;
                        });

                        $scope.results = res;
                        $scope.$apply();
                    });
                }
            }

            return PersonCtrl;
        })();
        Controllers.PersonCtrl = PersonCtrl;

        function groupResultyBy(results, groupFunction) {
            var groupsObj = _.reduce(results, function (merged, object, index) {
                var index = groupFunction(object);
                merged[index] = merged[index] || {
                    title: index,
                    victories: 0,
                    counts: 0,
                    podiums: 0,
                    results: []
                };
                if (object.rank == 1)
                    merged[index].victories++;
                if (_.indexOf([1, 2, 3], object.rank, true) > -1)
                    merged[index].podiums++;
                merged[index].counts++;
                merged[index].results.push(object);
                return merged;
            }, {});

            var groups = [];
            for (var i in groupsObj) {
                groups.push({
                    title: i,
                    data: groupsObj[i],
                    isOpen: true
                });
            }

            groups = _.sortBy(groups, "title");
            return groups;
        }
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));

App.registerController("PersonCtrl", ["$scope", "$location"]);
var App;
(function (App) {
    (function (Controllers) {
        var ResultsCtrl = (function () {
            function ResultsCtrl($scope, $location) {
                $scope.searchPerson = function () {
                    if ($scope.person) {
                        $location.path('person').search({ person: $scope.person });
                    }
                };

                $scope.onCategorySearch = function (query) {
                    $location.search({ queryCategory: JSON.stringify(query) });
                };
                $scope.onClubSearch = function (query) {
                    $location.search({ queryClub: JSON.stringify(query) });
                };

                routeUpdate();

                $scope.$on('$routeUpdate', function () {
                    routeUpdate();
                });

                function routeUpdate() {
                    if ($location.search().queryCategory) {
                        $scope.tabCategoryOpen = true;
                        $scope.categoryQuery = JSON.parse($location.search().queryCategory);
                    }

                    if ($location.search().queryClub) {
                        $scope.tabClubOpen = true;
                        $scope.queryClub = JSON.parse($location.search().queryClub);
                    }
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
var App;
(function (App) {
    (function (Directives) {
        Directives.PepoplePickerCache = {};
        function PeoplePicker() {
            return {
                templateUrl: 'templates/peoplePicker.html',
                restrict: 'E',
                scope: {
                    "onChange": '&',
                    "person": '=',
                    "placeholder": '='
                },
                transclude: true,
                link: function ($scope, element, attrs) {
                    $scope.$watch('person', function (oldValue, newValue) {
                        if (element.find(".people-picker").val() != $scope.person) {
                            if ($scope.person) {
                                dpd.people.get($scope.person, function (res, err) {
                                    console.log(res);
                                    if (res) {
                                        element.find(".people-picker").select2('data', { id: res.id, text: res.name + (res.yearOfBirth ? ", " + res.yearOfBirth : "") });
                                    }
                                });
                            }
                        }
                    });

                    element.find(".people-picker").select2({
                        minimumInputLength: 3,
                        placeholder: $scope.placeholder,
                        query: function (query) {
                            var terms = query.term.split(" ");
                            var data = {
                                results: []
                            };
                            var queries = [];
                            for (var i = 0; i < terms.length; i++) {
                                queries.push({ name: { "$regex": terms[i], $options: 'i' } });
                            }

                            var cache = App.Directives.PepoplePickerCache[query.term.substring(0, 3)];
                            if (cache) {
                                for (var i = 0; i < cache.length; i++) {
                                    var value = cache[i];
                                    var match = true;
                                    for (var j = 0; j < terms.length; j++) {
                                        if (!value.name.match(new RegExp(terms[j], "i"))) {
                                            match = false;
                                            break;
                                        }
                                    }

                                    if (match) {
                                        data.results.push({ id: value.id, text: value.name + (value.yearOfBirth ? ", " + value.yearOfBirth : "") });
                                    }
                                }
                                query.callback(data);
                            } else {
                                dpd.people.get({ "$and": queries }, function (res, err) {
                                    App.Directives.PepoplePickerCache[query.term] = res;
                                    for (var i = 0; i < res.length && i < 10; i++) {
                                        data.results.push({ id: res[i].id, text: res[i].name + (res[i].yearOfBirth ? ", " + res[i].yearOfBirth : "") });
                                    }
                                    query.callback(data);
                                });
                            }
                        }
                    }).on("change", function (e) {
                            $scope.person = e.val;
                            $scope.$apply();
                            console.log(e);
                            if ($scope.onChange) {
                                $scope.onChange({ val: e.val });
                            }
                        });
                }
            };
        }

        Directives.PeoplePicker = PeoplePicker;
    })(App.Directives || (App.Directives = {}));
    var Directives = App.Directives;
})(App || (App = {}));

App.registerDirective('PeoplePicker', []);
var App;
(function (App) {
    (function (Directives) {
        function ResultsByCategory($location) {
            return {
                templateUrl: 'templates/resultsByCategory.html',
                restrict: 'E',
                scope: {
                    "query": "=",
                    "onSearch": '&'
                },
                transclude: true,
                link: function ($scope, element, attrs) {
                    $scope.sortField = "-counts";
                    $scope.limit = 50;

                    $scope.openPerson = function (person) {
                        $location.path("person").search({ person: person });
                    };

                    $scope.more = function () {
                        $scope.limit += 50;
                    };

                    $scope.search = function () {
                        $scope.groups = [];
                        $scope.query = { category: $scope.category.toUpperCase() };
                        $scope.onSearch({ query: $scope.query });
                        queryData();
                    };

                    $scope.sort = function (field) {
                        $scope.sortField = $scope.sortField == "-" + field ? field : "-" + field;
                    };

                    queryData();

                    function queryData() {
                        if ($scope.query) {
                            var query = $scope.query;

                            $scope.loading = true;
                            $scope.category = query.category;

                            searchResults(query, $scope);
                        }
                    }
                }
            };
        }

        Directives.ResultsByCategory = ResultsByCategory;

        function searchResults(query, $scope) {
            query.$fields = { personId: 1, name: 1, yearOfBirth: 1, rank: 1 };

            dpd.results.get(query, function (res, err) {
                $scope.loading = false;
                if (err) {
                    $scope.$apply();
                    throw err;
                }

                console.log(new Date().getTime());

                var persons = _.reduce(res, function (merged, object, index) {
                    var index = object.personId;
                    merged[index] = merged[index] || {
                        name: object.name,
                        personId: object.personId,
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
    })(App.Directives || (App.Directives = {}));
    var Directives = App.Directives;
})(App || (App = {}));

App.registerDirective('ResultsByCategory', ["$location"]);
var App;
(function (App) {
    (function (Directives) {
        function ResultsByClub() {
            return {
                templateUrl: 'templates/resultsByClub.html',
                restrict: 'E',
                scope: {
                    "query": "=",
                    "onSearch": '&'
                },
                transclude: true,
                link: function ($scope, element, attrs) {
                    $scope.years = [];
                    for (var i = 1997; i <= (new Date()).getFullYear(); i++) {
                        $scope.years.push({ key: i, value: i });
                    }
                    $scope.years.push({ key: "all", value: "Alle" });
                    $scope.selectedYear = $scope.years[$scope.years.length - 2].key;

                    $scope.sortFieldEvent = [];
                    $scope.sortField = "data.date";

                    if ($scope.query) {
                        $scope.club = $scope.query.club;
                        if ($scope.query.selectedYear) {
                            $scope.selectedYear = $scope.query.selectedYear;
                        }
                        $scope.loading = true;
                        searchResults();
                    }

                    $scope.search = function () {
                        $scope.query = { club: $scope.club };
                        $scope.query.selectedYear = $scope.selectedYear;
                        $scope.onSearch({ query: $scope.query });
                        $scope.loading = true;
                        searchResults();
                    };

                    $scope.sort = function (field) {
                        $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
                    };

                    function searchResults() {
                        var query = { club: { "$regex": $scope.club, $options: 'i' }, date: null };

                        if ($scope.selectedYear != "all") {
                            query.date = {
                                $gte: new Date($scope.selectedYear, 0, 1).getTime(),
                                $lte: new Date($scope.selectedYear, 11, 31).getTime()
                            };
                        }
                        dpd.results.get(query, function (entries, error) {
                            $scope.loading = false;
                            console.log((new Date()).getTime());

                            entries = _.map(entries, function (result) {
                                if (result.event && result.event.date) {
                                    result.event.date = new Date(result.event.date);
                                }
                                return result;
                            });

                            console.log((new Date()).getTime());
                            $scope.events = groupResultyBy(entries, function (result) {
                                return result.eventId;
                            });

                            console.log((new Date()).getTime());
                            $scope.$apply();

                            console.log((new Date()).getTime());
                        });
                    }
                }
            };
        }

        Directives.ResultsByClub = ResultsByClub;

        function groupResultyBy(results, groupFunction) {
            var groupsObj = _.reduce(results, function (merged, object, index) {
                var index = groupFunction(object);
                merged[index] = merged[index] || {
                    title: index,
                    name: object.eventName,
                    date: object.date,
                    victories: 0,
                    counts: 0,
                    podiums: 0,
                    results: []
                };
                if (object.rank == 1)
                    merged[index].victories++;
                if (_.indexOf([1, 2, 3], object.rank, true) > -1)
                    merged[index].podiums++;
                merged[index].counts++;
                merged[index].results.push(object);
                return merged;
            }, {});

            var groups = [];
            for (var i in groupsObj) {
                groups.push({
                    title: i,
                    data: groupsObj[i],
                    isOpen: false
                });
            }
            return groups;
        }
    })(App.Directives || (App.Directives = {}));
    var Directives = App.Directives;
})(App || (App = {}));

App.registerDirective('ResultsByClub', []);
var App;
(function (App) {
    (function (Directives) {
        function ResultsTableByEventClub() {
            return {
                templateUrl: 'templates/resultsTableByEventClub.html',
                restrict: 'E',
                scope: {
                    "isOpen": "=",
                    "results": "="
                },
                transclude: true,
                link: function ($scope, element, attrs) {
                    $scope.sortEvent = function (field) {
                        $scope.sortFieldEvent = $scope.sortFieldEvent == field ? "-" + field : field;
                    };
                }
            };
        }

        Directives.ResultsTableByEventClub = ResultsTableByEventClub;
    })(App.Directives || (App.Directives = {}));
    var Directives = App.Directives;
})(App || (App = {}));

App.registerDirective('ResultsTableByEventClub', []);
var App;
(function (App) {
    (function (Directives) {
        function ResutsTableByPerson() {
            return {
                templateUrl: 'templates/resutsTableByPerson.html',
                restrict: 'E',
                scope: {
                    "results": "="
                },
                transclude: true,
                link: function ($scope, element, attrs) {
                    $scope.sortField = "date";

                    $scope.sort = function (field) {
                        $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
                    };
                }
            };
        }

        Directives.ResutsTableByPerson = ResutsTableByPerson;
    })(App.Directives || (App.Directives = {}));
    var Directives = App.Directives;
})(App || (App = {}));

App.registerDirective('ResutsTableByPerson', []);
App.registerTranslation('de', {
    INDEX_TITLE: 'Willkommen auf oevents',
    PERSON_PLACEHOLDER: 'Läufer suchen',
    CATEGORY_TITLE: 'Kategorie',
    ALL: 'Alle',
    BY_YEAR_RESULTS: 'Nach Jahr',
    PARTICIPATIONS_TITLE: 'Teilnahmen',
    PODIUMS_TITLE: 'Podeste',
    VICTORIES_TITLE: 'Siege',
    BY_CATEGORY_RESULTS: 'Nach Kategorie',
    DATE_TITLE: 'Datum',
    MAP_TITLE: 'Karte',
    RANK_TITLE: 'Rang',
    COMPETITION_TITLE: 'Wettkampf',
    RESULTS_MENU: 'Resultate',
    PERSON_MENU: 'Person',
    TAB_CATEGORY: 'Nach Kategorie',
    TAB_CLUB: 'Nach Verein',
    TAB_PERSON: 'Person suchen',
    SEARCH_PERSON: 'Person suchen',
    CLUB_PLACEHOLDER: 'Verein eingeben',
    LOADING: 'Daten laden...',
    OPTION_ALL: 'Alle',
    CATEGORY_PLACEHOLDER: "Kategorien eingeben",
    SEARCH: "Suchen",
    YOB_TITLE: "Jahrgang",
    NAME_TITLE: 'Name'
});
//# sourceMappingURL=file:////Users/yannisgu/Documents/Development/projects/oevents/public/js/app.js.map
