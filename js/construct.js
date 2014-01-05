define([
        'jquery',
        'lodash',
        'math/Rectangle',
        'core/application',
        'controllers/cameraController',
        'controllers/guiController',
        'controllers/blockController',
        'controllers/gridController',
        'controllers/renderController',
        'controllers/inputController',
        'editor/views/sceneView',
        'editor/views/textureView'
    ],
    function(
        $,
        _,
        Rectangle,
        Application,
        CameraController,
        GUIController,
        BlockController,
        GridController,
        RenderController,
        InputController,
        SceneView,
        TextureView
    ) {
        'use strict';

        var Construct = function() {
            Application.call(this);
        };

        Construct.prototype = _.create(Application.prototype, {
            constructor: Construct,

            loadAssets: function() {
            },

            unloadAssets: function() {
            },

            init: function() {
                this.cameraController       = new CameraController(this.context);
                this.guiController          = new GUIController(this.context);
                this.blockController        = new BlockController(this.context);
                this.gridController         = new GridController(this.context);
                this.renderController       = new RenderController(this.context);
                this.inputController        = new InputController(this.context);

                this.context.addBlock(1, 4, 5);

                var w, h;
                w = this.width / 2;
                h = this.height / 2;

                this.sceneViewTop          = new SceneView(this.context, new Rectangle(0, 0, w, h), SceneView.VIEW_DIRECTION_TOP);
                this.sceneViewLeft         = new SceneView(this.context, new Rectangle(0, h, w, h), SceneView.VIEW_DIRECTION_LEFT);
                this.sceneViewFront        = new SceneView(this.context, new Rectangle(w, h, w, h), SceneView.VIEW_DIRECTION_FRONT);
                this.textureView           = new TextureView(this.context, new Rectangle(w, 0, w, h));

                $(window).on('resize', this.onWindowResize.bind(this));
                $(window).on('click', this.onMouseClick.bind(this));
                $(window).on('mousemove', this.onMouseMove.bind(this));
                $(window).on('mouseout', this.onMouseLeave.bind(this));
            },

            update: function(elapsed) {
                this.cameraController.update();
                this.blockController.update();
                this.gridController.update();
                this.guiController.update();

                this.sceneViewTop.update(elapsed);
                this.sceneViewLeft.update(elapsed);
                this.sceneViewFront.update(elapsed);
                this.textureView.update(elapsed);
            },

            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);
                
                this.renderController.render();
            },

            onWindowResize: function(evt) {
                this.width  = $(window).width();
                this.height = $(window).height();

                this.context.width  = this.width;
                this.context.height = this.height;

                this.device.setSize(this.width, this.height);
            },

            onMouseMove: function(evt) {
                this.inputController.onMouseMove(evt.pageX, evt.pageY);
            },

            onMouseClick: function(evt) {
                this.inputController.onMouseClick();
            },

            onMouseLeave: function(evt) {
                this.inputController.onMouseLeave();
            }
        });

        return Construct;
    }
);
