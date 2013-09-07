window.app = angular.module('app', []);

app.filter('addr_part', function() {
    return function(address, type) {
        if (!address) {
            return;
        }

        var comps = address.address_components, comp;

        for (var i = 0; i < comps.length; i++) {
            comp = comps[i];
            if (comp.types.indexOf(type) != -1) {
                return comp.long_name;
            }
        }
    };
});

app.controller('PlanForm', function($scope, Addresses, Map) {
    $scope.addresses = Addresses;
    $scope.addressInput = null;
    $scope.currentAddress = null;

    $scope.loading = false;

    var $progressBar;

    var shouldAutocomplete = true;

    $scope.$watch('addressInput', function(newVal, oldVal) {
        if (newVal == oldVal || newVal.trim().length <= 3) return;
        if (!shouldAutocomplete) {
            shouldAutocomplete = true;
            return;
        }
        Addresses.autocomplete(newVal);
    });

    $scope.setAddress = function(address) {
        shouldAutocomplete = false;
        Addresses.clear();
        $scope.currentAddress = address;
        $scope.addressInput = address.formatted_address;
        Map.setCenter(address.geometry.location.lat, address.geometry.location.lng, 14);
    };

    $scope.startPlanning = function() {
        $scope.loading = true;

        var progress = 5;
        var incrementProgress = function() {
            progress += 10;
            $progressBar.css('width', progress + '%');
            if (progress < 100) {
                window.setTimeout(incrementProgress, 500);
            }
        };
        window.setTimeout(incrementProgress, 500);
    };

    $(function() {
        $progressBar = $('.loading .progress');

        $('input.address').on('click', function() {
            this.select();
        }).on('keydown', function(e) {
            $scope.$apply(function() {
                if (e.keyCode == 40) { // down
                    Addresses.down();
                } else if (e.keyCode == 38) { // up
                    Addresses.up();
                } else if (e.keyCode == 13) { // enter
                    if (Addresses.selected) {
                        $scope.setAddress(Addresses.selected);
                    }
                }
            });
        })
        .focus();

        window.navigator.geolocation.getCurrentPosition(function(data) {
            var latitude = data.coords.latitude,
                longitude = data.coords.longitude;
            $.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true', function(data) {
                $scope.$apply(function() {
                    if ($scope.currentAddress === null) {
                        $scope.setAddress(data.results[0]);
                    }
                });
            });
        }, function(error) {
            console.log('Geolocation error', error);
        });
    });
});

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
    };
}
