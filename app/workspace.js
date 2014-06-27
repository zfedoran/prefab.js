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
        'graphics/spriteFont',
        'file/saveAsFileDialog',
        'editor/core/uiTheme'
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
        SpriteFont,
        SaveAsFileDialog,
        EditorUITheme
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
            *   This method initializes various editor components
            *
            *   @method initEditor
            *   @returns {undefined}
            */
            initEditor: function() {
                var editorUITheme = new EditorUITheme(this.context);
                this.context.setUITheme(editorUITheme);
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

                this.initEditor();
                var uiTheme = this.context.getUITheme();
                var texture = uiTheme.button.getTexture();
                var sprite  = uiTheme.button;

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
                    transform.setPosition((Math.random() - 0.5)*2, (Math.random() - 0.5)*2, (Math.random() - 0.5)*2);
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
                var quad = this.quadFactory.create(100, 20, sprite);
                quad.name = 'quad';
                quad.getComponent('MeshRenderer').material.diffuseMap = texture;
                quad.getComponent('Transform').setPosition(5, 25, -1);
                quad.getComponent('Quad').anchor.x = 1;
                quad.getComponent('Quad').mode = 'sliced';
                quad.addComponent(new BoxCollider());
                quad.addToGroup('ui');
                this.quad = quad;


                this.label = this.labelFactory.create('Hello, World', 'arial', 9);
                this.label.name = 'label';
                this.label.getComponent('Transform').setPosition(15, 25, -1);
                this.label.getComponent('Label').textAlign = 'left';
                this.label.getComponent('Label').anchor.x = 1;
                this.label.getComponent('Label').antiAlias = true;
                this.label.getComponent('Label').invertColors = false;
                var material = this.label.getComponent('MeshRenderer').material;
                material.ambientFactor = 0.6;
                material.diffuse.set(0, 0, 0, 1);
                this.label.addComponent(new BoxCollider());
                this.label.on('mouseenter', onClickHandler, this.label);
                this.label.addToGroup('ui');

                this.fpsLabel = this.labelFactory.create('0 fps', 'arial', 9);
                this.fpsLabel.name = 'fps-label';
                //this.fpsLabel.getComponent('Transform').setScale(0.01, 0.01, 0.01);
                this.fpsLabel.getComponent('Transform').setPosition(10, 50, -1);
                this.fpsLabel.getComponent('Label').textAlign = 'left';
                this.fpsLabel.getComponent('Label').anchor.x = 1;
                this.fpsLabel.getComponent('Label').anchor.y = -1;
                this.fpsLabel.getComponent('Label').antiAlias = false;
                this.fpsLabel.getComponent('Label').invertColors = false;
                material = this.fpsLabel.getComponent('MeshRenderer').material;
                material.ambientFactor = 1.0;
                material.diffuse.set(1, 1, 1, 1);
                this.label.addComponent(new BoxCollider());
                this.fpsLabel.addComponent(new BoxCollider());
                this.fpsLabel.on('mouseenter', onClickHandler, this.fpsLabel);
                this.fpsLabel.addToGroup('ui');
                
                /*
                var self = this;
                setTimeout(function() {
                    var saveAsFileDialog = new SaveAsFileDialog();
                    saveAsFileDialog.init('hello-world.png');
                    saveAsFileDialog.trigger(function(filename) {
                        var base64String = self.fpsLabel.getComponent('Label').spriteFont._canvas.toDataURL('image/png').split(',')[1];
                        var buffer       = new Buffer(base64String, 'base64');

                        var fs = require('fs');
                        fs.writeFileSync(filename, buffer);

                        saveAsFileDialog.destroy();
                    });
                }, 5000);
                */
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
