modules.order = function (){

    this.init = function(){
        self.loadTable();
        module.load('orderModal');
        this.updateScheduler = setInterval(function(){
            self.loadOrder();
        }, 1000);
    };

    this.loadTable = function(){
        window.services.api.getDevices(function(data){
            self.view.render('order/view/index', {tables:data.tables}, function(renderedHtml) {
                $(self.element).html(renderedHtml);
                $('.order-table').on('click', function(e){
                    var orders= [];
                    self.orders.forEach(function(item){
                        if (item.tableId == $(e.target).attr('data-tableId')) {
                            orders.push(item);
                        }
                    });
                    modules.orderModal.open(orders);
                });
            });
        });
    };

    this.loadOrder = function(){
        window.services.api.getOrders(function(data){
            $('.order-table').css('background', config.tableColors.wait);
            for (var index in data.orders) {
                self.orders = data.orders;
                $('.order-table[data-tableid=' + data.orders[index].tableId +']').css('background', config.tableColors.exists);
            }
        });
    };
    var self = this;
};