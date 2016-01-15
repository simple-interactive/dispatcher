modules.deviceManage = function(){

    this.device = {
        name: services.locale.translate('table-temp-name'),
        token: $.md5(new Date().toString()).substr(27, 5)
    };

    this.init = function(){

        if (self.params.id) {
            services.api.getDevice(self.params.id, function(data){
                self.device = data.table;
                self.dialog();
            })
        }
        else {
            self.dialog();
        }
    };

    this.dialog = function () {

        self.view.render('device/view/manage', {device: self.device}, function(tpl){

            $('body').prepend(tpl);

            modal = $('[data-device-manage]');

            modal.modal().on('hidden.bs.modal', function(){
                self.unload();
            });

            modal.find('input').on('change', function(){
                self.device[$(this).data('target')] = $(this).val();
            });

            modal.find('[data-save]').on('click', function(){

                modal.find('[data-error]').hide().text('');
                modal.find('input').attr('disabled', 'disabled');
                modal.find('.btn').attr('disabled', 'disabled');

                services.api.manageDevice(self.device,
                    function(){
                        if (self.params.callback) {
                            self.params.callback();
                        }
                        $('[data-device-manage]').modal('hide');
                    },
                    function(err){
                        modal.find('[data-error]').show().text(services.locale.translate(err.message));
                        modal.find('input').removeAttr('disabled');
                        modal.find('.btn').removeAttr('disabled');
                    }
                );
            });
        });
    };

    this.unload = function(){

        delete self.device;

        $('[data-device-manage]').remove();
        $('.modal-backdrop').remove();
        $(self.element).remove();
    };


    var self = this;
};