modules.productManage = function(){

    this.product = {
        id: "",
        title: "",
        description: "",
        price: "",
        weight: "",
        exists: 1,
        section: {
            id: "",
            title: ""
        },
        images: [],
        ingredients: [],
        options:[]
    };

    this.tree = [];

    this.init = function () {

        if (self.params.productId) {

            window.services.api.getProduct(self.params.productId, function(product){
                self.product = product.product;
                self.initForm();
            });
        }

        else {
            this.initForm();
        }
    };

    this.initForm = function(){

        window.services.api.getSectionTree(function(tree){

            self.tree = tree.sections;
            self.manageForm();
            self.manageStaticFields();
            self.manageImages();
            self.manageIngredients();
            self.manageOptions();
            self.profileSubmit();

            self.submitProduct();
        });
    };

    this.manageForm = function(){

        self.view.render('product/view/manage', {product: self.product, tree: self.tree}, function(renderedHtml){
            $(self.element).html(renderedHtml);
        });

        $(self.element).find('.modal').modal({
            keyboard: false,
            backdrop: 'static'
        }).on('hidden.bs.modal', function(){
            self.unload(self.params.callback);
        });
    };

    this.manageStaticFields = function () {

        $(self.element).find('input[data-static], textarea[data-static]').on('keyup', function(){
            self.product[$(this).data('static')] = $(this).val();
            self.profileSubmit();
        });

        $(self.element).find('select[data-static]').on('change', function(){
            self.product.section.id = $(this).val();
            self.profileSubmit();
        });

        $(self.element).find('.checkbox[data-static]').find('input, label, ins').on('click', function () {
            self.product[$(this).closest('[data-static]').data('static')] = parseInt($(this).closest('[data-static]').find('div').hasClass('checked'));
            self.profileSubmit();
        });
    };

    this.manageImages = function(){

        $(self.element).find('[data-image-file]').on('change', function(){

            var reader = new FileReader();

            reader.onload = function (event) {
                self.view.render('product/view/image', {image: event.target.result}, function(image){
                    $(self.element).find('[data-images]').append(image);
                });
                self.product.images.push({
                    needToUpload: true,
                    image: event.target.result
                });
                self.profileSubmit();
            };

            if ($(this).get(0).files.length) {
                reader.readAsDataURL($(this).get(0).files[0]);
            }
        });

        $(self.element).find('[data-images]').on('click', '[data-remove]', function(){
            self.product.images.splice($(this).closest('[data-image]').index(), 1);
            $(this).closest('[data-image]').remove();
            self.profileSubmit();
        });
    };

    this.manageIngredients = function () {

        $(self.element).find('[data-add-ingredient]').on('click', function(){
            var ingredient = {ingredient: {id: "", title: ""}, price: "", weight: ""};
            self.view.render('product/view/ingredient', {ingredient: ingredient}, function(ingredient){
                $(self.element).find('[data-ingredients]').append(ingredient);
                self.profileSubmit();
            });
        });

        $(self.element).on('click', '[data-ingredient] [data-add]', function(){
            var group = $(this).closest('[data-ingredient]');
            window.services.api.addIngredient($(this).data('add'), function(ingredient){

                group.find('input').val(ingredient.ingredient.title);
                group.find('.input-group-btn').removeClass('open');

                group.find('[data-input]').removeAttr('disabled');

                self.product.ingredients.push({
                    ingredient: {
                        id: ingredient.ingredient.id
                    },
                    price: "",
                    weight: ""
                });

                group.attr('data-added', true);
                self.profileSubmit();
            });
        });

        $(self.element).on('click', '[data-ingredient] [data-select]', function(){

            self.product.ingredients.push({
                ingredient: {
                    id: $(this).data('id')
                },
                price: "",
                weight: ""
            });

            var group = $(this).closest('[data-ingredient]');

            group.find('[data-title]').val($(this).data('title'));
            group.find('.input-group-btn').removeClass('open');
            group.find('[data-input]').removeAttr('disabled');
            group.attr('data-added', true);

            self.profileSubmit();
        });


        $(self.element).on('click', '[data-ingredient] [data-remove]', function(){

            var group = $(this).closest('[data-ingredient]');

            if (group.attr('data-added')) {
                self.product.ingredients.splice(group.index(), 1);
            }

            group.remove();
            self.profileSubmit();
        });


        $(self.element).on('keyup', '[data-ingredient] [data-title]', function(){

            var group = $(this).closest('[data-ingredient]');

            if (group.attr('data-added')) {

                self.product.ingredients.splice(group.index(), 1);

                group.find('[data-input]')
                    .attr('disabled', 'disabled')
                    .val(null);

                group.removeAttr('data-added');
                $(this).parent().removeClass('open');

                self.profileSubmit();
                return false;
            }

            var dropDown = $(this).parent().find('[data-list]');
            var search = $(this).val();

            if (search.length) {

                $(this).parent().addClass('open');

                window.services.api.getIngredients($(this).val(), function (ingredients) {
                    self.view.render('product/view/ingredient-list', {search: search, ingredients: ingredients.ingredients}, function(list){
                        dropDown.html(list);
                    });
                });
            }
        });

        $(self.element).on('keyup', '[data-ingredient] [data-input]', function(){
            self.product.ingredients[$(this).closest('[data-ingredient]').index()][$(this).data('input')] = $(this).val();
            self.profileSubmit();
        });
    };

    this.manageOptions = function(){

        $(self.element).find('[data-add-options]').on('click', function(){

            self.view.render('product/view/option', {option:{title: "", price: "", weight: ""}}, function(option){
                $(self.element).find('[data-options]').append(option);
            });

            self.product.options.push({
                title: "",
                price: "",
                weight: ""
            });
            self.profileSubmit();
        });

        $(self.element).find('[data-options]').on('keyup', 'input', function(){
            self.product.options[$(this).closest('[data-option]').index()][$(this).data('input')] = $(this).val();
            self.profileSubmit();
        });

        $(self.element).find('[data-options]').on('click', '[data-remove]', function(){
            self.product.options.splice($(this).closest('[data-option]').index(), 1);
            $(this).closest('[data-option]').remove();
            self.profileSubmit();
        });
    };

    this.profileSubmit = function(){

        var errors = [];

        if (self.product.title.length < 2 || self.product.title.length > 30) {
            errors.push('title');
        }

        if (self.product.description.length < 10 || self.product.description.length > 200) {
            errors.push('description');
        }

        if (self.product.price < 1) {
            errors.push('price');
        }

        if (self.product.weight < 1) {
            errors.push('weight');
        }

        if (!self.product.section.id) {
            errors.push('sectionId');
        }

        if (!self.product.images.length) {
            errors.push('images');
        }

        for (var i=0; i<self.product.options.length; i++) {

            if (self.product.options[i].title.length < 3 || self.product.options[i].title.length > 20) {
                errors.push('options-title');
                break;
            }

            if (!self.product.options[i].price) {
                errors.push('options-price');
                break;
            }

            if (!self.product.options[i].weight) {
                errors.push('options-weight');
                break;
            }
        }

        for (var i=0; i<self.product.ingredients.length; i++) {

            if (!self.product.ingredients[i].price) {
                errors.push('ingredients-price');
                break;
            }

            if (!self.product.ingredients[i].weight) {
                errors.push('ingredients-weight');
                break;
            }
        }

        if (!errors.length) {
            $(self.element).find('[data-submit]').removeAttr('disabled');
        }
        else {
            $(self.element).find('[data-submit]').attr('disabled', true);
        }
    };

    this.submitProduct = function(){

        $(self.element).find('[data-submit]').on('click', function(){

            window.services.loader.show();

            window.services.api.saveProduct(self.product, function(){

                window.services.loader.hide();
                $(self.element).find('.modal').modal('hide');

            }, function(response){

                window.services.loader.hide();
                $(self.element).find('[data-form-error]').html(response.message);
            });
        });
    };

    this.unload = function (callback) {

        delete self.product;

        $(self.element).remove();

        if (callback) {
            callback();
        }
    };

    var self = this;
};