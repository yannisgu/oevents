module App.Directives {

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
                    var queries = [];
                    for(var i = 0; i < terms.length; i++){
                        queries.push({name: {"$regex": terms[i], $options: 'i'}})
                    }

                    dpd.people.get({"$and": queries}, function(res, err){
                        var data = {
                            results: []
                        };
                        for(var i = 0; i < res.length && i < 10; i++){
                            console.log(res[i].id)
                            data.results.push({id: res[i].id, text: res[i].name + (res[i].yearOfBirth ?  ", " + res[i].yearOfBirth : "")});
                        }
                        query.callback(data);
                    })

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
