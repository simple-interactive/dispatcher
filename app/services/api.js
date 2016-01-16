window.services.api = function(){

    /**
     * @type {{endpoint: (config.endpoint|string)}}
     */
    this.config = {
        endpoint : config.endpoint,
        token : config.token
    };

    this.manageDevice = function(data, callback, failCallback){
        if (!data.id) {
            data.status =  'active';
        }
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

    this.updateDispatcher = function(callback){
        self.call('GET', 'index', {}, callback);
    };

    this.getOrders = function(callback){
        self.call('GET', 'order/list', {}, callback);
    };

    this.changeOrderStatus = function(data, callback){
        self.call('POST', 'order/status', data, callback);
    };

    this.changeOrderPayStatus = function(data, callback){
        self.call('POST', 'order/pay', data, callback);
    };

    this.stopCallingWaiter = function(id, callback){
        self.call('POST', 'table/stop-calling-waiter', {id: id}, callback);
    };

    /**
     * Send request to an api
     *
     * @param {string} method
     * @param {string} endpoint
     * @param {object} data
     * @param {function|null} [callback=null]
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
                    if (callback) {
                        callback(parsedResponse);
                    }
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