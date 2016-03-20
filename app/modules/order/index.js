modules.order = function (){

    this.updateScheduler = null;
    this.tables = null;

    this.init = function(){

        self.updateScheduler = setInterval(function(){
            self.loadTable();
        }, 2000);

        self.loadTable();
    };

    this.loadTable = function(){

        services.api.updateDispatcher(function(data){

            self.view.render('order/view/index', {tables: data.tables}, function(tpl) {
                $(self.element).html(tpl);

                self.loadOrder();

                $(self.element).find('[data-table]').on('click', function(){
                    var table = self.tables[$(this).index()];
                    module.load('orderDetails', {table: self.tables[$(this).index()]});
                });
            });
        });
    };

    this.loadOrder = function(){

        window.services.api.updateDispatcher(function(data){

            self.tables = data.tables;

            $(self.element).find('[data-table]').removeClass('ordered');
            $(self.element).find('[data-table]').removeClass('called');

            self.tables.forEach(function(table, index){

                if (table.isWaiting) {
                    $(self.element).find('[data-table]').eq(index).addClass('called');
                }

                if (table.isOrdered) {
                    $(self.element).find('[data-table]').eq(index).addClass('ordered');
                }

            });
        });
    };

    this.unload = function(){

        clearInterval(self.updateScheduler);

        delete self.updateScheduler;
        delete self.tables;
    };

    var self = this;
};