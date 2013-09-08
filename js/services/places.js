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

    Places.prototype.clear = function() {
        this.list = [];
        this.hotel = null;
    };

    Places.prototype.load = function(lat, lng) {
        var self = this;
        Foursquare.getRoute([lat, lng],
        function() {
            $rootScope.$apply(function() {
                self.list = Foursquare.route;

                var breakfast = self.list[0],
                    lunch = self.list[2],
                    dinner = self.list[4],
                    category;

                if (breakfast) {
                    category = breakfast.categories[0];
                    if (category.name.toLowerCase().indexOf("breakfast") == -1) {
                        category.name = "Breakfast: " + category.name;
                    }
                }

                if (lunch) {
                    category = lunch.categories[0];
                    if (category.name.toLowerCase().indexOf("lunch") == -1) {
                        category.name = "Lunch: " + category.name;
                    }
                }

                if (dinner) {
                    category = dinner.categories[0];
                    if (category.name.toLowerCase().indexOf("dinner") == -1) {
                        category.name = "Dinner: " + category.name;
                    }
                }
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
