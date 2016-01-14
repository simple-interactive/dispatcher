modules.orderModal = function(){
    this.init = function(){
    };
    this.open = function(orders){
        self.view.render('order/view/orderModal', {orders: orders}, function(renderedHtml){
                $(self.element).html(renderedHtml);
                var margin = 20;
                $('#orderDialog').modal('show').css({
                    'width': function(){
                        return ($(window).width() - margin)
                    },
                    'height': function(){
                        return ($(window).height() - margin)
                    },
                    'margin-top': margin/2,
                    'margin-left': margin/2
                });

                $('.orderStatus').on('click', function(e){
                    window.services.api.changeOrderStatus({
                        orderId: $(e.target).closest('div').attr('data-order'),
                        status: $(e.target).prop('checked') ? 'success' : 'new'
                    });
                });
                $('.orderPayStatus').on('click', function(e){
                    window.services.api.changeOrderPayStatus({
                        orderId: $(e.target).closest('div').attr('data-order'),
                        status: $(e.target).prop('checked') ? 'yes' : 'no'
                    });
                });
            }
        );
    };
    var self = this;
};