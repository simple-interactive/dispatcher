$(function(){
    window.dispatcher.postDispatch = function () {
        module.load('layout');
    };
});