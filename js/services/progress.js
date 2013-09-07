app.factory('Progress', function() {
    var progress = {};
    progress.current = 0;
    progress.set = function(val) {
        progress.current = val;
        progress.element.css('width', (val*100) + '%');

        if (progress.isDone() && progress.onDone) {
            progress.onDone();
        }
    };
    progress.reset = function() {
        progress.set(0);
    };
    progress.increment = function(val) {
        progress.set(progress.current + val);
    };
    progress.isDone = function() {
        return progress.current >= 1;
    };

    $(function() {
        progress.element = $('.loading .progress');
    });

    return progress;
});
