app.factory('Addresses', function($rootScope) {
    var Addresses = function() {
        this.clear();
    };

    Addresses.prototype.clear = function() {
        this.list = [];
        this.selected = null;
        this.selectedIdx = -1;
    };

    Addresses.prototype.up = function() {
        if (this.list.length === 0) return;
        this.selectedIdx--;
        if (this.selectedIdx < 0) {
            this.selectedIdx = this.list.length - 1;
        }
        this.selected = this.list[this.selectedIdx];
    };

    Addresses.prototype.down = function() {
        if (this.list.length === 0) return;
        if (this.selectedIdx == -1) {
            this.selectedIdx = 0;
        } else {
            this.selectedIdx++;
            if (this.selectedIdx >= this.list.length) {
                this.selectedIdx = 0;
            }
        }
        this.selected = this.list[this.selectedIdx];
    };

    Addresses.prototype.autocomplete = _.debounce(function(query) {
        var self = this;

        $.ajax('http://maps.googleapis.com/maps/api/geocode/json', {
            data: { address: query, sensor: false },
            success: function(data) {
                if (data.status == 'OK') {
                    $rootScope.$apply(function() {
                        self.list = data.results;
                    });
                } else if (data.status == 'ZERO_RESULTS') {
                    self.list = [];
                } else {
                    console.log('ERR: Addresses. data = ', data);
                }
            },
            error: function(jqXHR, textStatus, err) {
                console.log('ERR: Addresses', textStatus, err);
            }
        });
    }, 500);

    return new Addresses();
});
