angular.module('templates-main', ['templates/index.html', 'templates/results.html']);

angular.module("templates/index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/index.html",
    "<div>\n" +
    "    <h1>Welcome to oevents</h1>\n" +
    "</div>");
}]);

angular.module("templates/results.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/results.html",
    "<div class=\"template-results\">\n" +
    "\n" +
    "    <tabset>\n" +
    "        <tab heading=\"By Person\">\n" +
    "            <div ng-controller=\"ResultsByPersonCtrl\">\n" +
    "                <form class=\"form-inline\" role=\"form\" ng-submit=\"search()\">\n" +
    "                   <!-- <div class=\"form-group\">\n" +
    "                        <label class=\"sr-only\" for=\"inputName\">Name</label> -->\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"inputName\" placeholder=\"Enter name\" ng-model=\"name\" required>\n" +
    "                   <!-- </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"sr-only\" for=\"yearOfBirth\">Year of birth</label> -->\n" +
    "                        <input type=\"text\" class=\"form-control\" size=\"5\" id=\"yearOfBirth\" placeholder=\"Year of birth\" ng-model=\"yearOfBirth\" required pattern=\"([0-9]{2})?\\d\\d\" title=\"Enter valid year of birth\">\n" +
    "                   <!-- </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label class=\"checkbox\">-->\n" +
    "                            <input type=\"checkbox\" ng-model=\"groupByYear\">\n" +
    "                           Group by year\n" +
    "                        </label>\n" +
    "\n" +
    "                    <input type=\"text\" datepicker-popup=\"dd.MM.yyyy\" ng-model=\"fromDate\" placeholder=\"From\" pattern=\"\\d\\d\\.\\d\\d.(\\d\\d)?\\d\\d\"  title=\"Enter a valid date\" />\n" +
    "                    <input type=\"text\" datepicker-popup=\"dd.MM.yyyy\" ng-model=\"toDate\" placeholder=\"To\" pattern=\"\\d\\d\\.\\d\\d.(\\d\\d)?\\d\\d\" title=\"Enter a valid date\" />\n" +
    "                    <!--</div> -->\n" +
    "                    <button type=\"submit\" class=\"btn btn-default\">Search</button>\n" +
    "                </form>\n" +
    "\n" +
    "                <div class=\"results-list\">\n" +
    "                    <div ng-hide=\"loading\">\n" +
    "\n" +
    "                        <accordion close-others=\"false\">\n" +
    "                            <accordion-group heading=\"{{group.title}} ({{group.results.length}})\" ng-repeat=\"group in groups\" is-open=\"group.isOpen\">\n" +
    "                                <table class=\"table table-striped\">\n" +
    "                                    <tr>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('event.name')\">Competition</a></th>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('event.date')\">Date</a></th>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('event.map')\">Map</a></th>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('category')\">Category</a></th>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('rank')\">Rank</a></th>\n" +
    "                                    </tr>\n" +
    "\n" +
    "                                    <tr ng-repeat=\"result in group.results  | orderBy:sortField\">\n" +
    "                                        <td>\n" +
    "                                            <a href=\"{{result.event.urlSource}}\">\n" +
    "                                                {{result.event.name}}\n" +
    "                                    <span ng-hide=\"result.event.name\">\n" +
    "                                        {{result.event.urlSource}}\n" +
    "                                    </span>\n" +
    "                                            </a>\n" +
    "                                        </td>\n" +
    "                                        <td>{{result.event.date | date:'mediumDate'}}</td>\n" +
    "                                        <td>{{result.event.map}}</td>\n" +
    "                                        <td>{{result.category}}</td>\n" +
    "                                        <td>{{result.rank}}</td>\n" +
    "                                    </tr>\n" +
    "                                </table>\n" +
    "                            </accordion-group>\n" +
    "                        </accordion>\n" +
    "\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"loading\">\n" +
    "                        Loading data...\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </tab>\n" +
    "        <tab heading=\"By Category\">\n" +
    "            <div ng-controller=\"ResultsByCategoryCtrl\">\n" +
    "                <form class=\"form-inline\" role=\"form\" ng-submit=\"search()\">\n" +
    "                    <!-- <div class=\"form-group\">\n" +
    "                         <label class=\"sr-only\" for=\"inputName\">Name</label> -->\n" +
    "                    <input type=\"text\" class=\"form-control\" id=\"inputCategory\" placeholder=\"Enter category\" ng-model=\"category\" required>\n" +
    "                    <!-- </div>\n" +
    "                     <div class=\"form-group\">\n" +
    "                         <label class=\"sr-only\" for=\"yearOfBirth\">Year of birth</label> -->\n" +
    "\n" +
    "                    <!-- </div>\n" +
    "                     <div class=\"checkbox\">\n" +
    "                         <label class=\"checkbox\">-->\n" +
    "                    <input type=\"checkbox\" ng-model=\"groupByYear\">\n" +
    "                    Group by year\n" +
    "                    </label>\n" +
    "\n" +
    "                    <input type=\"text\" datepicker-popup=\"dd.MM.yyyy\" ng-model=\"fromDate\" placeholder=\"From\" pattern=\"\\d\\d\\.\\d\\d.(\\d\\d)?\\d\\d\"  title=\"Enter a valid date\" />\n" +
    "                    <input type=\"text\" datepicker-popup=\"dd.MM.yyyy\" ng-model=\"toDate\" placeholder=\"To\" pattern=\"\\d\\d\\.\\d\\d.(\\d\\d)?\\d\\d\" title=\"Enter a valid date\" />\n" +
    "                    <!--</div> -->\n" +
    "                    <button type=\"submit\" class=\"btn btn-default\">Search</button>\n" +
    "                </form>\n" +
    "\n" +
    "                <div class=\"results-list\">\n" +
    "                    <div ng-hide=\"loading\">\n" +
    "\n" +
    "                        <accordion close-others=\"false\">\n" +
    "                            <accordion-group heading=\"{{group.title}} ({{group.persons.length}})\" ng-repeat=\"group in groups\" is-open=\"group.isOpen\">\n" +
    "                                <table class=\"table table-striped\">\n" +
    "                                    <tr>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('name')\">Name</a></th>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('yearOfBirth')\">Year of birth</a></th>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('victories')\">Victories</a></th>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('podiums')\">Podiums</a></th>\n" +
    "                                        <th><a href=\"\" ng-click=\"sort('counts')\">Participations</a></th>\n" +
    "                                    </tr>\n" +
    "\n" +
    "                                    <tr ng-repeat=\"person in group.persons | orderBy:sortField\">\n" +
    "                                        <td>\n" +
    "                                            <a href=\"{{result.event.urlSource}}\">\n" +
    "                                                {{person.name}}\n" +
    "                                            </a>\n" +
    "                                        </td>\n" +
    "                                        <td>{{person.yearOfBirth}}</td>\n" +
    "                                        <td>{{person.victories}}</td>\n" +
    "                                        <td>{{person.podiums}}</td>\n" +
    "                                        <td>{{person.counts}}</td>\n" +
    "                                    </tr>\n" +
    "                                </table>\n" +
    "                            </accordion-group>\n" +
    "                        </accordion>\n" +
    "\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"loading\">\n" +
    "                        Loading data...\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "</div>");
}]);
