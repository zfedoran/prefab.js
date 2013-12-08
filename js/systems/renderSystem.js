define([
        'lodash',
        'text!shaders/vertex.shader',
        'text!shaders/fragment.shader',
        'core/subSystem'
    ],
    function(
        _,
        _vertexShaderSource,
        _fragmentShaderSource,
        SubSystem
    ) {
        'use strict';
    
        var RenderSystem = function(entityManager, device) {
            SubSystem.call(this, entityManager, ['Transform', 'MeshFilter', 'MeshRenderer']);
            this.device = device;
            this.shaderCache = {};
        };

        RenderSystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: RenderSystem,

            setDefaultCamera: function(entity) {
                if (entity.hasComponent('Projection') && entity.hasComponent('View')) {
                    this.camera = entity;
                } else {
                    throw 'RenderSystem: the provided entity does not have the "Projection" and "View" components';
                }
            },

            render: function() {
                var entities = this.entityManager.getAllUsingFilter(this.filterHash);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        this.updateRenderer(entity);
                        this.renderMesh(entity);
                    }
                }
            },

            updateRenderer: function(entity) {
                var meshRenderer = entity.getComponent('MeshRenderer');

                if (meshRenderer.isDirty() || meshRenderer.material.isDirty()) {
                    var material = meshRenderer.material;
                    if (typeof material._shader === 'undefined') {
                        var shaderType = material.shadingModel;
                        var shader = this.shaderCache[shaderType];
                        if (typeof shader === 'undefined') {
                            shader = this.generateShader(material);
                            this.shaderCache[shaderType] = shader; 
                            material._shader = shader;
                        }
                    }
                    meshRenderer.setDirty(false);
                }
            },

            generateShader: function(material) {
                var shader = this.device.compileShader(_vertexShaderSource, _fragmentShaderSource);
                return shader;
            },

            renderMesh: function(entity) {
                var transform    = entity.getComponent('Transform');
                var meshFilter   = entity.getComponent('MeshFilter');
                var meshRenderer = entity.getComponent('MeshRenderer');
                var mesh         = meshFilter.mesh;
                var material     = meshRenderer.material;
                var shader       = material._shader;

                // update shader uniforms with material values
                for (var prop in shader.uniforms) {
                    if (material.hasOwnProperty(prop)) {
                        shader.uniforms[prop].set(material[prop]);
                    }
                }

                var view = this.camera.getComponent('View')._viewMatrix;
                var proj = this.camera.getComponent('Projection')._projectionMatrix;

                shader.uniforms.uMMatrix.set(transform._worldMatrix);
                shader.uniforms.uVMatrix.set(view);
                shader.uniforms.uPMatrix.set(proj);

                this.device.bindShader(shader);

                mesh.draw();
            }
        });

        return RenderSystem;
    }
);
