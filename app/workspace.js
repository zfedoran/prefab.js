define([
        'jquery',
        'lodash',
        'math/rectangle',
        'math/vector3',
        'graphics/sprite',
        'graphics/texture',
        'components/transform',
        'factories/blockFactory',
        'factories/quadFactory',
        'factories/labelFactory',
        'factories/cameraFactory',
        'editor/factories/gridFactory',
        'graphics/spriteFont'
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
        QuadFactory,
        LabelFactory,
        CameraFactory,
        GridFactory,
        SpriteFont
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
                this.quadFactory   = new QuadFactory(this.context);
                this.labelFactory  = new LabelFactory(this.context);
                this.gridFactory   = new GridFactory(this.context);
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

                var grid = this.gridFactory.create(20, 0, 20);
                grid.name = 'grid';
                grid.addToGroup('scene');

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

                var prev, transform;

                /*
                prev = this.root;
                for (var i = 0; i < 100; i++) {
                    var block = this.blockFactory.create(1, 1, 1);
                    block.name = 'block-' + i;
                    block.getComponent('Block').setAllFacesTo(sprite);
                    block.getComponent('MeshRenderer').material.diffuseMap = texture;

                    transform = block.getComponent('Transform');
                    transform.setPosition(0, 0.1, 0);
                    transform.setRotationFromEuler(-0.1, -0.1, -0.1);

                    prev.addChild(block);
                    prev = block;
                }

                prev = this.root;
                for (i = 0; i < 100; i++) {
                    var quad = this.quadFactory.create(0.1, 10, sprite);
                    quad.name = 'quad-' + i;
                    quad.getComponent('MeshRenderer').material.diffuseMap = texture;

                    transform = quad.getComponent('Transform');
                    transform.setPosition(0, 0.1, 0);
                    transform.setRotationFromEuler(-0.1, -0.1, -0.1);

                    prev.addChild(quad);
                    prev = quad;
                }
                */
                var quad = this.quadFactory.create(1, 1, sprite);
                quad.name = 'quad';
                quad.getComponent('MeshRenderer').material.diffuseMap = texture;
                quad.getComponent('Quad').anchor.x = 1;

                this.root.addChild(quad);

                this.label = this.labelFactory.create('hello, world', 'arial', 30);
                this.label.name = 'label';
                this.label.getComponent('Transform').setScale(0.01, 0.01, 0.01);
                this.label.getComponent('Transform').setPosition(0, 1, 1);
                this.label.getComponent('Label').textAlign = 'left';
                this.label.getComponent('Label').anchor.x = 1;

                this.root.addChild(this.label);
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

                this.camera = this.cameraFactory.create(new Rectangle(0, 0, width, height), 0.1, 1000, 75);

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
                transform.localPosition.x = Math.sin(time*0.0001) * 5;
                transform.localPosition.y = Math.cos(time*0.0002) * 5;
                transform.localPosition.z = Math.cos(time*0.0001) * 5;
                transform.setDirty(true);

                this.camera.getComponent('Camera').target = this.root;

            }

        });

        return Workspace;
    }
);
