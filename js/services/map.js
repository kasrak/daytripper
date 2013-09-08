app.factory('Map', function($rootScope, Matrix, Places) {
    var map = {};
    var $mapbox;
    var styles = [
        {
        "stylers": [
            { "visibility": "on" },
            { "saturation": -80 },
            { "lightness": -51 },
            { "gamma": 0.96 }
        ]
    },{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            { "lightness": -59 }
        ]
    },{
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            { "saturation": -100 },
            { "lightness": 2 }
        ]
    },{
        "featureType": "administrative",
        "stylers": [
            { "invert_lightness": true }
        ]
    },{
        "featureType": "landscape",
        "stylers": [
            { "invert_lightness": true },
            { "saturation": -100 },
            { "visibility": "off" }
        ]
    },{
        "featureType": "poi",
        "stylers": [
            { "visibility": "off" }
        ]
    },{
        "featureType": "landscape",
        "stylers": [
            { "visibility": "on" }
        ]
    },{
        "featureType": "road.highway",
        "stylers": [
            { "invert_lightness": true }
        ]
    },{
        "featureType": "road.local",
        "stylers": [
            { "invert_lightness": true },
            { "saturation": -100 },
            { "gamma": 0.9 }
        ]
    },{
        "featureType": "road.arterial",
        "elementType": "labels.text",
        "stylers": [
            { "invert_lightness": true }
        ]
    },{
        "featureType": "administrative.land_parcel",
        "stylers": [
            { "visibility": "off" }
        ]
    },{
        "featureType": "administrative.neighborhood",
        "stylers": [
            { "visibility": "off" }
        ]
    },{
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            { "invert_lightness": true }
        ]
    },{
    }
    ];
    var styledMap = new google.maps.StyledMapType(styles, { name: 'Styled Map' });
    var options = {
        center: new google.maps.LatLng(35, 0),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        },
        panControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_TOP
        }
    };


    $(function() {
        $mapbox = $('#mapbox');
        map.map = new google.maps.Map($mapbox.find('.map')[0], options);
        map.map.mapTypes.set('map_style', styledMap);
        map.map.setMapTypeId('map_style');
    });

    map.setCenter = function(lat, lng, zoom) {
        map.map.setCenter(new google.maps.LatLng(lat, lng));
        map.map.setZoom(zoom || 12);
    };

    map.calcRoute = function(points) {
        var directionsService = new google.maps.DirectionsService();
        var directions = [];
        for (var i=0; i < (points.length-1); i++) {
            var origin = points[i];
            var destination = points[(i+1)];
            var request = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.DirectionsTravelMode.WALKING
            };
            Matrix.run([origin],[destination],function(response,status) {
                if (response.rows[0].elements[0].distance.value > 1000) {
                    request["travelMode"] = google.maps.DirectionsTravelMode.DRIVING;
                }
                directionsService.route(request, function(response,status) {
                    if (status != google.maps.DirectionsStatus.OK) {
                        console.log('ERR Route', status);
                    } else {
                        directions[i] = new google.maps.DirectionsRenderer
                            ({suppressMarkers:true});
                        directions[i].setMap(map.map);
                        directions[i].setDirections(response);
                    }
                });
            });debugger;
        }
    };

    $rootScope.$watch(function() {
        return Places.list;
    }, function(newVal, oldVal) {
        if (newVal == oldVal) return;

        var bounds = new google.maps.LatLngBounds();

        var hposition = new google.maps.LatLng(Places.hotel.geometry.location.lat,
                                              Places.hotel.geometry.location.lng);
        var points = [];
        points.push(hposition);

        new google.maps.Marker({
            position: hposition,
            map: map.map,
            icon: '/img/pinh.png'
        });
        bounds.extend(hposition);

        var markers = _.map(newVal, function(place, i) {
            var position = new google.maps.LatLng(place.location.lat, place.location.lng);
            points.push(position);
            new google.maps.Marker({
                position: position,
                map: map.map,
                icon: '/img/pin' + (i + 1) + '.png'
            });
            bounds.extend(position);
        });
        points.push(hposition);
        map.calcRoute(points);
        map.map.fitBounds(bounds);
    });
    return map;
});
