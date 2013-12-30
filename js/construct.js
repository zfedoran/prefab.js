define([
        'jquery',
        'lodash',
        'math/Rectangle',
        'core/application',
        'systems/cameraSystem',
        'systems/guiSystem',
        'systems/blockSystem',
        'systems/gridSystem',
        'systems/renderSystem',
        'editor/sceneView',
        'editor/textureView'
    ],
    function(
        $,
        _,
        Rectangle,
        Application,
        CameraSystem,
        GUISystem,
        BlockSystem,
        GridSystem,
        RenderSystem,
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
                this.cameraSystem       = new CameraSystem(this.context);
                this.guiSystem          = new GUISystem(this.context);
                this.blockSystem        = new BlockSystem(this.context);
                this.gridSystem         = new GridSystem(this.context);
                this.renderSystem       = new RenderSystem(this.context);

                this.context.addBlock(1, 5, 2);

                var w, h;
                w = this.width / 2;
                h = this.height / 2;

                this.sceneViewTop          = new SceneView(this.context, new Rectangle(0, 0, w, h), SceneView.VIEW_DIRECTION_TOP);
                this.sceneViewLeft         = new SceneView(this.context, new Rectangle(0, h, w, h), SceneView.VIEW_DIRECTION_LEFT);
                this.sceneViewFront        = new SceneView(this.context, new Rectangle(w, h, w, h), SceneView.VIEW_DIRECTION_FRONT);
                //this.sceneViewPerspective  = new SceneView(this.context, new Rectangle(w, 0, w, h), SceneView.VIEW_DIRECTION_BACK, SceneView.VIEW_PROJECTION_ORTHO);
                this.textureView           = new TextureView(this.context, new Rectangle(w, 0, w, h));

                $(window).on('resize', this.onWindowResize.bind(this));
            },

            update: function(elapsed) {
                this.cameraSystem.update();
                this.blockSystem.update();
                this.gridSystem.update();
                this.guiSystem.update();

                this.sceneViewTop.update(elapsed);
                this.sceneViewLeft.update(elapsed);
                this.sceneViewFront.update(elapsed);
                //this.sceneViewPerspective.update(elapsed);
                this.textureView.update(elapsed);
            },

            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);
                
                this.renderSystem.render();
            },

            onWindowResize: function(evt) {
                this.width  = $(window).width();
                this.height = $(window).height();

                this.context.width  = this.width;
                this.context.height = this.height;

                this.device.setSize(this.width, this.height);
            }
        });

        return Construct;
    }
);
