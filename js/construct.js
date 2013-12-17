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

                this.cameraSystem   = new CameraSystem(this.context);
                this.guiSystem      = new GUISystem(this.context);
                this.blockSystem    = new BlockSystem(this.context);
                this.gridSystem     = new GridSystem(this.context);
                this.renderSystem   = new RenderSystem(this.context);

                this.view3D = new View3D(this.context, new Rectangle(0, 0, this.width, this.height));

                $(window).on('resize', this.onWindowResize.bind(this));
            },

            update: function(elapsed) {
                this.cameraSystem.update();
                this.blockSystem.update();
                this.gridSystem.update();
                this.guiSystem.update();

                this.view3D.update(elapsed);
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
