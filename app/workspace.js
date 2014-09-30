define([
        'lodash',
        'math/rectangle',
        'math/vector3',
        'graphics/sprite',
        'graphics/texture',
        'components/transform',
        'components/boxCollider',
        'components/meshClip',
        'factories/blockFactory',
        'factories/quadFactory',
        'factories/labelFactory',
        'factories/cameraFactory',
        'factories/uiButtonFactory',
        'factories/uiInputFactory',
        'editor/factories/gridFactory',
        'editor/ui/uiEditorButton',
        'editor/ui/uiEditorInput'
    ],
    function(
        _,
        Rectangle,
        Vector3,
        Sprite,
        Texture,
        Transform,
        BoxCollider,
        MeshClip,
        BlockFactory,
        QuadFactory,
        LabelFactory,
        CameraFactory,
        UIButtonFactory,
        UIInputFactory,
        GridFactory,
        UIEditorButton,
        UIEditorInput
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
                this.cameraFactory   = new CameraFactory(this.context);
                this.blockFactory    = new BlockFactory(this.context);
                this.quadFactory     = new QuadFactory(this.context);
                this.labelFactory    = new LabelFactory(this.context);
                this.gridFactory     = new GridFactory(this.context);
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
                this.root.addComponent(MeshClip.createFromMinMax(new Vector3(-1, -1, -1), new Vector3(1,1,1)));
                this.root.addToGroup('scene');

                var gridEntity = this.gridFactory.create(20, 20, 20);
                gridEntity.name = 'grid';
                gridEntity.addToGroup('scene');

                var grid = gridEntity.getComponent('Grid');
                grid.hasXYPlane = false;
                grid.hasXZPlane = true;
                grid.hasYZPlane = false;

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
                // Factories
                this.uiButtonFactory = new UIButtonFactory(this.context);
                this.uiInputFactory  = new UIInputFactory(this.context);

                // Styles
                this.uiEditorButton = new UIEditorButton(this.context);
                this.uiEditorInput  = new UIEditorInput(this.context);

                // Entities
                this.button = this.uiButtonFactory.create('apply', this.uiEditorButton);
                this.button.addToGroup('ui');

                var transform = this.button.getComponent('Transform');
                transform.setPosition(100, 100, -1);

                this.button = this.uiButtonFactory.create('cancel', this.uiEditorButton);
                this.button.addToGroup('ui');

                transform = this.button.getComponent('Transform');
                transform.setPosition(150, 100, -1);

                this.input = this.uiInputFactory.create('0.4200', this.uiEditorInput);
                this.input.addToGroup('ui');

                transform = this.input.getComponent('Transform');
                transform.setPosition(250, 100, -1);

                this.input = this.uiInputFactory.create('0.2138', this.uiEditorInput);
                this.input.addToGroup('ui');

                transform = this.input.getComponent('Transform');
                transform.setPosition(310, 100, -1);

                this.input = this.uiInputFactory.create('0.9034', this.uiEditorInput);
                this.input.addToGroup('ui');

                transform = this.input.getComponent('Transform');
                transform.setPosition(370, 100, -1);
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
                var texture = this.uiEditorButton.normal.background.getTexture();
                var sprite  = this.uiEditorButton.normal.background;

                var prev, transform;

                prev = this.root;
                for (var i = 0; i < 10; i++) {
                    var block = this.blockFactory.create(sprite.getTexture(), 1, 1, 1);
                    block.name = 'block-' + i;
                    block.getComponent('Block').setAllFacesTo(sprite);
                    block.addComponent(new BoxCollider());

                    transform = block.getComponent('Transform');
                    transform.setPosition((Math.random() - 0.5)*2, (Math.random() - 0.5)*2, (Math.random() - 0.5)*2);
                    //transform.setRotationFromEuler(-0.1, -0.1, -0.1);

                    prev.addChild(block);
                    prev = block;
                }

                
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
                transform.localPosition.x = Math.sin(time*0.1) * 5;
                transform.localPosition.y = Math.cos(time*0.2) * 5;
                transform.localPosition.z = Math.cos(time*0.1) * 5;
                transform.setDirty(true);

                this.camera.getComponent('Camera').target = this.root;

                this.input.getComponent('UIInput').setText(this.context.getFramesPerSecond());
            }

        });

        return Workspace;
    }
);
