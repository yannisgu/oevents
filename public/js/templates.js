angular.module('templates-main', ['templates/index.html', 'templates/peoplePicker.html', 'templates/person.html', 'templates/results.html', 'templates/resultsByCategory.html', 'templates/resultsByClub.html', 'templates/resultsTableByEventClub.html', 'templates/resutsTableByPerson.html']);

angular.module("templates/index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/index.html",
    "\n" +
    "\n" +
    "<div>\n" +
    "    <h1>{{'INDEX_TITLE' | translate }}</h1>\n" +
    "    <p>\n" +
    "        oevents ist eine offene Platform für OL-Wettkämpfe und Resultate.\n" +
    "    </p>\n" +
    "</div>");
}]);

angular.module("templates/peoplePicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/peoplePicker.html",
    "\n" +
    "\n" +
    "<input type=\"hidden\" class=\"people-picker\" style=\"width: 300px;\"  />");
}]);

angular.module("templates/person.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/person.html",
    "<div class=\"people-picker-container\">\n" +
    "    <people-picker on-change=\"personChanged(val)\" person=\"personId\" placeholder=\"'PERSON_PLACEHOLDER' | translate\"></people-picker>\n" +
    "</div>\n" +
    "        <!--\n" +
    "<form class=\"form-inline\">\n" +
    "    <fieldset>\n" +
    "\n" +
    "        <input style=\"width: 100px\" type=\"text\" datepicker-popup=\"dd.MM.yyyy\" ng-model=\"fromDate\" placeholder=\"From\" pattern=\"\\d\\d\\.\\d\\d.(\\d\\d)?\\d\\d\"  title=\"Enter a valid date\" />\n" +
    "        <input style=\"width: 100px\" type=\"text\" datepicker-popup=\"dd.MM.yyyy\" ng-model=\"toDate\" placeholder=\"To\" pattern=\"\\d\\d\\.\\d\\d.(\\d\\d)?\\d\\d\" title=\"Enter a valid date\" />\n" +
    "\n" +
    "        <button type=\"submit\" class=\"btn btn-default\">Search</button>\n" +
    "\n" +
    "\n" +
    "    </fieldset>\n" +
    "</form>-->\n" +
    "\n" +
    "<div ng-show=\"!loading\">\n" +
    "        <tabset >\n" +
    "            <tab heading=\"{{'ALL' | translate}} ({{results.length}})\">\n" +
    "            <resuts-table-by-person results=\"results\"></resuts-table-by-person>\n" +
    "\n" +
    "            </tab>\n" +
    "            <tab heading=\"{{'BY_YEAR_RESULTS' | translate}}\">\n" +
    "\n" +
    "                <table class=\"table\">\n" +
    "                    <tr class=\"odd\">\n" +
    "                        <th><a ng-click=\"sortYear('title')\">{{'CATEGORY_TITLE' | translate}}</a></th>\n" +
    "                        <th><a ng-click=\"sortYear('data.results.length')\">{{'PARTICIPATIONS_TITLE' | translate}}</a></th>\n" +
    "                        <th><a ng-click=\"sortYear('data.podiums')\">{{'PODIUMS_TITLE' | translate}}</a></th>\n" +
    "                        <th><a ng-click=\"sortYear('data.victories')\">{{'VICTORIES_TITLE' | translate}}</a></th>\n" +
    "                    </tr>\n" +
    "                    <tbody ng-repeat=\"group in yearGroups | orderBy:sortFieldYear\">\n" +
    "                    <tr  ng-click=\"group.isOpen = !group.isOpen\" ng-class=\"['even', 'odd'][$index %2]\">\n" +
    "                        <td>\n" +
    "                            <a> {{group.title}}</a>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            {{group.data.results.length}}\n" +
    "\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            {{group.data.podiums}}\n" +
    "\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            {{group.data.victories}}\n" +
    "\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <tr class=\"no-style-row\">\n" +
    "                        <td colspan=\"4\">\n" +
    "                            <div collapse=\"group.isOpen\">\n" +
    "                                <resuts-table-by-person results=\"group.data.results\"></resuts-table-by-person>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    </tbody>\n" +
    "\n" +
    "                </table>\n" +
    "            </tab>\n" +
    "            <tab heading=\"{{'BY_CATEGORY_RESULTS' | translate}}\">\n" +
    "\n" +
    "                <table class=\"table\">\n" +
    "                    <tr class=\"odd\">\n" +
    "                        <th><a ng-click=\"sortCategory('title')\">{{'CATEGORY_TITLE' | translate}}</a></th>\n" +
    "                        <th><a ng-click=\"sortCategory('data.results.length')\">{{'PARTICIPATIONS_TITLE' | translate}}</a></th>\n" +
    "                        <th><a ng-click=\"sortCategory('data.podiums')\">{{'PODIUMS_TITLE' | translate}}</a></th>\n" +
    "                        <th><a ng-click=\"sortCategory('data.victories')\">{{'VICTORIES_TITLE' | translate}}</a></th>\n" +
    "                    </tr>\n" +
    "                    <tbody ng-repeat=\"group in categoryGroups | orderBy:sortFieldCategory\">\n" +
    "                        <tr  ng-click=\"group.isOpen = !group.isOpen\" ng-class=\"['even', 'odd'][$index %2]\">\n" +
    "                            <td>\n" +
    "                               <a> {{group.title}}</a>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                                {{group.data.results.length}}\n" +
    "\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                                {{group.data.podiums}}\n" +
    "\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                                {{group.data.victories}}\n" +
    "\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr class=\"no-style-row\">\n" +
    "                            <td colspan=\"4\">\n" +
    "                                <div collapse=\"group.isOpen\">\n" +
    "                                    <resuts-table-by-person results=\"group.data.results\"></resuts-table-by-person>\n" +
    "                                </div>\n" +
    "\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "\n" +
    "                </table>\n" +
    "\n" +
    "            </tab>\n" +
    "        </tabset>\n" +
    "</div>\n" +
    "<div ng-show=\"loading\">\n" +
    "    {{'LOADING' | translate }}\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("templates/results.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/results.html",
    "<div class=\"template-results\">\n" +
    "\n" +
    "    <tabset>\n" +
    "        <tab heading=\"{{'TAB_CATEGORY' | translate}}\" active=\"tabCategoryOpen\">\n" +
    "            <results-by-category on-search=\"onCategorySearch(query)\" query=\"categoryQuery\"></results-by-category>\n" +
    "\n" +
    "\n" +
    "        </tab>\n" +
    "        <tab heading=\"{{'TAB_CLUB' | translate}}\" active=\"tabClubOpen\">\n" +
    "            <results-by-club on-search=\"onClubSearch(query)\" query=\"queryClub\"></results-by-club>\n" +
    "        </tab>\n" +
    "\n" +
    "        <tab heading=\"{{'TAB_PERSON' | translate}}\" active=\"tabPersonOpen\">\n" +
    "            <form class=\"form-inline\" role=\"form\" ng-submit=\"searchPerson()\">\n" +
    "                <people-picker person=\"person\"></people-picker>\n" +
    "                <button type=\"submit\" class=\"btn btn-default\">{{'SEARCH_PERSON' | translate}}</button>\n" +
    "            </form>\n" +
    "\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/resultsByCategory.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/resultsByCategory.html",
    "<div>\n" +
    "    <form class=\"form-inline\" role=\"form\" ng-submit=\"search()\">\n" +
    "        <!-- <div class=\"form-group\">\n" +
    "             <label class=\"sr-only\" for=\"inputName\">Name</label> -->\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"inputCategory\" placeholder=\"{{'CATEGORY_PLACEHOLDER' | translate}}\"\n" +
    "               ng-model=\"category\" required>\n" +
    "        <!-- </div>\n" +
    "         <div class=\"form-group\">\n" +
    "             <label class=\"sr-only\" for=\"yearOfBirth\">Year of birth</label> -->\n" +
    "\n" +
    "        <!-- </div>\n" +
    "         <div class=\"checkbox\">\n" +
    "             <label class=\"checkbox\">-->\n" +
    "\n" +
    "        <button type=\"submit\" class=\"btn btn-default\">{{'SEARCH' | translate}}</button>\n" +
    "    </form>\n" +
    "\n" +
    "    <div class=\"results-list\">\n" +
    "        <div ng-hide=\"loading || !persons\">\n" +
    "\n" +
    "            <accordion close-others=\"false\">\n" +
    "                <accordion-group heading=\"{{'ALL' | translate}} ({{persons.length}})\" is-open=\"true\">\n" +
    "                    <table class=\"table table-striped\">\n" +
    "                        <tr>\n" +
    "                            <th><a href=\"\" ng-click=\"sort('name')\">{{'NAME_TITLE' | translate}} </a></th>\n" +
    "                            <th><a href=\"\" ng-click=\"sort('yearOfBirth')\">{{'YOB_TITLE' | translate}}</a></th>\n" +
    "                            <th><a href=\"\" ng-click=\"sort('victories')\">{{'VICTORIES_TITLE' | translate}}</a></th>\n" +
    "                            <th><a href=\"\" ng-click=\"sort('podiums')\">{{'PODIUMS_TITLE' | translate}}</a></th>\n" +
    "                            <th><a href=\"\" ng-click=\"sort('counts')\">{{'PARTICIPATIONS_TITLE' | translate}}</a></th>\n" +
    "                        </tr>\n" +
    "\n" +
    "                        <tr ng-repeat=\"person in persons   | orderBy:sortField | limitTo:limit\">\n" +
    "                            <td>\n" +
    "                                <a ng-click=\"openPerson(person.personId)\">\n" +
    "                                    {{person.name}}\n" +
    "                                </a>\n" +
    "                            </td>\n" +
    "                            <td>{{person.yearOfBirth}}</td>\n" +
    "                            <td>{{person.victories}}</td>\n" +
    "                            <td>{{person.podiums}}</td>\n" +
    "                            <td>{{person.counts}}</td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                    <div ng-hide=\"persons.length < limit\">\n" +
    "                        <a class=\"btn btn-large btn-block\" ng-click=\"more()\">Mehr...</a>\n" +
    "                    </div>\n" +
    "                </accordion-group>\n" +
    "            </accordion>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "        <div ng-show=\"loading\">\n" +
    "            {{'LOADING' | translate }}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("templates/resultsByClub.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/resultsByClub.html",
    "<div>\n" +
    "    <form class=\"form-inline\" role=\"form\" ng-submit=\"search()\">\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"inputClub\" placeholder=\"{{'CLUB_PLACEHOLDER' | translate}}\" ng-model=\"club\" required>\n" +
    "        <select ng-model=\"selectedYear\" ng-options=\"year.key as year.value for year in years\">\n" +
    "        </select>\n" +
    "        <button type=\"submit\" class=\"btn btn-default\">Search</button>\n" +
    "    </form>\n" +
    "    <div ng-show=\"!loading && query != '' && events.length == 0\">Keine Resultate für \"{{query.club}}\" in der\n" +
    "        ausgewählten Zeitspanne\n" +
    "    </div>\n" +
    "    <div class=\"results-list\" ng-hide=\"loading || !events || events.length == 0\">\n" +
    "        <table class=\"table\">\n" +
    "                <tr class=\"odd\">\n" +
    "                    <th><a ng-click=\"sort('title')\">{{'COMPETITION_TITLE' | translate}}</a></th>\n" +
    "                    <th><a ng-click=\"sort('data.date')\">{{'DATE_TITLE' | translate}}</a></th>\n" +
    "                    <th><a ng-click=\"sort('data.counts')\">{{'PARTICIPATIONS_TITLE' | translate}}</a></th>\n" +
    "                    <th><a ng-click=\"sort('data.podiums')\">{{'PODIUMS_TITLE' | translate}}</a></th>\n" +
    "                    <th><a ng-click=\"sort('data.victories')\">{{'VICTORIES_TITLE' | translate}}</a></th>\n" +
    "                </tr>\n" +
    "                <tbody bindonce ng-repeat=\"group in events | orderBy:sortField\">\n" +
    "                <tr  ng-click=\"group.isOpen = !group.isOpen\" bo-class=\"['even', 'odd'][$index %2]\">\n" +
    "                    <td>\n" +
    "                        <a bo-html=\"group.data.name\"></a>\n" +
    "                    </td>\n" +
    "                    <td bo-html=\"group.data.date | date:'mediumDate'\">\n" +
    "                    </td>\n" +
    "                    <td bo-html=\"group.data.results.length\">\n" +
    "\n" +
    "                    </td>\n" +
    "                    <td bo-html=\"group.data.podiums\">\n" +
    "\n" +
    "\n" +
    "                    </td>\n" +
    "                    <td bo-html=\"group.data.victories\">\n" +
    "\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                <tr class=\"no-style-row\">\n" +
    "                    <td colspan=\"5\">\n" +
    "\n" +
    "                    <results-table-by-event-club  is-open=\"group.isOpen\" results=\"group.data.results\"></results-table-by-event-club>\n" +
    "\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "\n" +
    "            </table>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"loading\">\n" +
    "        {{'LOADING' | translate }}\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/resultsTableByEventClub.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/resultsTableByEventClub.html",
    "<div ng-show=\"isOpen\">\n" +
    "    <table binonce=\"results\" class=\"table table-striped\">\n" +
    "        <tr>\n" +
    "            <th><a href=\"\" ng-click=\"sortEvent('category' )\" bo-html=\"'CATEGORY_TITLE' | translate\"></a></th>\n" +
    "            <th><a href=\"\" ng-click=\"sortEvent('rank')\" bo-html=\"'RANK_TITLE' | translate\"></a></th>\n" +
    "            <th><a href=\"\" ng-click=\"sortEvent('name')\" bo-html=\"'NAME_TITLE' | translate\"></a></th>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr ng-repeat=\"result in results  | orderBy:sortFieldEvent\">\n" +
    "            <td>{{result.category}}</td>\n" +
    "            <td>{{result.rank}}</td>\n" +
    "            <td>{{result.name}}</td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/resutsTableByPerson.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/resutsTableByPerson.html",
    "<table class=\"table table-striped\">\n" +
    "    <tr>\n" +
    "        <th><a href=\"\" ng-click=\"sort('event.name')\">{{'COMPETITION_TITLE' | translate}}</a></th>\n" +
    "        <th><a href=\"\" ng-click=\"sort('event.date')\">{{'DATE_TITLE' | translate}}</a></th>\n" +
    "        <th><a href=\"\" ng-click=\"sort('event.map')\">{{'MAP_TITLE' | translate}}</a></th>\n" +
    "        <th><a href=\"\" ng-click=\"sort('category')\">{{'CATEGORY_TITLE' | translate}}</a></th>\n" +
    "        <th><a href=\"\" ng-click=\"sort('rank')\">{{'RANK_TITLE' | translate}}</a></th>\n" +
    "\n" +
    "    </tr>\n" +
    "\n" +
    "    <tr ng-repeat=\"result in results  | orderBy:sortField\">\n" +
    "        <td>\n" +
    "            <a href=\"{{result.event.url}}\">\n" +
    "                {{result.eventName}}\n" +
    "                <span ng-hide=\"result.event.name\">\n" +
    "                    {{result.event.url}}\n" +
    "                </span>\n" +
    "            </a>\n" +
    "        </td>\n" +
    "        <td>{{result.date | date:'mediumDate'}}</td>\n" +
    "        <td>{{result.event.map}}</td>\n" +
    "        <td>{{result.category}}</td>\n" +
    "        <td>{{result.rank}}</td>\n" +
    "    </tr>\n" +
    "</table>");
}]);
