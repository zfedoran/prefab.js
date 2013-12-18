define([
        'lodash',
        'graphics/material',
        'text!shaders/basic/vertex.shader',
        'text!shaders/basic/fragment.shader',
        'text!shaders/textured/vertex.shader',
        'text!shaders/textured/fragment.shader',
        'text!shaders/lambert/vertex.shader',
        'text!shaders/lambert/fragment.shader',
        'core/subSystem'
    ],
    function(
        _,
        Material,
        _basicVertexShader,
        _basicFragmentShader,
        _texturedVertexShader,
        _texturedFragmentShader,
        _lambertVertexShader,
        _lambertFragmentShader,
        SubSystem
    ) {
        'use strict';
    
        var RenderSystem = function(context) {
            SubSystem.call(this, context, ['Transform', 'Camera']);

            this.shaderCache = {};
        };

        RenderSystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: RenderSystem,

            render: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];
                        if (entity.hasComponent('Camera')) {
                            var camera = entity.getComponent('Camera');
                            if (camera.isEnabled() && camera.renderGroups.length > 0) {
                                var i, group;
                                for (i = 0; i < camera.renderGroups.length; i++) {
                                    group = camera.renderGroups[i];
                                    this.renderGroup(group, camera);
                                }
                            }
                        }
                    }
                }
            },

            renderGroup: function(group, cameraComponent) {
                var entities = this.entityManager.getAllUsingGroupName(group);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('MeshRenderer')) {
                            this.updateRenderer(entity);
                        }
                        if (entity.hasComponent('MeshFilter')) {
                            this.renderMesh(entity, cameraComponent);
                        }
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
                        }
                        material._shader = shader;
                    }
                    meshRenderer.setDirty(false);
                }
            },

            generateShader: function(material) {
                var shader;
                if (material.shadingModel === Material.LAMBERT) {
                    shader = this.device.compileShader(_lambertVertexShader, _lambertFragmentShader);
                } else if (material.shadingModel === Material.TEXTURED) {
                    shader = this.device.compileShader(_texturedVertexShader, _texturedFragmentShader);
                } else {
                    shader = this.device.compileShader(_basicVertexShader, _basicFragmentShader);
                }
                return shader;
            },

            renderMesh: function(entity, camera) {
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

                var view = camera._viewMatrix;
                var proj = camera._projectionMatrix;

                shader.uniforms.uMMatrix.set(transform._worldMatrix);
                shader.uniforms.uVMatrix.set(view);
                shader.uniforms.uPMatrix.set(proj);

                this.device.bindShader(shader);

                this.device.setViewport(camera.viewRect.x, camera.viewRect.y, camera.viewRect.width, camera.viewRect.height);

                mesh.draw();
            }
        });

        return RenderSystem;
    }
);
