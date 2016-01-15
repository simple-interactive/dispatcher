modules.layout = function(){

    this.init = function () {

        self.view.render('layout/view/index', {}, function(renderedHtml){
            $(self.element).html(renderedHtml);

            // module.load('device');
            module.load('order', {}, null, true);

            $(self.element).find('[data-menu] [data-href]').on('click', function(){
                module.unloadAll('layout');
                module.load($(this).data('href'), {}, null, true);
            });

        });
    };
    var self = this;

};