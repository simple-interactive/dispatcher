modules.orderDetails = function(){

    this.table = null;

    this.init = function(){

        self.table = self.params.table;
        self.calculatedOrder();

        self.view.render('order/view/details', {table: self.params.table}, function(tpl){

                $('body').prepend(tpl);

                if (self.table.isWaiting) {
                    services.api.stopCallingWaiter(self.params.table.id);
                }

                $('[data-order-details]').modal().on('hidden.bs.modal', function(){
                    self.unload();
                });

                $('[data-order-status]').on('click', function(e){
                    services.api.changeOrderStatus({
                        orderId: $(this).data('order'),
                        status: 'success'
                    }, function(data){
                        $(e.target).prop('disabled', true);
                    });
                });
                $('[data-order-pay-status]').on('click', function(e){
                    var button = this;
                    services.api.changeOrderPayStatus({
                        orderId: $(this).data('order'),
                        status: 'yes'
                    }, function(data){
                        $(e.target).prop('disabled', true);
                    });
                });
            }
        );
    };

    this.calculatedOrder = function(){

        self.table.totalPrice = 0;

        self.table.orders.forEach(function(order, index){

            if (order.payStatus != 'yes') {

                self.table.orders[index].price = self.table.orders[index].price || 0;

                self.table.orders[index].data.forEach(function(orderItem, orderIndex){

                    self.table.orders[index].data[orderIndex].price = self.table.orders[index].data[orderIndex].price || 0;
                    orderItem.options = orderItem.options || [];

                    orderItem.options.forEach(function(option){
                        self.table.orders[index].data[orderIndex].price += option.amount * orderItem.product.options[option.option].price;
                    });

                    self.table.orders[index].data[orderIndex].price += orderItem.product.price;

                    self.table.orders[index].data[orderIndex].price *= orderItem.amount;

                    self.table.orders[index].price += self.table.orders[index].data[orderIndex].price;

                });

                self.table.totalPrice += self.table.orders[index].price;
            }
        });

        console.log(self.table);

    };

    this.unload = function(){

        $('[data-order-details]').remove();
        $('.modal-backdrop').remove();
        $(self.element).remove();
    };


    var self = this;
};