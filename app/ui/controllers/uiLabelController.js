define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'graphics/meshFactory',
        'graphics/mesh',
        'graphics/spriteFont',
        'ui/uiStyle',
        'ui/components/uiLabel'
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
        UILabel
    ) {
        'use strict';

        /**
        *   This class updates the mesh associated with entities which have a
        *   UILabel component.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var UILabelController = function(context) {
            Controller.call(this, context);

            this.meshFactory = new MeshFactory(this.device);
            this.fontCache   = {};
        };

        UILabelController.prototype = _.create(Controller.prototype, {
            constructor: UILabelController,

            /**
            *   Update all entities which contain the UILabel and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'Dimensions', 'UILabel', 'MeshFilter', 'MeshRenderer'], function(entity) {
                    var uiLabel    = entity.getComponent('UILabel');
                    var dimensions = entity.getComponent('Dimensions');

                    if (uiLabel.isDirty() || dimensions.isDirty()) {
                        var meshRenderer = entity.getComponent('MeshRenderer');
                        var meshFilter   = entity.getComponent('MeshFilter');
                        var mesh         = meshFilter.getMesh();

                        if (mesh) {
                            mesh.destroy();
                        } else {
                            mesh = new Mesh(this.device, Mesh.TRIANGLES);
                        }

                        var uiStyle    = uiLabel.getCurrentStyle();
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

                            // Update the uiLabel with the cached spriteFont
                            uiStyle.setSpriteFont(spriteFont);
                        }

                        // Generate the new uiLabel mesh
                        this.generateLabelMesh(entity, mesh);

                        // Set the mesh
                        meshFilter.setMesh(mesh);

                        // Set the spriteFont texture on the material
                        meshRenderer.material.diffuseMap = spriteFont._texture;
                        meshRenderer.material.diffuse    = uiStyle.fontColor;

                        uiLabel.setDirty(false);
                    }
                }, this);
            },

            /**
            *   This method splits uiLabel text into a series of lines according
            *   to the uiLabel width.
            *
            *   @method generateParagraphLines
            *   @param {uiLabel}
            *   @param {maxWidth}
            *   @returns {lines} An array of strings
            */
            generateParagraphLines: function(uiLabel, maxWidth) {
                if (!uiLabel.multiLine) {
                    return [uiLabel.getText()];
                }

                var uiStyle     = uiLabel.getCurrentStyle();
                var spriteFont  = uiStyle.getSpriteFont(),
                    text        = uiLabel.getText(),
                    lines       = [],
                    currentLine = '';

                // Go through all characters in the uiLabel text
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
            *   Generate the character quads for a uiLabel and return a mesh.
            *
            *   @method generateLabelMesh
            *   @param {entity}
            *   @param {mesh}
            *   @returns {mesh}
            */
            generateLabelMesh: function(entity, mesh) {
                var uiLabel    = entity.getComponent('UILabel');
                var dimensions = entity.getComponent('Dimensions');
                var bounds     = entity.getComponent('Bounds');
                var uiStyle    = uiLabel.getCurrentStyle();
                var spriteFont = uiStyle.getSpriteFont();

                // By definition, for a label to be multiline, it must have a dimension
                var maxWidth;
                if (uiLabel.multiLine) {
                    maxWidth = dimensions.getWidth();
                } else {
                    maxWidth = spriteFont.measureText(uiLabel.text);
                }

                var lines = this.generateParagraphLines(uiLabel, maxWidth);

                this.meshFactory.begin(mesh);

                // Get fontFamily meta-data
                var charWidth  = spriteFont.getCharWidth();
                var charHeight = spriteFont.getCharWidth();

                // Calcualte the uiLabel height
                var maxHeight = uiLabel.height || (lines.length * (uiLabel.lineHeight || charHeight));

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
                    dy -= uiLabel.lineHeight || charHeight;

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

                // Set the width and height of the bounds component
                var boundingBox = mesh.getBoundingBox();
                bounds.setLocalDimensions(boundingBox.getWidth(), boundingBox.getHeight());

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

        return UILabelController;
    }
);
