define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'graphics/meshFactory',
        'graphics/mesh',
        'graphics/spriteFont'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller,
        MeshFactory,
        Mesh,
        SpriteFont
    ) {
        'use strict';

        /**
        *   This class updates the mesh associated with entities which have a
        *   Label component.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var LabelController = function(context) {
            Controller.call(this, context);

            this.meshFactory = new MeshFactory(this.device);
            this.fontCache   = {};
        };

        LabelController.prototype = _.create(Controller.prototype, {
            constructor: LabelController,

            /**
            *   Update all entities which contain the Label and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'Label', 'MeshFilter', 'MeshRenderer'], function(entity) {
                    var transform    = entity.getComponent('Transform');
                    var label        = entity.getComponent('Label');
                    var meshFilter   = entity.getComponent('MeshFilter');
                    var meshRenderer = entity.getComponent('MeshRenderer');

                    if (label.isDirty()) {
                        if (meshFilter.mesh) {
                            meshFilter.mesh.destroy();
                        }

                        // Check if a SpriteFont exists
                        if (!label.spriteFont) {
                            var fontName   = label.getFontName();
                            var spriteFont = this.fontCache[fontName];

                            // Create a new SpriteFont if one is not found
                            if (!spriteFont) {
                                label.spriteFont = new SpriteFont(this.device, label.fontFamily, label.fontSize);

                                // Update the font cache
                                this.fontCache[label.getFontName()] = label.spriteFont;
                            }
                        }

                        // Generate the new label mesh
                        meshFilter.mesh = this.generateLabelMesh(label);

                        // Set the spriteFont texture on the material
                        meshRenderer.material.diffuseMap = label.spriteFont._texture;

                        label.setDirty(false);
                    }
                }, this);
            },

            /**
            *   Generate the 6 faces of a label and return a mesh.
            *
            *   @method generateLabelMesh
            *   @param {label}
            *   @returns {mesh}
            */
            generateLabelMesh: function(label) {
                var w, h, hw, hh;


                var mesh = new Mesh(this.device, Mesh.TRIANGLES);
                this.meshFactory.begin(mesh);

                // Get fontFamily meta-data
                var font       = label.spriteFont;
                var charWidth  = font.getCharWidth();
                var charHeight = font.getCharWidth();

                var dx = 0, dy = 0;

                // Create the label mesh
                for (var i = 0; i < label.text.length; i++) {
                    var current = label.text.charAt(i);

                    if (current !== '\n') {

                        if (current === '\t') {
                            current = ' ';
                        }

                        // Get the kerning for the current glyph
                        var kerning = font.getCharKerning(current);

                        // Get the sprite for the current glyph
                        var sprite  = font.getCharSprite(current);

                        if (current === '\t') {
                            kerning *= 4;
                        }

                        // Generate the glyph face
                        this.generateFace(kerning, charHeight / 2, dx, dy, sprite);

                        // Set the offset values for the next glyph
                        dx += kerning;
                        if (dx >= label.width) {
                            dx = 0;
                            dy -= label.lineHeight || charHeight;
                        }

                    } else {
                        dx = 0;
                        dy -= label.lineHeight || charHeight;
                    }

                }

                this.meshFactory.end();

                return mesh;
            },

            /**
            *   Generate a gylph face.
            *
            *   @method generateFace
            *   @param {w} width
            *   @param {h} height
            *   @param {dx} x offset
            *   @param {dy} y offset
            *   @param {sprite} sprite texture
            *   @returns {undefined}
            */
            generateFace: function(w, h, dx, dy, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                this.meshFactory.addVertex(new Vector3( 0 + dx, -h + dy, 0));
                this.meshFactory.addVertex(new Vector3( 0 + dx,  h + dy, 0));
                this.meshFactory.addVertex(new Vector3( w + dx,  h + dy, 0));
                this.meshFactory.addVertex(new Vector3( w + dx, -h + dy, 0));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            }
        });

        return LabelController;
    }
);
