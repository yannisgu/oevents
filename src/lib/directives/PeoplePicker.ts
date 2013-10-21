module App.Directives {

    export class PeoplePicker {
        templateUrl = 'templates/PeoplePicker.html';
        restrict = 'E';
        scope = {
        };
        transclude = true;

        link($scope, element:JQuery, attrs:ng.IAttributes) {

        }
    }

}


App.registerDirective('PeoplePicker', []);
