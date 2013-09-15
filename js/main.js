requirejs.config({
    baseUrl: 'js',
    shim: {
        'three': { exports: 'THREE' }
    },
    paths: {
        'jquery'        : '../bower_components/jquery/jquery',
        'three'         : '../bower_components/threejs/build/three',
        'text'          : '../bower_components/requirejs-text/text'
    }
});

requirejs(['jquery', 'application'], function($, Application) {

    var requestAnimationFrame = window.requestAnimationFrame
                             || window.mozRequestAnimationFrame
                             || window.webkitRequestAnimationFrame
                             || window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    $(function() {
        var app = new Application();
    });
});
