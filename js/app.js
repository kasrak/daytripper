window.app = angular.module('app', []);

app.controller('PlanForm', function($scope, Cities) {
    $scope.cities = Cities;
    $scope.city = null;

    $scope.$watch('city', function(newVal, oldVal) {
        if (newVal == oldVal) return;

        var city = newVal.trim();

        if (city.length <= 3) return;

        Cities.autocomplete(city);
    });
});

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
    };
}

$(function() {
    $('input.city').focus();
});
