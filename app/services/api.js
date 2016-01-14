window.services.api = function(){

    this.STATUS_ACTIVE = 'active';
    this.STATUS_LOCK = 'lock';

    /**
     * @type {{endpoint: (config.endpoint|string)}}
     */
    this.config = {
        endpoint : config.endpoint,
        token : config.token
    };

    /**
     * Add table (tablet).
     *
     * Default status of table is STATUS_ACTIVE
     *
     * @param {object} data
     * @param {string} data.id
     * @param {string} data.name
     * @param {string} data.token
     * @param callback
     */
    this.addDevice = function(data, callback, failCallback){
        data.status =  self.STATUS_ACTIVE;
        self.call('POST', 'table/index', data, callback, failCallback);
    };

    this.getDevices = function(callback){
        self.call('GET', 'table/list' , {}, callback);
    };

    this.removeDevice = function(id, callback, failCallback){
        self.call('POST', 'table/remove', {id: id}, callback, failCallback);
    };

    this.getDevice = function(id, callback){
        self.call('GET', 'table/index', {id: id}, callback);
    };

    this.editDevice = function(data, callback, failCallbak){
        self.call('POST', 'table/index', data, callback, failCallbak);
    };

    this.getOrders = function(callback){
        self.call('GET', 'order/list', {}, callback);
    };

    this.changeOrderStatus = function(data, callback, failCallback){
        self.call('POST','order/status' ,data, callback, failCallback);
    };

    this.changeOrderPayStatus = function(data, callback, failCallback){
        self.call('POST','order/pay' ,data, callback, failCallback);
    };

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
                else if (response.status == 400 && failCallback) {
                    failCallback(parsedResponse);
                }
                else if (failCallback) {
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