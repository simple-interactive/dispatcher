modules.deviceModal = function(){

    this.init = function(){

        self.view.render('table/view/createTabDialog', {}, function(renderHtml){
            $(self.element).html(renderHtml);
            self.modal = $('#addTableModal');
            self.saveBtn = $('#addTableBtn');
            self.name =  $('#addFormTableName');
            self.token =  $('#addFormTableToken');

            self.saveBtn.on('click', function(e){
                window.services.api.addDevice({
                    name: self.name.val(),
                    token: self.token.val()
                },
                    function(data){
                        self.modal.modal('hide');
                        $(self).trigger('saved');
                    },
                    function(err){}
                );
            });
        });
    };

    this.create = function(){
        self.name.val('Table');
        self.token.val($.md5(new Date().toString()).substr(27, 5));
        self.modal.modal('show');
    };

    this.edit = function(token){
        window.services.api.getDevice(token, function(data){
            self.name.val(data.table.name);
            self.token.val(data.table.token);
        });
        self.modal.modal('show');
    };

    var self = this;
};