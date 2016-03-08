modules.auth = function(){

    this.init = function () {

        $('body').addClass('auth');

        self.view.render('auth/view/index', {}, function(renderedHtml){

            $(self.element).html(renderedHtml);

            $(self.element).find('form').submit(function(){

                var form = this;

                services.api.login($(form).serialize(), function(reponse){

                    if (reponse.success) {

                        $('body').removeClass('auth');
                        services.user.save(reponse.user);

                        module.unloadAll();
                        module.load('layout');
                    }
                    else {
                        $(self.element).find('[data-error] .alert').html(services.locale.translate('sign-in-error'));
                        $(self.element).find('[data-error]').fadeIn();
                    }
                });

                return false;
            });

            $(self.element).find('[data-action-support]').on('click', function(){
                module.load('support');
            });
        });
    };

    var self = this;

};