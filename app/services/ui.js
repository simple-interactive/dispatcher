window.services.ui = function(){

    this.init = function () {

        (function($) {

            $.fn.animate = function (type) {

                this.removeClass(type);
                var self = this;

                setTimeout(function () {
                    self.addClass('animated');
                    self.addClass(type);
                }, 1);
            };

        })(jQuery);
    };

    this.listen = function (selector, callback) {

        function processElement (element) {
            if (!$(element).data('processed')) {
                $(element).data('processed', true);
                callback(element);
            }
        }

        $(document).bind('DOMNodeInserted', function(e) {
            if ($(e.target).is(selector)) {
                processElement(e.target);
            }
            $(e.target).find(selector).each(function(){
                processElement(this);
            });
        });

        if ($(selector).size()) {
            processElement($(selector).get());
        }
    };

    var self = this;
};