app.factory('Places', function($rootScope, Foursquare, Progress) {
    var $places;

    $(function() {
        $places = $('.screen-places');
    });


    var Places = function() {
        this.list = [];
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
    };

    Places.prototype.hide = function() {
        $places.removeClass('show');
    };

    return new Places();
});
