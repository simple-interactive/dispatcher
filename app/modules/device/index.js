modules.device  = function(){

    this.tables = null;

    this.init = function(){
        self.loadTable();
    };

    this.loadTable = function() {

        self.tables = services.api.getDevices(function(data){

            self.view.render('device/view/index', {devices: data.tables}, function(tpl){

                $(self.element).html(tpl);


                $(self.element).find('[data-manage]').on('click', function(){
                    module.load('deviceManage', {
                        id: $(this).data('id'),
                        callback: self.loadTable
                    });
                });




                $(self.element).find('[data-remove]').on('click', function(){

                    var deviceId = $(this).data('id');

                    view.plugins.dialog(
                        services.locale.translate('confirm-action'),
                        services.locale.translate('tablet-removing'),
                        [{
                            title: services.locale.translate('yes'),
                            style: 'danger',
                            callback: function(){
                                services.api.removeDevice(deviceId, function(){
                                    self.loadTable();
                                });
                            }
                        }, {
                            title: services.locale.translate('no'),
                            style: 'default'
                        }]
                    );
                });




                $(self.element).find('.btn.dropdown-toggle').on('click', function(){

                    $(self.element).find('.devices > div').css('z-index', 999);

                    var device = $(this).closest('.device');
                    device.css('z-index', 1000);

                    $(document).click(function(){
                        $(self.element).find('.device').css('z-index', 999);
                    });
                });
            });
        });
    };

    this.unload = function(){
        delete self.tables;

    };

    var self = this;
};