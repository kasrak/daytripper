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

    var routes = [];
    var route_ind = [];
    map.calcRoute = function(points) {
        var directionsService = new google.maps.DirectionsService();
        for (var i=0; i < (points.length-1); i++) {
            (function(origin, destination, idx) {
                Matrix.run([origin],[destination],function(response,status) {
                  var req = {
                    origin: origin,
                    destination: destination
                  };
                  if (response.rows[0].elements[0].distance.value > 1000) {
                        req.travelMode = google.maps.DirectionsTravelMode.DRIVING;
                  } else {
                        req.travelMode = google.maps.DirectionsTravelMode.WALKING;
                  }
                  directionsService.route(req,function(response,status) {
                        if (status != google.maps.DirectionsStatus.OK) {
                            console.log('ERR Route', status);
                        } else {
                            var renderer = new google.maps.DirectionsRenderer({suppressMarkers:true, preserveViewport:true});
                            renderer.setMap(map.map);
                            renderer.setDirections(response);
                            routes.push(renderer);
                            route_ind.push(idx);
                        }
                    });
                });
            })(points[i], points[i+1], i);
        }
    };

    map.shouldUpdateBounds = true;
    map.highlight = function(route) {
        _.each(routes, function(leg,i) {
            if (route == route_ind[i]) {
                leg.setMap(map.map);
                map.map.fitBounds(leg.directions.routes[0].bounds);
                map.map.setZoom(map.map.getZoom()-1);
                leg.setPanel($('.col2 .directions')[0]);
            } else {
                leg.setMap(null);
                leg.setPanel(null);
            }
        });
    };

    map.unhighlight = function() {
        var bounds = new google.maps.LatLngBounds();
        _.each(routes,function(leg) {
            leg.setMap(map.map);
            bounds.union(leg.directions.routes[0].bounds);
        });
        map.map.fitBounds(bounds);
        map.map.setZoom(map.map.getZoom()-1);
    };

    var markers = [];
    $rootScope.$watch(function() {
        return Places.list;
    }, function(newVal, oldVal) {
        if (newVal == oldVal) return;

        _.each(markers, function(marker) {
            marker.setMap(null);
        });
        markers.length = 0;

        _.each(routes, function(route) {
            route.setMap(null);
        });
        routes.length = 0;

        route_ind.length = 0;

        var bounds = new google.maps.LatLngBounds();

        if (!Places.hotel) {
            return;
        }

        var hposition = new google.maps.LatLng(Places.hotel.geometry.location.lat,
                                              Places.hotel.geometry.location.lng);
        var points = [];
        points.push(hposition);

        markers.push(new google.maps.Marker({
            position: hposition,
            map: map.map,
            icon: '/img/pinh.png'
        }));

        _.each(newVal, function(place, i) {
            var position = new google.maps.LatLng(place.location.lat, place.location.lng);
            points.push(position);
            markers.push(new google.maps.Marker({
                position: position,
                map: map.map,
                icon: '/img/pin' + (i + 1) + '.png'
            }));
        });

        _.each(points,function(point) {
            bounds.extend(point);
        });
        points.push(hposition);
        map.calcRoute(points);

        if (map.shouldUpdateBounds) {
            map.shouldUpdateBounds = false;
            map.map.fitBounds(bounds);
            map.map.setZoom(map.map.getZoom()-1);
        }
    }, true);
    return map;
});
