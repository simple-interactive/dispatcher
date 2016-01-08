modules.deviceModal = function(){

    this.mode = 'add';
    this.editTable = {};

    this.init = function(){

        self.view.render('table/view/createTabDialog', {}, function(renderHtml){
            $(self.element).html(renderHtml);
            self.modal = $('#addTableModal');
            self.saveBtn = $('#addTableBtn');
            self.name =  $('#addFormTableName');
            self.token =  $('#addFormTableToken');

            self.saveBtn.on('click', function(e){

                if (self.mode == 'add') {
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
                }
                else {

                    window.services.api.editDevice(
                        {
                            id: self.editTable.id,
                            name: self.name.val(),
                            token: self.token.val(),
                            status: self.editTable.status
                        },
                        function(){
                            self.modal.modal('hide');
                            $(self).trigger('saved');
                        }
                    );
                }
            });
        });
    };

    this.create = function(){

        this.mode = 'add';

        self.name.val('Table');
        self.token.val($.md5(new Date().toString()).substr(27, 5));
        self.modal.modal('show');
    };

    this.edit = function(id){

        this.mode = 'edit';

        window.services.api.getDevice(id, function(data){
            self.editTable = data.table;
            self.name.val(data.table.name);
            self.token.val(data.table.token);
        });
        self.modal.modal('show');
    };


    var self = this;
};