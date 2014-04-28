define([
        'jquery',
        'lodash',
        'core/application',
        'math/vector4',
        'controllers/renderController',
        'factories/blockFactory',
        'math/rectangle',
        'graphics/sprite',
        'graphics/texture',
        'factories/cameraFactory',
        'math/vector3'
    ],
    function(
        $,
        _,
        Application,
        Vector4,
        RenderController,
        BlockFactory,
        Rectangle,
        Sprite,
        Texture,
        CameraFactory,
        Vector3
    ) {
        'use strict';

        var Prefab = function() {
            this.width  = 720;
            this.height = 480;
            this.logFPS = true;
            this.controllerList = [];

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
                // Disable scrolling
                $('html, body').css({ 'overflow': 'hidden', 'height': '100%' });

                this.initGraphicsDevice();
                this.initAssets((function() {
                    this.initContext();
                    this.initControllers((function() {
                        this.initFactories();
                        this.initScene();
                        this.initCamera();
                        this.initRenderLoop();
                    }).bind(this));
                }).bind(this));
            },

            /**
            *   This method loads all required assets and creates the asset
            *   library.
            *
            *   @method initAssets
            *   @param {callback}
            *   @returns {undefined}
            */
            initAssets: function(callback) {
                this.assetLib = {};

                var self = this;
                var assets = [
                    'assets/block.png'
                ];

                var dependencies = _.map(assets, function(src) { return 'image!' + src; });

                requirejs(dependencies, (function() { 
                    for (var i = 0; i < arguments.length; i++) {
                        var pathToAsset = assets[i];
                        self.assetLib[pathToAsset] = arguments[i];
                    }
                    callback();
                }).bind(this));
            },

            /**
            *   Initialize the factories used to create entities.
            *
            *   @method initFactories
            *   @returns {undefined}
            */
            initFactories: function() {
                this.cameraFactory = new CameraFactory(this.context);
                this.blockFactory  = new BlockFactory(this.context);
            },

            /**
            *   This method creates the initial scene.
            *
            *   @method initScene
            *   @returns {undefined}
            */
            initScene: function() {
                var width, height, depth;
                width = height = depth = 1;

                var entity  = this.blockFactory.create(width, height, depth);
                var block   = entity.getComponent('Block');
                var texture = new Texture(this.device, this.assetLib['assets/block.png']);
                var sprite  = new Sprite(new Rectangle(0, 0, 8, 8), texture);

                block.front   = sprite;
                block.left    = sprite;
                block.back    = sprite;
                block.right   = sprite;
                block.top     = sprite;
                block.bottom  = sprite;
                block.texture = texture;

                var material = entity.getComponent('MeshRenderer').material;
                material.diffuseMap = texture;
                material.setDirty(true);

                this.context.entityManager.addEntity(entity);
                this.context.entityManager.addEntityToGroup(entity, 'Scene');
            },

            /**
            *   This method creates the application camera.
            *
            *   @method initCamera
            *   @returns {undefined}
            */
            initCamera: function() {
                this.camera = this.cameraFactory.create(new Rectangle(0, 0, this.width, this.height), 0.1, 100, 75);

                var cameraComponent = this.camera.getComponent('Camera');
                cameraComponent.addRenderGroup('Scene');
                cameraComponent.target = new Vector3(0,0,0);

                this.camera.getComponent('Transform').localPosition = new Vector3(0, 5, 5);

                this.context.entityManager.addEntity(this.camera);
            },

            /**
            *   This method initializes the application controllers.
            *
            *   @method initControllers
            *   @param {callback}
            *   @returns {undefined}
            */
            initControllers: function(callback) {
                var dependencies = [
                    'controllers/cameraController',
                    'controllers/blockController'
                ];

                requirejs(dependencies, (function() { 
                    for (var i = 0; i < arguments.length; i++) {
                        this.controllerList.push(new (arguments[i])(this.context));
                    }
                    callback();
                }).bind(this));

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
                var i, controller;
                for (i = 0; i < this.controllerList.length; i++) {
                    this.controllerList[i].update(elapsed);
                }

                this.camera.getComponent('Transform').localPosition = new Vector3(Math.cos(this.time*0.001)*2, Math.sin(this.time*0.003)*2, Math.sin(this.time*0.005)*2);
                this.camera.getComponent('Transform').setDirty(true);
            },

        });

        return Prefab;
    }
);
