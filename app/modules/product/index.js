modules.product = function(){

    this.limit = 10;
    this.offset = 0;

    this.source = 'all';
    this.section = null;
    this.search = null;

    this.init = function () {

        var viewData = {source: 'all'};

        if (self.params.source == 'search') {

            self.source = 'search';
            self.search = self.params.search;

            viewData.search = self.search;
            viewData.source = self.source;

            self.initModule(viewData);
        }
        else if (self.params.source == 'section') {

            self.source = 'section';

            window.services.api.getSection(self.params.sectionId, function(section){

                self.section = section.section;
                viewData.section = self.section;
                viewData.source = self.source;

                self.initModule(viewData);
            });
        }
        else {
            self.initModule(viewData);
        }
    };

    this.initModule = function(viewData){

        self.view.render('product/view/index', viewData, function(renderedHtml) {
            $(self.element).html(renderedHtml);
        });

        $(self.element).find('[data-product-add]').on('click', function(){
            module.load('productManage', {callback: self.init}, 'body');
        });

        $(self.element).find('[data-form-search]').on('submit', function(){

            if ($(this).find('input').val().length < 3) {
                return false;
            }

            self.unload();
            module.load('product', {
                source: 'search',
                search: $(this).find('input').val()
            });

            return false;
        });

        $(self.element).find('[data-see-all]').on('click', function(){
            self.unload();
            module.load('product');
        });

        $(self.element).find('[data-product-list]').on('click', '[data-product] [data-section]', function(){
            self.unload();
            module.load('product', {
                source: 'section',
                sectionId: $(this).data('id')
            });
        });

        $(self.element).find('[data-product-list]').on('click', '[data-edit]', function(){
            module.load('productManage', {
                productId: $(this).data('id'),
                callback: self.drawProducts
            });
        });

        $(self.element).find('[data-product-list]').on('click', '[data-remove]', function(){

            var productId = $(this).data('id');

            window.view.plugins.dialog(
                window.services.locale.translate('confirm-action'),
                window.services.locale.translate('product-removing'),
                [{
                    title: window.services.locale.translate('yes'),
                    style: 'danger',
                    callback: function(){
                        window.services.api.deleteProduct(productId, function(){
                            self.drawProducts();
                        });
                    }
                }, {
                    title: window.services.locale.translate('no'),
                    style: 'default'
                }]
            );
        });

        $(self.element).find('[data-product-list]').on('click', '[data-paginator] [data-nav]', function(){
            self.offset = self.limit * $(this).data('page');
            self.drawProducts();
        });

        self.drawProducts();

        $(self.element).on('click', '.btn.dropdown-toggle', function(){

            $(self.element).find('[data-product]').css('z-index', 999);

            var product = $(this).closest('[data-product]');
            product.css('z-index', 1000);

            $(document).click(function(){
                $(self.element).find('[data-product]').css('z-index', 999);
            });
        });
    };

    this.getProducts = function (limit, offset, callback) {

        switch (self.source) {

            case 'search':
                window.services.api.getSearchProducts(self.search, limit, offset, callback);
                break;

            case 'section':
                window.services.api.getSectionProducts(self.section.id, limit, offset, callback);
                break;

            default :
                window.services.api.getAllProducts(limit, offset, callback);
        }
    };

    
    this.drawProducts = function () {

        window.services.loader.show();

        self.getProducts(self.limit, self.offset, function (products) {

            var viewData = {
                page: self.offset / self.limit,
                limit: self.limit,
                offset: self.offset,
                count: products.count,
                products: products.products
            };

            self.view.render('product/view/list', viewData, function(renderedHtml) {
                $(self.element).find('[data-product-list]').html(renderedHtml);
            });

            window.services.loader.hide();
        });
    };

    this.unload = function(){

        delete self.limit;
        delete self.offset;

        delete self.source;
        delete self.section;
        delete self.search;

        $(self.element).remove();
    };

    var self = this;
};