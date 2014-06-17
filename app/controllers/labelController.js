define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'graphics/meshFactory',
        'graphics/mesh',
        'graphics/spriteFont',
        'components/label'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller,
        MeshFactory,
        Mesh,
        SpriteFont,
        Label
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

                    if (label.isDirty()) {
                        var meshRenderer = entity.getComponent('MeshRenderer');
                        var meshFilter   = entity.getComponent('MeshFilter');
                        var mesh         = meshFilter.getMesh();

                        if (mesh) {
                            mesh.destroy();
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
                        meshFilter.setMesh(this.generateLabelMesh(label));

                        // Set the spriteFont texture on the material
                        meshRenderer.material.diffuseMap = label.spriteFont._texture;

                        label.setDirty(false);
                    }
                }, this);
            },

            /**
            *   This method splits label text into a series of lines according
            *   to the label width.
            *
            *   @method generateParagraphLines
            *   @param {label}
            *   @returns {lines} An array of strings
            */
            generateParagraphLines: function(label) {
                var font         = label.spriteFont,
                    text         = label.text,
                    maxWidth     = label.width,
                    lines        = [],
                    currentLine  = '';

                // Go through all characters in the label text
                var dx = 0, i, len = text.length;
                for (i = 0; i < len; i++) {
                    var current      = text.charAt(i);
                    var goToNextLine = (i + 1 === len);

                    // If there is a newline char, go to the next line
                    if (current === '\n') {
                        goToNextLine = true;
                    } else {

                        // Get the kerning for the current glyph
                        var kerning = font.getCharKerning(current);

                        // Only add the character to the current line if there is room for it
                        if (dx > 0 && (dx+kerning) >= maxWidth) {
                            goToNextLine = true;

                            // Try again on the next line
                            i = i - 1;
                        } else {
                            currentLine += current;
                        }

                        // Set the offset values for the next glyph
                        dx += kerning;
                    }

                    // Check if the current line is full
                    if (goToNextLine) {

                        // Add the line to the output array
                        lines.push(currentLine);

                        // Reset local line
                        currentLine  = '';

                        // Reset the x-offset
                        dx = 0;
                    }
                }

                return lines;
            },

            /**
            *   Generate the character quads for a label and return a mesh.
            *
            *   @method generateLabelMesh
            *   @param {label}
            *   @returns {mesh}
            */
            generateLabelMesh: function(label) {
                var mesh = new Mesh(this.device, Mesh.TRIANGLES);
                this.meshFactory.begin(mesh);

                // Get the sprite font
                var font = label.spriteFont;

                // Get the paragraph lines for this label
                var lines, autoWidth;
                if (label.width) {
                    lines     = this.generateParagraphLines(label);
                    autoWidth = label.width;
                } else {
                    lines     = [label.text];
                    autoWidth = font.measureText(label.text);
                }

                // Get fontFamily meta-data
                var charWidth  = font.getCharWidth();
                var charHeight = font.getCharWidth();

                // Calcualte the label height
                var autoHeight = label.height || (lines.length * (label.lineHeight || charHeight));

                // Go through each line
                var dx, dy = 0;
                for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                    var currentLine = lines[lineIndex];

                    // Get the new line offset based on the textAlign property
                    if (label.textAlign === Label.TEXT_ALIGN_RIGHT) {
                        // Put the starting position at the end
                        dx = autoWidth - font.measureText(currentLine);
                    } else if (label.textAlign === Label.TEXT_ALIGN_CENTER) {
                        // Put the starting position half way through
                        dx = (autoWidth / 2) - (font.measureText(currentLine) / 2);
                    } else {
                        dx = 0;
                    }

                    // Go to the next line
                    dy -= label.lineHeight || charHeight;

                    // Go through each character
                    for (var charIndex = 0; charIndex < currentLine.length; charIndex++) {
                        var currentChar = currentLine.charAt(charIndex);

                        // If the current character is not a newline
                        if (currentChar !== '\n') { 
                            // Get the kerning for the current glyph
                            var kerning = font.getCharKerning(currentChar);

                            // Get the sprite for the current glyph
                            var sprite  = font.getCharSprite(currentChar);

                            // Generate the glyph face
                            this.generateFace(kerning, 
                                              charHeight, 
                                              dx - (autoWidth / 2) * (1 - label.anchor.x), 
                                              dy + (autoHeight / 2) * (1 + label.anchor.y), 
                                              sprite);

                            // Set the offset values for the next glyph
                            dx += kerning;
                        }
                    }
                }

                this.meshFactory.end();

                return mesh;
            },

            /**
            *   Generate a quad for a gylph.
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

                this.meshFactory.addVertex(new Vector3( 0 + dx,  0 + dy, 0));
                this.meshFactory.addVertex(new Vector3( 0 + dx,  h + dy, 0));
                this.meshFactory.addVertex(new Vector3( w + dx,  h + dy, 0));
                this.meshFactory.addVertex(new Vector3( w + dx,  0 + dy, 0));

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
