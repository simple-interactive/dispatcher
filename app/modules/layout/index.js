modules.layout = function(){

    this.init = function () {
        self.view.render('layout/view/index', {}, function(renderedHtml){
            $(self.element).html(renderedHtml);
            module.load('devices');
            module.load('order');
        });

        $('#tabs li a').click(function(e){
            $('#tabs li[class=active]').removeAttr('class');
            $(e.target).parent().attr('class', 'active')
            $('.tab').hide();
            $('#' + $(e.target).attr('data-tabid')).show();
        });
    };
    var self = this;

};