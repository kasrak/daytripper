app.factory('Matrix', function() {
    var Matrix = function() {
    };

    Matrix.prototype.run = function(origins, destinations, callback) {
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: origins,
            destinations: destinations,
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
            }, function(response, status) {
                if (status != google.maps.DistanceMatrixStatus.OK) {
                    console.log('ERR Matrix', status);
                } else {
                    callback(response, status);
                }
            });
    };

    return new Matrix();
});
