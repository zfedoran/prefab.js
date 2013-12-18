define([
        'jquery',
        'lodash',
        'math/Rectangle',
        'core/application',
        'core/context',
        'systems/cameraSystem',
        'systems/guiSystem',
        'systems/blockSystem',
        'systems/gridSystem',
        'systems/renderSystem',
        'editor/view3D'
    ],
    function(
        $,
        _,
        Rectangle,
        Application,
        Context,
        CameraSystem,
        GUISystem,
        BlockSystem,
        GridSystem,
        RenderSystem,
        View3D
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
                this.context = new Context(this.device);
                this.context.width  = this.width;
                this.context.height = this.height;

                window.context = this.context;

                this.cameraSystem   = new CameraSystem(this.context);
                this.guiSystem      = new GUISystem(this.context);
                this.blockSystem    = new BlockSystem(this.context);
                this.gridSystem     = new GridSystem(this.context);
                this.renderSystem   = new RenderSystem(this.context);

                this.context.scene.addBlock(1, 1, 1);

                var w, h;
                w = this.width / 2;
                h = this.height / 2;

                this.view3DTop          = new View3D(this.context, new Rectangle(0, 0, w, h));
                this.view3DLeft         = new View3D(this.context, new Rectangle(0, h, w, h));
                this.view3DFront        = new View3D(this.context, new Rectangle(w, h, w, h));
                this.view3DPerspective  = new View3D(this.context, new Rectangle(w, 0, w, h));

                $(window).on('resize', this.onWindowResize.bind(this));
            },

            update: function(elapsed) {
                this.cameraSystem.update();
                this.blockSystem.update();
                this.gridSystem.update();
                this.guiSystem.update();

                this.view3DTop.update(elapsed);
                this.view3DLeft.update(elapsed);
                this.view3DFront.update(elapsed);
                this.view3DPerspective.update(elapsed);
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
                this.view3D.setSize(this.width, this.height);
            }
        });

        return Construct;
    }
);
