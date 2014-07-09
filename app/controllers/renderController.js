define([
        'lodash',
        'graphics/material',
        'text!shaders/basic/vertex.shader',
        'text!shaders/basic/fragment.shader',
        'text!shaders/textured/vertex.shader',
        'text!shaders/textured/fragment.shader',
        'text!shaders/text/vertex.shader',
        'text!shaders/text/fragment.shader',
        'text!shaders/lambert/vertex.shader',
        'text!shaders/lambert/fragment.shader',
        'core/controller'
    ],
    function(
        _,
        Material,
        _basicVertexShader,
        _basicFragmentShader,
        _texturedVertexShader,
        _texturedFragmentShader,
        _textVertexShader,
        _textFragmentShader,
        _lambertVertexShader,
        _lambertFragmentShader,
        Controller
    ) {
        'use strict';
    
        /**
        *   This controller renders entities which are part of a render group
        *   and have MeshFilter, and MeshRenderer components.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var RenderController = function(context) {
            Controller.call(this, context);

            this.shaderCache = {};
        };

        RenderController.prototype = _.create(Controller.prototype, {
            constructor: RenderController,

            /**
            *   Find all camera entities and render their render groups.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'Camera'], function(entity) {
                    var camera = entity.getComponent('Camera');
                    if (camera.isEnabled() && camera.renderGroups.length > 0) {
                        var i, group;
                        for (i = 0; i < camera.renderGroups.length; i++) {
                            group = camera.renderGroups[i];
                            this.renderGroup(group, camera);
                        }
                    }
                }, this);
            },

            /**
            *   This method renders a group of entites using the provided
            *   camera component.
            *
            *   @method renderGroup
            *   @param {group} The group to render
            *   @param {camera} The camera to use for rendering
            *   @returns {undefined}
            */
            renderGroup: function(group, camera) {
                this.filterBy(group, function(entity) {
                    this.renderEntity(entity, camera);
                }, this);
            },

            /**
            *   Render an entity using the provided camera.
            *
            *   @method renderEntity
            *   @param {entity}
            *   @param {camera}
            *   @returns {undefined}
            */
            renderEntity: function(entity, camera) {
                var meshRenderer = entity.getComponent('MeshRenderer');

                // If this entity has a MeshRenderer and it is enabled
                if (meshRenderer) {
                    if (meshRenderer.isEnabled()) {

                        // Update or create the shader required to render this entity
                        this.updateRenderer(entity);

                        // Render the mesh associated with this entity
                        if (entity.hasComponent('MeshFilter')) {
                            this.renderMesh(entity, camera);
                        }
                    } 
                }

                // Render any child entities
                if (entity.hasChildren()) {
                    for (var i = 0; i < entity.children.length; i++) {
                        this.renderEntity(entity.children[i], camera);
                    }
                }
            },

            /**
            *   This method updates MeshRenderer components and its materials.
            *
            *   @method updateRenderer
            *   @param {entity}
            *   @returns {undefined}
            */
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

            /**
            *   This function generates a shader for the given material.
            *
            *   @method generateShader
            *   @param {material} The material to create a shader for.
            *   @returns {WebGLProgram} The compiled shader program.
            */
            generateShader: function(material) {
                var shader;
                if (material.shadingModel === Material.LAMBERT) {
                    shader = this.device.compileShader(_lambertVertexShader, _lambertFragmentShader);
                } else if (material.shadingModel === Material.TEXTURED) {
                    shader = this.device.compileShader(_texturedVertexShader, _texturedFragmentShader);
                } else if (material.shadingModel === Material.TEXT) {
                    shader = this.device.compileShader(_textVertexShader, _textFragmentShader);
                } else {
                    shader = this.device.compileShader(_basicVertexShader, _basicFragmentShader);
                }
                return shader;
            },

            /**
            *   This function applies the current render state and then draws
            *   an entity using the provided camera.
            *
            *   @method renderMesh
            *   @param {entity}
            *   @param {camera}
            *   @returns {undefined}
            */
            renderMesh: function(entity, camera) {
                var transform    = entity.getComponent('Transform');
                var meshFilter   = entity.getComponent('MeshFilter');
                var meshRenderer = entity.getComponent('MeshRenderer');
                var mesh         = meshFilter.mesh;
                var material     = meshRenderer.material;
                var shader       = material._shader;

                if (typeof mesh === 'undefined') {
                    return;
                }

                // update shader uniforms with material values
                for (var prop in shader.uniforms) {
                    if (material.hasOwnProperty(prop)) {
                        shader.uniforms[prop].set(material[prop]);
                    }
                }

                var view = camera._viewMatrix;
                var proj = camera._projectionMatrix;

                shader.uniforms.uMMatrix.set(transform.getWorldMatrix());
                shader.uniforms.uVMatrix.set(view);
                shader.uniforms.uPMatrix.set(proj);

                this.device.bindShader(shader);
                this.device.setViewport(camera.viewRect.x, camera.viewRect.y, camera.viewRect.width, camera.viewRect.height);

                mesh.draw();
            }
        });

        return RenderController;
    }
);
