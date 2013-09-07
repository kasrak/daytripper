app.factory('Places', function() {
    var $places;

    $(function() {
        $places = $('.screen-places');
    });


    var Places = function() {
    };

    Places.prototype.show = function() {
        $places.addClass('show');
    };

    Places.prototype.hide = function() {
        $places.removeClass('show');
    };

    return new Places();
});
