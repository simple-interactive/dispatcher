window.services.api = function(){

    /**
     * @type {{endpoint: (config.endpoint|string)}}
     */
    this.config = {
        endpoint : config.endpoint,
        token : config.token
    };

    /**
     * Auth user and receive token
     *
     * @param {object} data
     * @param {string} data.login
     * @param {string} data.password
     *
     * @param {function} callback
     */
    this.login = function(data, callback){

        if (!self.config.endpoint) {
            console.log("API Endpoint was not specified");
            return;
        }

        $.post([self.config.endpoint, 'auth'].join('/'), data, callback);
    };

    /****************************** SECTION *******************************/
    /**
     * Returns section list by provided parent section ID
     * METHOD: GET
     * URL:    section?parentId=parentId
     *
     * @param {string|null} parentId
     * @param {function} callback
     */
    this.getSections = function(parentId, callback){
        var params = (parentId != null)?{parentId: parentId}:{};
        self.call('get', 'section/list', params, callback);
    };

    /**
     * Returns section object by provided ID
     * Method: GET
     * URL:    section/get?id=sectionId
     *
     * @param {string}   sectionId
     * @param {function} callback
     */
    this.getSection = function(sectionId, callback){
        self.call('get', 'section', {id: sectionId}, callback);
    };

    /**
     * Saves section data.
     * METHOD: POST
     * URL: section/save
     *
     * @param {object} data
     * @param {string} data.id - can be a null - in this case backend will create a new section
     * @param {string} data.title
     * @param {Blob}   data.image - only for editing a section can be a null
     *
     * @param {function} callback
     * @param {function} failCallback
     */
    this.saveSection = function(data, callback, failCallback){
        self.call('post', 'section/save', data, callback, failCallback);
    };

    /**
     * @param {string} id
     * @param {function} callback
     */
    this.deleteSection = function(id, callback){
        self.call('post', 'section/delete', {id: id}, callback);
    };

    /**
     * Returns section tree to display it in the product manage form
     *
     * @param {function} callback
     */
    this.getSectionTree = function(callback){
        self.call('get', 'section/tree', {}, callback);
    };

    /**************************** END SECTION *****************************/

    /****************************** PRODUCT *******************************/
    /**
     * Returns list of all products
     *
     * @param {number} limit
     * @param {number} offset
     * @param {function} callback
     */
    this.getAllProducts = function(limit, offset, callback){
        self.call('get', 'product/list', {limit: limit, offset: offset}, callback);
    };

    /**
     * Returns list of founded products
     *
     * @param {string} search
     * @param {number} limit
     * @param {number} offset
     * @param {function} callback
     */
    this.getSearchProducts = function(search, limit, offset, callback){
        self.call('get', 'product/search', {search: search, limit: limit, offset: offset}, callback);
    };

    /**
     * Returns list of products by section
     *
     * @param {string} sectionId
     * @param {number} limit
     * @param {number} offset
     * @param {function} callback
     */
    this.getSectionProducts = function(sectionId, limit, offset, callback){
        self.call('get', 'product/section', {sectionId: sectionId, limit: limit, offset: offset}, callback);
    };

    /**
     * Saves new or editable product
     *
     * @param {Object} product
     * @param {String} product.id [product.id=null]
     * @param {String} product.description
     * @param {Number} product.price
     * @param {Number} product.weight
     * @param {Number} product.exists
     * @param {String} product.sectionId
     * @param {Array} product.images
     * @param {Array} product.ingredients
     * @param {Array} product.options
     *
     * @param {Function} callback
     * @param {Function} failCallback
     */
    this.saveProduct = function(product, callback, failCallback){
        self.call('post', 'product', product, callback, failCallback);
    };

    /**
     * Gets product data by id
     *
     * @param {String} id
     * @param {Function} callback
     */
    this.getProduct = function(id, callback){
        self.call('get', 'product', {id: id}, callback);
    };

    /**
     * Deletes product by id
     *
     * @param {String} id
     * @param {Function} callback
     */
    this.deleteProduct = function(id, callback){
        self.call('post', 'product/delete', {id: id}, callback);
    };

    /**************************** END PRODUCT *****************************/


    /**************************** INGREDIENTS *****************************/

    /**
     * Saves ingredient
     *
     * @param {string} title
     * @param {function} callback
     */
    this.addIngredient = function(title, callback){
        self.call('post', 'ingredient/save', {title: title}, callback);
    };

    /**
     * Returns list of founded ingredients
     *
     * @param {string} search
     * @param {function} callback
     */
    this.getIngredients = function (search, callback) {
        self.call('get', 'ingredient', {search: search}, callback);
    };

    /************************** END INGREDIENTS ***************************/

    /**
     * Send request to an api
     *
     * @param {string} method
     * @param {string} endpoint
     * @param {object} data
     * @param {function} callback
     * @param {function|null} [failCallback=null]
     */
    this.call = function(method, endpoint, data, callback, failCallback){

        if (!self.config.endpoint) {
            console.log("API Endpoint was not specified");
            return;
        }

        $.ajax({
            url: [self.config.endpoint, endpoint].join('/'),
            data: data,
            type: method.toUpperCase(),
            dataType: 'json',
            beforeSend: function(request){
                request.setRequestHeader('x-auth', self.config.token);
            },
            complete: function (response) {

                if (response.status == 403) {
                    services.user.forget();
                    return false;
                }

                var parsedResponse = {
                    success: false,
                    message: 'the-server-is-currently-not-responding'
                };

                try {
                    parsedResponse = JSON.parse(response.responseText);
                } catch (err) {}

                if (response.status == 200) {
                    callback(parsedResponse);
                }
                else if (response.status == 400) {
                    failCallback(parsedResponse);
                }
                else {
                    failCallback({
                        success: false,
                        message: 'the-server-is-currently-not-responding'
                    });
                }
            }
        });
    };

    var self = this;

};