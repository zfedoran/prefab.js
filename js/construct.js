define([
        'jquery',
        'lodash',
        'math/Rectangle',
        'core/application',
        'controllers/cameraController',
        'controllers/guiController',
        'controllers/blockController',
        'controllers/renderController',
        'controllers/inputController',
        'editor/controllers/gridController',
        'editor/controllers/orbitController',
        'editor/controllers/unwrapController',
        'editor/controllers/viewController',
        'editor/controllers/sceneViewController',
        'editor/controllers/textureViewController',
        'editor/components/sceneView',
        'editor/entities/sceneViewEntity',
        'editor/entities/textureViewEntity',
    ],
    function(
        $,
        _,
        Rectangle,
        Application,
        CameraController,
        GUIController,
        BlockController,
        RenderController,
        InputController,
        GridController,
        OrbitController,
        UnwrapController,
        ViewController,
        SceneViewController,
        TextureViewController,
        SceneView,
        SceneViewEntity,
        TextureViewEntity
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
                this.viewController         = new ViewController(this.context);
                this.sceneViewController    = new SceneViewController(this.context);
                this.textureViewController  = new TextureViewController(this.context);
                this.cameraController       = new CameraController(this.context);
                this.guiController          = new GUIController(this.context);
                this.blockController        = new BlockController(this.context);
                this.gridController         = new GridController(this.context);
                this.orbitController        = new OrbitController(this.context);
                this.renderController       = new RenderController(this.context);
                this.inputController        = new InputController(this.context);
                this.unwrapController       = new UnwrapController(this.context);

                this.context.addBlock(1, 4, 5);

                var w, h;
                w = this.width / 2;
                h = this.height / 2;

                var viewTop     = new SceneViewEntity(new Rectangle(0,0,w,h), SceneView.VIEW_DIRECTION_TOP);
                var viewLeft    = new SceneViewEntity(new Rectangle(0,h,w,h), SceneView.VIEW_DIRECTION_LEFT);
                var viewFront   = new SceneViewEntity(new Rectangle(w,h,w,h), SceneView.VIEW_DIRECTION_FRONT);
                var viewTexture = new TextureViewEntity(new Rectangle(w,0,w,h));

                this.context.entityManager.addEntity(viewTop);
                this.context.entityManager.addEntity(viewLeft);
                this.context.entityManager.addEntity(viewFront);
                this.context.entityManager.addEntity(viewTexture);

                $(window).on('resize', this.onWindowResize.bind(this));
                $(window).on('click', this.onMouseClick.bind(this));
                $(window).on('mousemove', this.onMouseMove.bind(this));
                $(window).on('mouseout', this.onMouseLeave.bind(this));
                $(window).on('mousedown', this.onMouseDown.bind(this));
                $(window).on('mouseup', this.onMouseUp.bind(this));
                $(window).on('mousewheel', this.onMouseWheel.bind(this));
            },

            update: function(elapsed) {
                this.viewController.update();
                this.sceneViewController.update();
                this.textureViewController.update();
                this.cameraController.update();
                this.blockController.update();
                this.gridController.update();
                this.guiController.update();
                this.unwrapController.update();
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
                this.orbitController.onMouseMove(evt.pageX, evt.pageY);
            },

            onMouseDown: function(evt) {
                this.orbitController.onMouseDown(evt.button);
            },

            onMouseUp: function(evt) {
                this.orbitController.onMouseUp(evt.button);
            },

            onMouseClick: function(evt) {
                this.inputController.onMouseClick();
            },

            onMouseWheel: function(evt) {
                this.orbitController.onMouseWheel(evt.originalEvent.wheelDeltaX, evt.originalEvent.wheelDeltaY);
            },

            onMouseLeave: function(evt) {
                this.inputController.onMouseLeave();
                this.orbitController.onMouseLeave();
            }
        });

        return Construct;
    }
);
