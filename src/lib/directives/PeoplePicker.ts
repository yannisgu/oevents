module App.Directives {
    export var PepoplePickerCache = {};

    export function PeoplePicker() {
        return{
        templateUrl : 'templates/peoplePicker.html',
        restrict : 'E',
        scope : {
            "onChange": '&',
            "person": '=',
            "placeholder": '='
        },
        transclude : true,

        link: function($scope, element:JQuery, attrs) {

            $scope.$watch('person', function(oldValue, newValue) {
                if(element.find(".people-picker").val() != $scope.person){
                    if($scope.person) {
                        dpd.people.get($scope.person, function(res, err){
                            console.log(res)
                            if(res){
                                element.find(".people-picker").select2('data', { id: res.id, text: res.name + (res.yearOfBirth ?  ", " + res.yearOfBirth : "") });

                            }
                        })
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
                    for(var i = 0; i < terms.length; i++){
                        queries.push({name: {"$regex": terms[i], $options: 'i'}})
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
                                data.results.push({id: value.id, text: value.name + (value.yearOfBirth ? ", " + value.yearOfBirth : "")});

                            }
                        }
                        query.callback(data);
                    }
                    else {
                        dpd.people.get({"$and": queries}, function (res, err) {
                            App.Directives.PepoplePickerCache[query.term] = res;
                            for (var i = 0; i < res.length && i < 10; i++) {
                                data.results.push({id: res[i].id, text: res[i].name + (res[i].yearOfBirth ? ", " + res[i].yearOfBirth : "")});
                            }
                            query.callback(data);
                        })

                    }


                }
            })
            .on("change", function(e) {
                    $scope.person= e.val;
                    $scope.$apply();
                    console.log(e)
                    if($scope.onChange){
                        $scope.onChange({val: e.val});
                    }
            });

        }
    }
    }
}


App.registerDirective('PeoplePicker', []);
