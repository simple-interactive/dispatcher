window.services.loader = function(){

    this.loaderTemplate = '<div class="loader"></div>';

    this.show = function(){
        if (!$('body>.loader').size()) {
            $('body').append(self.loaderTemplate);
        }
        $('body>.loader').animate('fadeIn');
    };

    this.hide = function(){

        $('body>.loader').animate('fadeOut');

        setTimeout("$('body>.loader').remove();", 500);
    };

    var self = this;

};