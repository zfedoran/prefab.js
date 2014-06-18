define([
        'jquery',
        'lodash',
        'math/rectangle',
        'math/vector3',
        'graphics/sprite',
        'graphics/texture',
        'components/transform',
        'components/boxCollider',
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
        BoxCollider,
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
                this.initUICamera();
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
                var sprite  = new Sprite(new Rectangle(0, 0, 16, 16), texture);

                var prev, transform;

                var self = this;
                var onClickHandler = function(event) {
                    self.label.getComponent('Label').setText(this.name);
                };

                prev = this.root;
                for (var i = 0; i < 100; i++) {
                    var block = this.blockFactory.create(1, 1, 1);
                    block.name = 'block-' + i;
                    block.getComponent('Block').setAllFacesTo(sprite);
                    block.getComponent('MeshRenderer').material.diffuseMap = texture;
                    block.addComponent(new BoxCollider());

                    block.on('mouseenter', onClickHandler, block);

                    transform = block.getComponent('Transform');
                    transform.setPosition(0, 0.1, 0);
                    transform.setRotationFromEuler(-0.1, -0.1, -0.1);

                    prev.addChild(block);
                    prev = block;
                }

                /*
                prev = this.root;
                for (i = 0; i < 100; i++) {
                    var quad = this.quadFactory.create(0.1, 5, sprite);
                    quad.name = 'quad-' + i;
                    quad.getComponent('MeshRenderer').material.diffuseMap = texture;
                    quad.addComponent(new BoxCollider());

                    transform = quad.getComponent('Transform');
                    transform.setPosition(0, 0.1, 0);
                    transform.setRotationFromEuler(-0.1, -0.1, -0.1);

                    quad.on('mouseenter', onClickHandler, quad);

                    prev.addChild(quad);
                    prev = quad;
                }
                */
                var quad = this.quadFactory.create(100, 30, sprite);
                quad.name = 'quad';
                quad.getComponent('MeshRenderer').material.diffuseMap = texture;
                quad.getComponent('Transform').setPosition(10, 220, -1);
                quad.getComponent('Quad').anchor.x = 1;
                quad.getComponent('Quad').anchor.y = -1;
                quad.getComponent('Quad').mode = 'sliced';
                quad.addComponent(new BoxCollider());
                quad.addToGroup('ui');


                this.label = this.labelFactory.create('hello, world', 'arial', 11);
                this.label.name = 'label';
                //this.label.getComponent('Transform').setScale(0.01, 0.01, 0.01);
                this.label.getComponent('Transform').setPosition(10, 20, -1);
                this.label.getComponent('Label').textAlign = 'left';
                this.label.getComponent('Label').anchor.x = 1;
                this.label.getComponent('Label').anchor.y = -1;
                this.label.addComponent(new BoxCollider());
                this.label.on('mouseenter', onClickHandler, this.label);
                this.label.addToGroup('ui');

                this.fpsLabel = this.labelFactory.create('0 fps', 'arial', 11);
                this.fpsLabel.name = 'fps-label';
                //this.fpsLabel.getComponent('Transform').setScale(0.01, 0.01, 0.01);
                this.fpsLabel.getComponent('Transform').setPosition(10, 50, -1);
                this.fpsLabel.getComponent('Label').textAlign = 'left';
                this.fpsLabel.getComponent('Label').anchor.x = 1;
                this.fpsLabel.getComponent('Label').anchor.y = -1;
                this.fpsLabel.addComponent(new BoxCollider());
                this.fpsLabel.on('mouseenter', onClickHandler, this.fpsLabel);
                this.fpsLabel.addToGroup('ui');
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
            *   This method creates the application 2d camera.
            *
            *   @method initCamera
            *   @returns {undefined}
            */
            initUICamera: function() {
                var device = this.context.getGraphicsDevice();
                var width  = device.getWidth();
                var height = device.getHeight();

                this.screen = this.cameraFactory.create(new Rectangle(0, 0, width, height), 0.1, 100);
                this.screen.name = 'UICamera';

                var cameraComponent = this.screen.getComponent('Camera');
                cameraComponent.addRenderGroup('ui');
                cameraComponent.offCenter = true;
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

                this.fpsLabel.getComponent('Label').setText(this.context.getFramesPerSecond());

            }

        });

        return Workspace;
    }
);
