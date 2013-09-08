app.factory('Places', function($rootScope, Foursquare, Progress) {
    var $places;
    var $mapbox;

    $(function() {
        $places = $('.screen-places');
        $mapbox = $('#mapbox');
    });


    var Places = function() {
        this.list = [];
        this.hotel = null;
    };

    Places.prototype.load = function(lat, lng) {
        var self = this;
        Foursquare.getRoute([lat, lng],
        function() {
            $rootScope.$apply(function() {
                self.list = Foursquare.route;
            });
        },
        function(progress) {
            Progress.set(progress);
        });
    };

    Places.prototype.show = function() {
        $places.addClass('show');
        $mapbox.css('left', '400px');
    };

    Places.prototype.hide = function() {
        $places.removeClass('show');
        $mapbox.css('left', '0px');
    };

    return new Places();
});
