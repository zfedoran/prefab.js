define([
        'jquery',
        'lodash',
        'math/vector4',
        'graphics/device',
        'core/context'
    ],
    function(
        $,
        _,
        Vector4,
        GraphicsDevice,
        Context
    ) {
        'use strict';

        var Application = function() {
            // Disable scrolling
            $('html, body').css({ 'overflow': 'hidden', 'height': '100%' });

            this.width = 720;
            this.height = 480;

            this.backgroundColor = new Vector4(0.22, 0.22, 0.22, 1.0);

            this.device = new GraphicsDevice(this.width, this.height);
            this.device.initDefaultState();

            this.context = new Context(this.device);

            window.context = this.context;

            this.loadAssets();
            this.init();

            var self = this;
            var prevTime = 0;
            var elapsedList = [];
            (function loop(time) {
                window.requestAnimationFrame(loop);
                var elapsed = time - prevTime;
                if (window.hasFocus) {
                    //console.log('active');
                    elapsedList.push(elapsed);
                    if (elapsedList.length >= 60) {
                        var i, avg = 0;
                        for (i = 0; i<elapsedList.length; i++) {
                            avg += elapsedList[i];
                        }
                        //console.log('fps: ' + (1000 / (avg / 60)));
                        elapsedList.length = 0;
                    }
                    self.time = time;
                    self.context.time = time;
                    self.update(elapsed);
                    self.draw(elapsed);
                }
                prevTime = time;
            })(0);
        };

        Application.prototype = {
            constructor: Application,
            init: function() {
                throw 'Application: init() function not implememnted.';
            },
            loadAssets: function() {
                throw 'Application: loadAssets() function not implememnted.';
            },
            unloadAssets: function() {
                throw 'Application: unloadAssets() function not implememnted.';
            },
            update: function(elapsed) {
                throw 'Application: update() function not implememented.';
            },
            draw: function(elapsed) {
                throw 'Application: draw() function not implememnted.';
            }
        };

        return Application;
    }
);
