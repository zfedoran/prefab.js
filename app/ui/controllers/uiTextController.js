define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'graphics/meshFactory',
        'graphics/mesh',
        'graphics/spriteFont',
        'ui/uiStyle',
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
        UIStyle,
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
                this.filterBy(['Transform', 'Dimensions', 'UIText', 'MeshFilter', 'MeshRenderer'], function(entity) {
                    var uiText     = entity.getComponent('UIText');
                    var dimensions = entity.getComponent('Dimensions');

                    if (uiText.isDirty() || dimensions.isDirty()) {
                        var meshRenderer = entity.getComponent('MeshRenderer');
                        var meshFilter   = entity.getComponent('MeshFilter');
                        var mesh         = meshFilter.getMesh();

                        if (mesh) {
                            mesh.destroy();
                        } else {
                            mesh = new Mesh(this.device, Mesh.TRIANGLES);
                        }

                        var uiStyle    = uiText.getCurrentStyle();
                        var spriteFont = uiStyle.getSpriteFont();

                        // Check if a SpriteFont exists
                        if (!spriteFont) {
                            var fontID     = uiStyle.getFontID();
                            var cachedFont = this.fontCache[fontID];

                            // Create a new SpriteFont if one is not found
                            if (!cachedFont) {
                                spriteFont = new SpriteFont(this.device, uiStyle);

                                // Updated the spriteFont cache
                                this.fontCache[fontID] = spriteFont;
                            } else {
                                spriteFont = cachedFont;
                            }

                            // Update the uiText with the cached spriteFont
                            uiStyle.setSpriteFont(spriteFont);
                        }

                        // Generate the new uiText mesh
                        this.generateTextMesh(entity, mesh);

                        // Set the mesh
                        meshFilter.setMesh(mesh);

                        // Set the spriteFont texture on the material
                        meshRenderer.material.diffuseMap = spriteFont._texture;
                        meshRenderer.material.diffuse    = uiStyle.fontColor;

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
            *   @param {maxWidth}
            *   @returns {lines} An array of strings
            */
            generateParagraphLines: function(uiText, maxWidth) {
                var uiStyle     = uiText.getCurrentStyle();
                var spriteFont  = uiStyle.getSpriteFont(),
                    text        = uiText.text,
                    lines       = [],
                    currentLine = '';

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
                        var kerning = spriteFont.getCharKerning(current);

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
            *   @param {entity}
            *   @param {mesh}
            *   @returns {mesh}
            */
            generateTextMesh: function(entity, mesh) {
                var uiText     = entity.getComponent('UIText');
                var dimensions = entity.getComponent('Dimensions');
                var uiStyle    = uiText.getCurrentStyle();
                var spriteFont = uiStyle.getSpriteFont();

                // By definition, for a label to be multiline, it must have a dimension
                var lines, maxWidth;
                if (uiText.multiLine) {
                    maxWidth = dimensions.getWidth();
                    lines    = this.generateParagraphLines(uiText, maxWidth);
                } else {
                    maxWidth = Math.max(dimensions.getWidth(), spriteFont.measureText(uiText.text));
                    lines    = [uiText.text];
                }

                this.meshFactory.begin(mesh);

                // Get fontFamily meta-data
                var charWidth  = spriteFont.getCharWidth();
                var charHeight = spriteFont.getCharWidth();

                // Calcualte the uiText height
                var maxHeight = uiText.height || (lines.length * (uiText.lineHeight || charHeight));

                // Go through each line
                var dx, dy = 0;
                for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                    var currentLine = lines[lineIndex];

                    // Get the new line offset based on the textAlign property
                    if (uiStyle.textAlign === UIStyle.TEXT_ALIGN_RIGHT) {
                        // Put the starting position at the end
                        dx = maxWidth - spriteFont.measureText(currentLine);
                    } else if (uiStyle.textAlign === UIStyle.TEXT_ALIGN_CENTER) {
                        // Put the starting position half way through
                        dx = Math.floor(maxWidth / 2) - Math.floor(spriteFont.measureText(currentLine) / 2);
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
                            var kerning = spriteFont.getCharKerning(currentChar);

                            // Get the sprite for the current glyph
                            var sprite  = spriteFont.getCharSprite(currentChar);

                            // Generate the glyph face
                            this.generateFace(kerning, 
                                              charHeight, 
                                              dx - maxWidth / 2, 
                                              dy + maxHeight / 2, 
                                              sprite);

                            // Set the offset values for the next glyph
                            dx += kerning;
                        }
                    }
                }

                this.meshFactory.end();

                // Set the width and height of the dimensions component
                var boundingBox = mesh.getBoundingBox();
                dimensions.setDimensions(Math.max(boundingBox.getWidth(), maxWidth), 
                                         Math.max(boundingBox.getHeight(), maxHeight));

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
