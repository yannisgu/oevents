module App.Directives {

    export function ResultsByClub() {
        return {
        templateUrl : 'templates/resultsByClub.html',
        restrict : 'E',
        scope : {
            "query": "=",
            "onSearch": '&'
        },
        transclude : true,

        link: function($scope, element:JQuery, attrs:ng.IAttributes) {

            $scope.years = [];
            for(var i = 1997; i <2014; i++) {
                $scope.years.push(i);
            }
            $scope.selectedYear = $scope.years[$scope.years.length - 1];

            $scope.sortFieldEvent =[];
            $scope.sortField = "data.date";

            if($scope.query){
                $scope.club = $scope.query.club;
                if($scope.query.selectedYear){
                    $scope.selectedYear = $scope.query.selectedYear;
                }
                searchResults();
            }

            $scope.search = function() {
                $scope.query = {club: $scope.club, selectedYear: $scope.selectedYear};
                $scope.onSearch({query: $scope.query});
                searchResults();
            }

            $scope.sort = function(field) {
                $scope.sortField = $scope.sortField == field ? "-" + $scope.sortField : field;
            }


            function searchResults() {
                var query = $scope.query;
                query.date = {
                    $gte: new Date($scope.selectedYear, 0, 1).getTime(),
                    $lte: new Date($scope.selectedYear, 11, 31).getTime()
                }

                dpd.results.get($scope.query, function(entries, error){
                    console.log((new Date).getTime())

                    entries = _.map(entries, function (result) {
                        if (result.event && result.event.date) {
                            result.event.date = new Date(result.event.date);
                        }
                        return result;
                    });

                    console.log((new Date).getTime())
                    $scope.events = groupResultyBy(entries, function (result) {
                        return result.eventId;
                    })


                    console.log((new Date).getTime())
                    $scope.$apply();

                    console.log((new Date).getTime())
                })
            }

        }
    }
    }
    function groupResultyBy(results, groupFunction){
        var groupsObj = _.reduce(results, function (merged, object, index) {
            var index = groupFunction(object)
            merged[index] = merged[index] || {
                title: index,
                name: object.eventName,
                date: object.date,
                victories: 0,
                counts: 0,
                podiums: 0,
                results: []

            }
            if (object.rank == 1) merged[index].victories++;
            if (_.indexOf([1, 2, 3], object.rank, true) > -1) merged[index].podiums++;
            merged[index].counts++;
            merged[index].results.push(object)
            return merged;
        }, {});

        var groups = [];
        for (var i in groupsObj) {
            groups.push({
                title: i,
                data: groupsObj[i],
                isOpen: false
            })
        }
        return groups;
    }

}


App.registerDirective('ResultsByClub', []);
