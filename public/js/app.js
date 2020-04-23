//angular.module("app.services", []);
angular.module('app.controllers', []);
angular.module('app.directives', []);
angular.module('app', ["templates-main", "app.controllers", "app.directives", "ui.bootstrap", "pascalprecht.translate", 'pasvaz.bindonce']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/index', { templateUrl: 'templates/index.html', controller: "IndexCtrl" }).
            when('/results', { templateUrl: 'templates/results.html', controller: "ResultsCtrl", reloadOnSearch: false }).
            when('/person', { templateUrl: 'templates/person.html', controller: "PersonCtrl", reloadOnSearch: false }).
            otherwise({ redirectTo: '/index' });
    }]).config(['$translateProvider', function ($translateProvider) {
        var userlang = navigator.language || navigator.userLanguage;
        if (userlang && userlang.length > 1) {
            $translateProvider.preferredLanguage(userlang.substring(0, 2));
        }
        $translateProvider.fallbackLanguage("de");
    }]);
;
var App;
(function (App) {
    ;
    ;
    ;
    /*export function registerService (className: string, services = []) {
        var service = className[0].toLowerCase() + className.slice(1);
        services.push(() => new App.Services[className](arguments));
        angular.module('app.services').factory(service, services);
    }*/
    function registerController(className, services) {
        if (services === void 0) { services = []; }
        var controller = 'app.controllers.' + className;
        services.push(App.Controllers[className]);
        angular.module('app.controllers').controller(className, services);
    }
    App.registerController = registerController;
    /**
     * Register new directive.
     *
     * @param className
     * @param services
     */
    function registerDirective(className, services) {
        if (services === void 0) { services = []; }
        var directive = className[0].toLowerCase() + className.slice(1);
        services.push(App.Directives[className]);
        angular.module('app.directives').directive(directive, services);
    }
    App.registerDirective = registerDirective;
    function registerTranslation(language, strings) {
        angular.module('app').config(['$translateProvider', function ($translateProvider) {
                // deutsche Sprache
                $translateProvider.translations(language, strings);
            }]);
    }
    App.registerTranslation = registerTranslation;
})(App || (App = {}));
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var IndexCtrl = (function () {
            function IndexCtrl($scope) {
            }
            return IndexCtrl;
        })();
        Controllers.IndexCtrl = IndexCtrl;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
App.registerController("IndexCtrl", []);
var App;
(function (App) {
    var Controllers;
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
            var groupsObj = _.reduce(results, function (merged, object, index2) {
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
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
App.registerController("PersonCtrl", ["$scope", "$location"]);
var App;
(function (App) {
    var Controllers;
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
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
App.registerController("ResultsCtrl", ["$scope", "$location"]);
var App;
(function (App) {
    var Controllers;
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
                }
                else {
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
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
App.registerController("ResultsByPersonCtrl", ["$scope", "$location"]);
var App;
(function (App) {
    var Directives;
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
                            dpd.peoplesearch.get({ search: cleanupName(query.term) }, function (res, err) {
                                if (res.results) {
                                    for (var i = 0; i < res.results.length && i < 10; i++) {
                                        var obj = res.results[i].obj;
                                        data.results.push({ id: obj._id, text: obj.name + (obj.yearOfBirth ? ", " + obj.yearOfBirth : "") });
                                        query.callback(data);
                                    }
                                }
                            });
                        }
                    })
                        .on("change", function (e) {
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
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
function cleanupName(name) {
    name = name.toLowerCase();
    var diacriticsMap = [
        { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
        { 'base': 'aa', 'letters': /[\uA733]/g },
        { 'base': 'a', 'letters': /[\u00E4\u00E6\u01FD\u01E3]/g },
        { 'base': 'ao', 'letters': /[\uA735]/g },
        { 'base': 'au', 'letters': /[\uA737]/g },
        { 'base': 'av', 'letters': /[\uA739\uA73B]/g },
        { 'base': 'ay', 'letters': /[\uA73D]/g },
        { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
        { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
        { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
        { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g },
        { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
        { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
        { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
        { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
        { 'base': 'hv', 'letters': /[\u0195]/g },
        { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
        { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
        { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
        { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
        { 'base': 'lj', 'letters': /[\u01C9]/g },
        { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
        { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
        { 'base': 'nj', 'letters': /[\u01CC]/g },
        { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
        { 'base': 'o', 'letters': /[\u00F6\u0153]/g },
        { 'base': 'oi', 'letters': /[\u01A3]/g },
        { 'base': 'ou', 'letters': /[\u0223]/g },
        { 'base': 'oo', 'letters': /[\uA74F]/g },
        { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
        { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
        { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
        { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
        { 'base': 'ss', 'letters': /[\u00DF]/g },
        { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
        { 'base': 'tz', 'letters': /[\uA729]/g },
        { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
        { 'base': 'u', 'letters': /[\u00FC]/g },
        { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
        { 'base': 'vy', 'letters': /[\uA761]/g },
        { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
        { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
        { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
        { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
    ];
    for (var i = 0; i < diacriticsMap.length; i++) {
        name = name.replace(diacriticsMap[i].letters, diacriticsMap[i].base);
    }
    name.replace('ae', 'a');
    name.replace('ue', 'u');
    name.replace('oe', 'o');
    return name;
}
App.registerDirective('PeoplePicker', []);
var App;
(function (App) {
    var Directives;
    (function (Directives) {
        // db.results.group({key: {personId: 1},cond: {category: "D14"},reduce:  function(curr, res){res.count++; res.name =  curr; return res; } ,initial: {count: 0}})
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
                var persons = _.reduce(res, function (merged, object, index2) {
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
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
App.registerDirective('ResultsByCategory', ["$location"]);
var App;
(function (App) {
    var Directives;
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
                            console.log((new Date).getTime());
                            entries = _.map(entries, function (result) {
                                if (result.event && result.event.date) {
                                    result.event.date = new Date(result.event.date);
                                }
                                return result;
                            });
                            console.log((new Date).getTime());
                            $scope.events = groupResultyBy(entries, function (result) {
                                return result.eventId;
                            });
                            console.log((new Date).getTime());
                            $scope.$apply();
                            console.log((new Date).getTime());
                        });
                    }
                }
            };
        }
        Directives.ResultsByClub = ResultsByClub;
        function groupResultyBy(results, groupFunction) {
            var groupsObj = _.reduce(results, function (merged, object, index2) {
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
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
App.registerDirective('ResultsByClub', []);
var App;
(function (App) {
    var Directives;
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
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
App.registerDirective('ResultsTableByEventClub', []);
var App;
(function (App) {
    var Directives;
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
    })(Directives = App.Directives || (App.Directives = {}));
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
/*App.registerTranslation( 'en', {
    APP_HEADLINE:  'Great english text',
    NAV_HOME:      'Zur Startseite',
    NAV_ABOUT:     'Über',
    APP_TEXT:      'Irgendein Text über eine großartige AngularJS App.'
});*/ 
