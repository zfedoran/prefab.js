requirejs.config({
    baseUrl: 'app',
    shim: {
        'lodash': { exports: '_' }
    },
    paths: {
        'jquery'        : '../bower_components/jquery/jquery',
        'lodash'        : '../bower_components/lodash/dist/lodash',
        'text'          : '../bower_components/requirejs-text/text',
        'image'         : '../bower_components/requirejs-plugins/src/image'
    }
});

requirejs(['jquery', 'prefab'], function($, Prefab) {
    'use strict';

    // Disable scrolling
    $('html, body').css({ 'overflow': 'hidden', 'height': '100%' });

    // Setup focus events
    var gui = require('nw.gui'); 
    var win = gui.Window.get();

    win.on('focus', function() { window.hasFocus = true; });
    win.on('blur', function() { window.hasFocus = false; });

    window.hasFocus = true;

    // Create the application
    $(function() {
        var prefab = new Prefab();
    });
});
