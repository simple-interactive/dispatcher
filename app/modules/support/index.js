modules.support = function(){

    this.init = function () {

        self.view.render('support/view/index', {}, function(tpl){
            $('body').prepend(tpl);

            $('[data-support]').modal().on('hidden.bs.modal', function(){
                self.unload();
            });
        });
    };

    this.unload = function(){
        $(self.element).remove();
        $('[data-support]').remove();
        $('.modal-backdrop').remove();
    };

    var self = this;
};