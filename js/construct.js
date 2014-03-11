define([
        'jquery',
        'lodash',
        'math/Rectangle',
        'core/application',
        'controllers/renderController',
        'controllers/inputController',
        'editor/components/sceneView',
        'editor/entities/sceneViewEntity',
        'editor/entities/textureViewEntity',
    ],
    function(
        $,
        _,
        Rectangle,
        Application,
        RenderController,
        InputController,
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
                this.initControllers();
            },

            unloadAssets: function() {

            },

            init: function() {
                this.context.addBlock(2, 4, 5);

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

                this.initEvents();
            },

            initEvents: function() {
                $(window).on('resize', this.onWindowResize.bind(this));
                $(window).on('mousemove', this.onMouseMove.bind(this));
                $(window).on('mouseout', this.onMouseLeave.bind(this));
                $(window).on('mousedown', this.onMouseDown.bind(this));
                $(window).on('mouseup', this.onMouseUp.bind(this));
                $(window).on('mousewheel', this.onMouseWheel.bind(this));
            },

            initControllers: function() {
                this.controllerList = [];
                this.controllerClassList = [
                    //'controllers/viewController',
                    'controllers/cameraController',
                    'controllers/guiController',
                    'controllers/blockController',
                    'controllers/mouseOverController',
                    'editor/controllers/gridController',
                    'editor/controllers/unwrapController',
                    'editor/controllers/sceneViewController',
                    'editor/controllers/sceneViewCameraController',
                    'editor/controllers/textureViewController',
                    'editor/controllers/textureViewCameraController',
                ];

                requirejs(this.controllerClassList, (function() { 
                    var i, controller;
                    for (i = 0; i < arguments.length; i++) {
                        controller = arguments[i];
                        this.addController(new controller(this.context));
                    }
                }).bind(this));

                this.renderController = new RenderController(this.context);
                this.inputController  = new InputController(this.context);
            },

            addController: function(controller) {
                this.controllerList.push(controller);
            },

            update: function(elapsed) {
                var i, controller;
                for (i = 0; i < this.controllerList.length; i++) {
                    controller = this.controllerList[i];
                    controller.update(elapsed);
                }

                this.inputController.update(elapsed);
            },

            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);
                
                this.renderController.render(elapsed);
            },

            onMouseMove: function(evt) {
                this.inputController.onMouseMove(evt);
            },

            onMouseDown: function(evt) {
                this.inputController.onMouseDown(evt);
            },

            onMouseUp: function(evt) {
                this.inputController.onMouseUp(evt);
            },

            onMouseWheel: function(evt) {
                this.inputController.onMouseWheel(evt);
            },

            onMouseLeave: function(evt) {
                this.inputController.onMouseLeave(evt);
            },

            onWindowResize: function(evt) {
                this.width  = $(window).width();
                this.height = $(window).height();

                this.context.width  = this.width;
                this.context.height = this.height;

                this.device.setSize(this.width, this.height);
            },
        });

        return Construct;
    }
);
