requirejs.config({
    baseUrl: 'js',
    shim: {
        'three': { exports: 'THREE' },
        'lodash': { exports: '_' }
    },
    paths: {
        'jquery'        : '../bower_components/jquery/jquery',
        'lodash'        : '../bower_components/lodash/dist/lodash',
        'three'         : '../bower_components/threejs/build/three',
        'text'          : '../bower_components/requirejs-text/text'
    }
});

requirejs(['jquery', 'prefab'], function($, PrefabApplication) {
    'use strict';

    var requestAnimationFrame = window.requestAnimationFrame
                             || window.mozRequestAnimationFrame
                             || window.webkitRequestAnimationFrame
                             || window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    var gui = require('nw.gui'); 
    var win = gui.Window.get();
    win.on('focus', function() { window.hasFocus = true; });
    win.on('blur', function() { window.hasFocus = false; });
    window.hasFocus = true;

    $(function() {
        new PrefabApplication();
    });
});
