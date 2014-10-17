define([
        'lodash',
        'math/rectangle',
        'math/vector3',
        'graphics/sprite',
        'graphics/texture',
        'components/transform',
        'components/colliderBox',
        'components/meshClip',
        'factories/blockFactory',
        'factories/cameraFactory',
        'ui/factories/uiLabelFactory',
        'ui/factories/uiButtonFactory',
        'ui/factories/uiTextBoxFactory',
        'editor/factories/gridFactory',
        'editor/ui/uiEditorButton',
        'editor/ui/uiEditorInput',
        'editor/ui/uiEditorText'
    ],
    function(
        _,
        Rectangle,
        Vector3,
        Sprite,
        Texture,
        Transform,
        ColliderBox,
        MeshClip,
        BlockFactory,
        CameraFactory,
        UILabelFactory,
        UIButtonFactory,
        UITextBoxFactory,
        GridFactory,
        UIEditorButton,
        UIEditorInput,
        UIEditorText
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
                this.cameraFactory  = new CameraFactory(this.context);
                this.blockFactory   = new BlockFactory(this.context);
                this.uiLabelFactory = new UILabelFactory(this.context);
                this.gridFactory    = new GridFactory(this.context);
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
                //this.root.addToGroup('scene');

                var gridEntity = this.gridFactory.create('scene-grid', 20, 20, 20);
                //gridEntity.addToGroup('scene');

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
                this.uiButtonFactory  = new UIButtonFactory(this.context);
                this.uiTextBoxFactory = new UITextBoxFactory(this.context);

                // Styles
                this.uiEditorButton = new UIEditorButton(this.context);
                this.uiEditorInput  = new UIEditorInput(this.context);
                this.uiEditorText   = new UIEditorText(this.context);

                // Entities
                this.button = this.uiButtonFactory.create('apply-btn', 'apply', this.uiEditorButton);
                this.button.addToGroup('ui');

                var transform = this.button.getComponent('Transform');
                transform.setPosition(100, 100, -1);

                this.button = this.uiButtonFactory.create('cancel-btn', 'cancel', this.uiEditorButton);
                this.button.addToGroup('ui');

                transform = this.button.getComponent('Transform');
                transform.setPosition(150, 100, -1);

                this.input = this.uiTextBoxFactory.create('x-textbox', '0.4200', this.uiEditorInput);
                this.input.addToGroup('ui');
                this.input.setDimensions(30, 14, 0);

                transform = this.input.getComponent('Transform');
                transform.setPosition(250, 100, -1);

                this.input = this.uiTextBoxFactory.create('y-textbox', '0.2138', this.uiEditorInput);
                this.input.addToGroup('ui');
                this.input.setDimensions(30, 14, 0);

                transform = this.input.getComponent('Transform');
                transform.setPosition(310, 100, -1);

                this.input = this.uiTextBoxFactory.create('z-textbox', '0.9034', this.uiEditorInput);
                this.input.addToGroup('ui');
                this.input.setDimensions(30, 14, 0);

                transform = this.input.getComponent('Transform');
                transform.setPosition(370, 100, -1);

                this.fpsLabel = this.uiLabelFactory.create('fps-text', 'hello, world', this.uiEditorText);
                this.fpsLabel.addToGroup('ui');

                transform = this.fpsLabel.getComponent('Transform');
                transform.setPosition(100, 150, -1);
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
                for (var i = 0; i < 100; i++) {
                    var block = this.blockFactory.create('block-' + i, sprite.getTexture(), 1, 1, 1);
                    block.getComponent('Block').setAllFacesTo(sprite);
                    block.addComponent(new ColliderBox());

                    transform = block.getComponent('Transform');
                    transform.setPosition((Math.random() - 0.5)*2, (Math.random() - 0.5)*2, (Math.random() - 0.5)*2);
                    transform.setRotationFromEuler(-0.1, -0.1, -0.1);

                    prev.addChild(block);
                    prev = block;
                }
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

                this.camera = this.cameraFactory.create('camera', new Rectangle(0, 0, width, height), 0.1, 1000, 75);

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

                this.screen = this.cameraFactory.create('UICamera', new Rectangle(0, 0, width, height), 0.1, 100);

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

                this.fpsLabel.getComponent('UILabel').setText(this.context.getFramesPerSecond());
            }

        });

        return Workspace;
    }
);
