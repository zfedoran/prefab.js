define([
        'jquery',
        'lodash',
        'core/application',
        'math/vector4',
        'controllers/renderController',
        'workspace'
    ],
    function(
        $,
        _,
        Application,
        Vector4,
        RenderController,
        Workspace
    ) {
        'use strict';

        /**
        *   The Prefab application class.
        *
        *   @class 
        *   @constructor
        */
        var Prefab = function() {
            this.width           = 720;
            this.height          = 480;
            this.logFPS          = true;
            this.controllerList  = [];
            this.backgroundColor = new Vector4(0.22, 0.22, 0.22, 1);

            Application.call(this);
        };

        Prefab.prototype = _.create(Application.prototype, {
            constructor: Prefab,

            /**
            *   This method initializes the prefab application and starts the
            *   render loop.
            *
            *   @method init
            *   @returns {undefined}
            */
            init: function() {
                this.initGraphicsDevice();
                this.initAssetLibrary((function() {
                    this.initControllers((function() {
                        this.initWorkspace();
                        this.initRenderLoop();
                    }).bind(this));
                }).bind(this));
            },

            /**
            *   This method loads all required assets and creates the asset
            *   library.
            *
            *   @method initAssetLibrary
            *   @param {callback}
            *   @returns {undefined}
            */
            initAssetLibrary: function(callback) {
                // Load all initial textures
                this.assetLibrary.asyncLoadTextures([
                    'assets/block.png'
                ], callback);
            },

            /**
            *   This method creates the workspace.
            *
            *   @method initWorkspace
            *   @returns {undefined}
            */
            initWorkspace: function() {
                this.workspace = new Workspace(this.context);
            },

            /**
            *   This method initializes the application controllers.
            *
            *   @method initControllers
            *   @param {callback}
            *   @returns {undefined}
            */
            initControllers: function(callback) {
                // Load all required controllers
                this.controllerManager.asyncLoadControllers([
                    'controllers/cameraController',
                    'controllers/blockController',
                    'editor/controllers/gridController'
                ], callback);

                // The render controller is a special case, we need to call its
                // update function inside the render function. Therefore we
                // will manage it on our own.
                this.renderController = new RenderController(this.context);
            },

            /**
            *   
            *   This method is called when the application determines it is
            *   time to draw a frame.
            *
            *   @method render
            *   @param {elapsed} Time since last update in seconds
            *   @returns {undefined}
            */
            render: function(elapsed) {
                this.device.clear(this.backgroundColor);

                // Render all visible meshes
                this.renderController.update(elapsed);
            },

            /**
            *   This method is called when the application has determined that
            *   frame logic needs to be processed.
            *
            *   @method update
            *   @param {elapsed} Time since last update in seconds
            *   @returns {undefined}
            */
            update: function(elapsed) {
                // Call each controller's update() function
                this.controllerManager.update(elapsed);

                // Update our workspace
                this.workspace.update(elapsed);
            }
        });

        return Prefab;
    }
);
