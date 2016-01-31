$(function(){

    window.dispatcher.preDispatch = function(){
        if (!window.config.token) {
            window.config.token = cookie.getItem('token');
        }
    };

    window.dispatcher.postDispatch = function () {
        module.load('layout');
    };
});