app.factory('Cities', function($rootScope) {
    var Cities = function() {
    };

    Cities.prototype.autocomplete = function(query) {
        var self = this;

        $.ajax('http://ws.geonames.org/searchJSON', {
            data: { name_startsWith: query, country: 'US' },
            success: function(data) {
                $rootScope.$apply(function() {
                    self.list = _.filter(data.geonames, function(city) {
                        return city.fclName.startsWith('city');
                    });
                });
            },
            error: function(jqXHR, textStatus, err) {
                console.log('ERR: Cities', textStatus, err);
            }
        });
    };

    return new Cities();
});
