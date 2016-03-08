modules.layout = function(){

    this.settings = {};

    this.init = function () {

        self.view.render('layout/view/index', {}, function(renderedHtml){
            $(self.element).html(renderedHtml);

            // module.load('device');
            module.load('order', {}, null, true);

            $(self.element).find('[data-menu] [data-href]').on('click', function(){
                module.unloadAll('layout');
                module.load($(this).data('href'), {}, null, true);
            });

            $(self.element).find('[data-settings-menu] [data-action]').on('click', function(){
                self.settings[$(this).data('action')]();
            });
        });
    };

    this.settings.logout = function(){
        services.user.forget();
    };

    this.settings.support = function(){
        module.load('support');
    };

    var self = this;

};