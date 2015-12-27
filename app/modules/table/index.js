modules.devices  = function(){
    this.init = function(){
        self.loadTable();
        module.load('deviceModal');
        $(window.modules.deviceModal).bind('saved', function(){
            self.loadTable();
        });
    };

    this.loadTable = function() {
        self.tables = window.services.api.getDevices(function(data){
            self.view.render('table/view/index', {devices:data.tables}, function(renderedHtml){
                    $(self.element).html(renderedHtml);
                    $('#createDeviceBtn').on('click', function(e){
                        window.modules.deviceModal.create();
                    });
                }
            );
        });
    };

    this.edit = function(el){
        var token = $(el).closest('tr').data('id');
        window.modules.deviceModal.edit(token);
    };

    this.remove = function(el){
        var token = $(el).closest('tr').data('id');
        window.services.api.removeDevice(token, function(data){
                self.loadTable();
            },
            function(){

            }
        );
    };

    var self = this;
};