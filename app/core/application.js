define([
        'jquery',
        'lodash',
        'graphics/device',
        'core/context',
        'core/assetLibrary',
        'core/entityManager',
        'core/controllerManager'
    ],
    function(
        $,
        _,
        GraphicsDevice,
        Context,
        AssetLibrary,
        EntityManager,
        ControllerManager
    ) {
        'use strict';

        /**
        *   Abstract Applicaiton class.
        *
        *   Handles initialization of the GraphicsDevice and the application
        *   render loop.
        *
        *   @class 
        */
        var Application = function() {
            // Create the application context
            this.context = new Context(this);

            // Create the asset library
            this.assetLibrary = new AssetLibrary(this.context);

            // Create the entity manager
            this.entityManager = new EntityManager();

            // Create the controller manager
            this.controllerManager = new ControllerManager(this.context);

            // Call the parent init() function
            this.init();
        };

        Application.prototype = {
            constructor: Application,

            /**
            *   Initialize the graphics device for this application.
            *
            *   @method initGraphicsDevice
            *   @returns {undefined}
            */
            initGraphicsDevice: function() {
                this.width  = this.width || 720;
                this.height = this.height || 480;

                this.device = new GraphicsDevice(this.width, this.height);
                this.device.initDefaultState();
            },

            /**
            *   This method starts the application render loop.
            *
            *   @method initRenderLoop
            *   @returns {undefined}
            */
            initRenderLoop: function() {
                var self = this;
                var prevTime = 0;
                var elapsedList = [];
                (function loop(time) {
                    window.requestAnimationFrame(loop);
                    var elapsed = time - prevTime;
                    if (window.hasFocus) {

                        if (self.logFPS) {
                            elapsedList.push(elapsed);
                            if (elapsedList.length >= 60) {
                                var i, avg = 0;
                                for (i = 0; i<elapsedList.length; i++) {
                                    avg += elapsedList[i];
                                }
                                console.log('fps: ' + (1000 / (avg / 60)));
                                elapsedList.length = 0;
                            }
                        }

                        self.time = time;
                        self.update(elapsed);
                        self.render(elapsed);
                    }
                    prevTime = time;
                })(0);
            },

            /**
            *   Abstract init method.
            *
            *   @method init
            *   @returns {undefined}
            */
            init: function() {
                throw 'Application: init() function not implememnted.';
            },

            /**
            *   Abstract update method.
            *
            *   @method update
            *   @param {elapsed} Time since last update in seconds
            *   @returns {undefined}
            */
            update: function(elapsed) {
                throw 'Application: update() function not implememented.';
            },

            /**
            *   Abstract render method.
            *
            *   @method render
            *   @param {elapsed} Time since last update in seconds
            *   @returns {undefined}
            */
            render: function(elapsed) {
                throw 'Application: draw() function not implememnted.';
            }
        };

        return Application;
    }
);
