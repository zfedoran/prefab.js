define([
        'jquery',
        'lodash',
        'math/Rectangle',
        'core/entityManager',
        'core/application',
        'systems/cameraSystem',
        'systems/guiSystem',
        'systems/blockSystem',
        'systems/gridSystem',
        'systems/renderSystem',
        'editor/sceneView'
    ],
    function(
        $,
        _,
        Rectangle,
        EntityManager,
        Application,
        CameraSystem,
        GUISystem,
        BlockSystem,
        GridSystem,
        RenderSystem,
        SceneView
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
                this.entityManager = new EntityManager();

                this.cameraSystem = new CameraSystem(this.entityManager);
                this.guiSystem = new GUISystem(this.entityManager, this.device);
                this.blockSystem = new BlockSystem(this.entityManager, this.device);
                this.gridSystem = new GridSystem(this.entityManager, this.device);
                this.renderSystem = new RenderSystem(this.entityManager, this.device);

                this.sceneView = new SceneView(this.device, this.entityManager, new Rectangle(0, 0, this.width, this.height));
            },

            update: function(elapsed) {
                this.cameraSystem.update();
                this.blockSystem.update();
                this.gridSystem.update();
                this.guiSystem.update();

                this.sceneView.update(elapsed);
            },

            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);
                
                this.renderSystem.render();
            }
        });

        return Construct;
    }
);
