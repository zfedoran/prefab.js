define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'graphics/meshFactory',
        'graphics/mesh',
        'graphics/spriteFont',
        'ui/components/uiText'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller,
        MeshFactory,
        Mesh,
        SpriteFont,
        UIText
    ) {
        'use strict';

        /**
        *   This class updates the mesh associated with entities which have a
        *   UIText component.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var UITextController = function(context) {
            Controller.call(this, context);

            this.meshFactory = new MeshFactory(this.device);
            this.fontCache   = {};
        };

        UITextController.prototype = _.create(Controller.prototype, {
            constructor: UITextController,

            /**
            *   Update all entities which contain the UIText and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'UIText', 'MeshFilter', 'MeshRenderer'], function(entity) {
                    var transform = entity.getComponent('Transform');
                    var uiText    = entity.getComponent('UIText');

                    if (uiText.isDirty()) {
                        var meshRenderer = entity.getComponent('MeshRenderer');
                        var meshFilter   = entity.getComponent('MeshFilter');
                        var mesh         = meshFilter.getMesh();

                        if (mesh) {
                            mesh.destroy();
                        } else {
                            mesh = new Mesh(this.device, Mesh.TRIANGLES);
                        }

                        // Check if a SpriteFont exists
                        if (!uiText.spriteFont) {
                            var fontName   = uiText.getFontName();
                            var spriteFont = this.fontCache[fontName];

                            // Create a new SpriteFont if one is not found
                            if (!spriteFont) {
                                spriteFont = new SpriteFont(this.device, {
                                    fontFamily   : uiText.fontFamily,
                                    fontSize     : uiText.fontSize,
                                    antiAlias    : uiText.antiAlias,
                                    invertColors : uiText.invertColors,
                                    firstChar    : 32,
                                    lastChar     : 126
                                });

                                // Set the uiText font
                                uiText.spriteFont = spriteFont;

                                // Update the font cache
                                this.fontCache[uiText.getFontName()] = uiText.spriteFont;
                            } else {

                                // Update the uiText with the cached font
                                uiText.spriteFont = spriteFont;
                            }
                        }

                        // Generate the new uiText mesh
                        this.generateTextMesh(uiText, mesh);

                        // Set the mesh
                        meshFilter.setMesh(mesh);

                        // Set the spriteFont texture on the material
                        meshRenderer.material.diffuseMap = uiText.spriteFont._texture;

                        uiText.setDirty(false);
                    }
                }, this);
            },

            /**
            *   This method splits uiText text into a series of lines according
            *   to the uiText width.
            *
            *   @method generateParagraphLines
            *   @param {uiText}
            *   @returns {lines} An array of strings
            */
            generateParagraphLines: function(uiText) {
                var font         = uiText.spriteFont,
                    text         = uiText.text,
                    maxWidth     = uiText.width,
                    lines        = [],
                    currentLine  = '';

                // Go through all characters in the uiText text
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
            *   Generate the character quads for a uiText and return a mesh.
            *
            *   @method generateTextMesh
            *   @param {uiText}
            *   @returns {mesh}
            */
            generateTextMesh: function(uiText, mesh) {
                this.meshFactory.begin(mesh);

                // Get the sprite font
                var font = uiText.spriteFont;

                // Get the paragraph lines for this uiText
                var lines, autoWidth;
                if (this.multiLine && uiText.width) {
                    lines     = this.generateParagraphLines(uiText);
                    autoWidth = uiText.width;
                } else {
                    lines     = [uiText.text];
                    autoWidth = font.measureText(uiText.text);
                }

                // Get fontFamily meta-data
                var charWidth  = font.getCharWidth();
                var charHeight = font.getCharWidth();

                // Calcualte the uiText height
                var autoHeight = uiText.height || (lines.length * (uiText.lineHeight || charHeight));

                // Set internal width and height values
                uiText._width  = autoWidth;
                uiText._height = autoHeight;

                // Go through each line
                var dx, dy = 0;
                for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                    var currentLine = lines[lineIndex];

                    // Get the new line offset based on the textAlign property
                    if (uiText.textAlign === UIText.TEXT_ALIGN_RIGHT) {
                        // Put the starting position at the end
                        dx = autoWidth - font.measureText(currentLine);
                    } else if (uiText.textAlign === UIText.TEXT_ALIGN_CENTER) {
                        // Put the starting position half way through
                        dx = Math.floor(autoWidth / 2) - Math.floor(font.measureText(currentLine) / 2);
                    } else {
                        dx = 0;
                    }

                    // Go to the next line
                    dy -= uiText.lineHeight || charHeight;

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
                                              dx - Math.floor(autoWidth / 2) * (1 - uiText.anchor.x), 
                                              dy + Math.floor(autoHeight / 2) * (1 + uiText.anchor.y), 
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

        return UITextController;
    }
);
