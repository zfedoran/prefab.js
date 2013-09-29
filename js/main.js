requirejs.config({
    baseUrl: 'js',
    shim: {
        'three': { exports: 'THREE' },
        'underscore': { exports: '_' }
    },
    paths: {
        'jquery'        : '../bower_components/jquery/jquery',
        'underscore'    : '../bower_components/underscore/underscore',
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
