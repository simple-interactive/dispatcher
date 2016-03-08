$(function(){

    window.dispatcher.postDispatch = function () {
        if (!services.user.isLoginIn()) {
            module.unloadAll();
            module.load('auth');
        }
        else {
            module.load('layout');
        }
    };
});