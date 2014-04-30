define([
        'jquery',
        'lodash',
        'math/rectangle',
        'math/vector3',
        'graphics/sprite',
        'graphics/texture',
        'components/transform',
        'factories/blockFactory',
        'factories/cameraFactory'
    ],
    function(
        $,
        _,
        Rectangle,
        Vector3,
        Sprite,
        Texture,
        Transform,
        BlockFactory,
        CameraFactory
    ) {
        'use strict';

        /**
        *   This class is a place to flesh out new features.
        *
        *   @class 
        */
        var Workspace = function(context) {
            this.context = context;

            this.init();
        };

        Workspace.prototype = _.create(Workspace.prototype, {
            constructor: Workspace,

            /**
            *   This method initializes the prefab application and starts the
            *   render loop.
            *
            *   @method init
            *   @returns {undefined}
            */
            init: function() {
                this.initFactories();
                this.initScene();
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
                this.root = this.context.createNewEntity('root');
                this.root.addComponent(new Transform());
                this.root.addToGroup('scene');

                this.initCamera();
                this.initBlocks();
            },

            /**
            *   Create a simple block hierarchy
            *
            *   @method initBlocks
            *   @returns {undefined}
            */
            initBlocks: function() {
                var assetLibrary = this.context.getAssetLibrary();
                var device       = this.context.getGraphicsDevice();

                var texture = assetLibrary.getTexture('assets/block.png');
                var sprite  = new Sprite(new Rectangle(0, 0, 8, 8), texture);

                var b1 = this.blockFactory.create(1, 1, 1);
                var b2 = this.blockFactory.create(1, 1, 1);
                var b3 = this.blockFactory.create(1, 1, 1);

                b1.name = 'b1';
                b2.name = 'b2';

                b1.getComponent('Block').setAllFacesTo(sprite);
                b2.getComponent('Block').setAllFacesTo(sprite);
                b3.getComponent('Block').setAllFacesTo(sprite);

                b1.getComponent('MeshRenderer').material.diffuseMap = texture;
                b2.getComponent('MeshRenderer').material.diffuseMap = texture;
                b3.getComponent('MeshRenderer').material.diffuseMap = texture;
                
                // offset b2
                b1.getComponent('Transform').setPosition(0, 0, 0);
                b2.getComponent('Transform').setPosition(0, 2, 0);
                b3.getComponent('Transform').setPosition(0, 2, 0);

                // make b2 a child of b1
                b1.addChild(b2);

                // make b3 a child of b2
                b2.addChild(b3);

                // Add to scene
                this.root.addChild(b1);

                this.b1 = b1;
                this.b2 = b2;
                this.b3 = b3;
            },

            /**
            *   This method creates the application camera.
            *
            *   @method initCamera
            *   @returns {undefined}
            */
            initCamera: function() {
                var device = this.context.getGraphicsDevice();
                var width  = device.getWidth();
                var height = device.getHeight();

                this.camera = this.cameraFactory.create(new Rectangle(0, 0, width, height), 0.1, 100, 75);

                this.camera.name = 'camera';

                var cameraComponent = this.camera.getComponent('Camera');
                cameraComponent.addRenderGroup('scene');

                // Add to scene
                this.root.addChild(this.camera);
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
                var time = this.context.getTotalTimeInSeconds();

                var transform = this.camera.getComponent('Transform');
                transform.localPosition.x = Math.sin(time*0.00001) * 10;
                transform.localPosition.y = 3;
                transform.localPosition.z = Math.cos(time*0.00001) * 10;
                transform.setDirty(true);

                this.camera.getComponent('Camera').target = this.b1;

                transform = this.b1.getComponent('Transform');
                transform.setRotationFromEuler(Math.cos(time*0.0001)*3, Math.sin(time*0.0002)*3, Math.sin(time*0.0003)*3);

                transform = this.b2.getComponent('Transform');
                transform.setRotationFromEuler(Math.cos(time*0.0002)*3, Math.sin(time*0.0001)*3, Math.sin(time*0.0001)*3);

                transform = this.b3.getComponent('Transform');
                transform.setRotationFromEuler(Math.cos(time*0.0001)*3, Math.sin(time*0.0002)*3, Math.sin(time*0.0003)*3);

            }

        });

        return Workspace;
    }
);
