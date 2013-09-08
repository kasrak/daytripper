"use strict";
/*global window: false */
/*global angular: false */
/*global app: false */
/*global $: false */
/*global console: false */
/*jshint globalstrict: true */

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

app.controller('PlanFormController', function($scope, $element, Addresses, Map, Places, Progress) {
    $scope.addresses = Addresses;
    $scope.addressInput = null;

    $scope.loading = false;
    $scope.places = Places;

    var shouldAutocomplete = true;

    $scope.$watch('addressInput', function(newVal, oldVal) {
        if (newVal == oldVal || newVal.trim().length <= 3) return;
        if (!shouldAutocomplete) {
            shouldAutocomplete = true;
            return;
        }
        Addresses.autocomplete(newVal);
    });

    $scope.setAddress = function(address, startImmediately) {
        shouldAutocomplete = false;
        Addresses.clear();
        $scope.places.hotel = address;
        $scope.addressInput = address.formatted_address;
        Map.setCenter(address.geometry.location.lat, address.geometry.location.lng, 14);

        if (startImmediately) {
            $scope.startPlanning();
        }
    };

    $scope.startPlanning = function() {
        $scope.loading = true;

        Progress.reset();
        Places.show();
        Places.load($scope.places.hotel.geometry.location.lat,
                   $scope.places.hotel.geometry.location.lng);

        Progress.onDone = function() {
            window.setTimeout(function() {
                $($element).hide();
            }, 700);
        };
    };

    $(function() {

        $('input.address').on('click', function() {
            this.select();
        }).on('keydown', function(e) {
            $scope.$apply(function() {
                if (e.keyCode == 40) { // down
                    Addresses.down();
                } else if (e.keyCode == 38) { // up
                    Addresses.up();
                } else if (e.keyCode == 13) { // enter
                    if (!Addresses.selected) {
                        Addresses.down();
                    }

                    if (Addresses.selected) {
                        $scope.setAddress(Addresses.selected, true);
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
                    if ($scope.places.hotel === null) {
                        $scope.setAddress(data.results[0]);
                    }
                });
            });
        }, function(error) {
            console.log('Geolocation error', error);
        });
    });
});

app.controller('PlacesController', function($scope, Places) {
    $scope.places = Places;

    $scope.resetPlaces = function() {
        console.log('reset');
    };

    $scope.refreshPlaces = function() {
        console.log('refresh');
    };

    $scope.removePlace = function(place) {
        console.log('remove', place);
    };

    $scope.placeInfo = function(place) {
        console.log('info', place);
    };
});

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
    };
}
