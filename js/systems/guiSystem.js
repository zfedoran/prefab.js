define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/subSystem',
        'graphics/device',
        'graphics/vertexElement',
        'graphics/vertexDeclaration',
        'graphics/spriteFont',
        'graphics/primitiveBatch'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        SubSystem,
        GraphicsDevice,
        VertexElement,
        VertexDeclaration,
        SpriteFont,
        PrimitiveBatch
    ) {
        'use strict';

        var GUISystem = function(entityManager, device) {
            SubSystem.call(this, entityManager, ['GUIElement']);

            this.fontCache = {};
            this.device = device;
            this.vertexDeclaration = new VertexDeclaration([
                new VertexElement(0, VertexElement.Vector3, 'aVertexPosition'),
                new VertexElement(3 * 4, VertexElement.Vector2, 'aVertexUV0')
            ]);
            this.primitiveBatch = new PrimitiveBatch(device, this.vertexDeclaration);
            this.mousePosition = new Vector2();
        };

        GUISystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: GUISystem,

            update: function() {
                this.primitiveBatch.begin(GraphicsDevice.TRIANGLES);

                var entities = this.entityManager.getAllUsingFilter(this.filterHash);
                var o, entity, guiElement;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('GUIText')) {
                            this.updateText(entity);
                        }
                    }
                }

                this.primitiveBatch.end();
            },

            updateText: function(entity) {
                var guiElement = entity.getComponent('GUIElement');
                var guiText    = entity.getComponent('GUIText');
                var transform  = entity.getComponent('Transform');
                var fontDef    = guiText.getFontStyle();
                var spriteFont;

                if (guiText.isDirty()) {
                    spriteFont = this.fontCache[fontDef];
                    if (typeof spriteFont === 'undefined') {
                        spriteFont = this.generateSpriteFont(guiText);
                        this.fontCache[fontDef] = spriteFont; 
                    }
                    guiText._spriteFont = spriteFont;
                    guiText.setDirty(false);
                }

                this.generateCharacterMesh(guiElement, guiText);
            },

            generateSpriteFont: function(guiText) {

                var spriteFont = new SpriteFont({
                    fontFamily: guiText.fontFamily,
                    fontSize: guiText.fontSize
                });

                document.body.appendChild(spriteFont._canvas);

                var tmpHACK = this.device.state.getShader();
                tmpHACK.uniforms.uSampler.set(spriteFont);

                return spriteFont;
            },

            generateCharacterMesh: function(guiElement, guiText) {
                var i, len = guiText.content.length;
                var character, sprite, currentWidth = 0, currentHeight = 0;
                var u, v, w, h, a, b, c, d, count;

                for (i = 0; i < len; i++) {
                    character = guiText.content.charAt(i);

                    if (character === '\n') {
                        currentWidth = 0;
                        currentHeight += guiText.lineHeight;
                    } else {
                        sprite = guiText._spriteFont.getSprite(character);

                        if (currentWidth + sprite.width > guiElement.boundingBox.width) {
                            currentWidth = 0;
                            currentHeight += guiText.lineHeight;
                        }
                        currentWidth += sprite.width;

                        u = sprite.getUCoordinate();
                        v = sprite.getVCoordinate();
                        w = sprite.getUVWidth();
                        h = sprite.getUVHeight();

                        a = currentWidth - sprite.width;
                        b = currentWidth;
                        c = currentHeight - sprite.height;
                        d = currentHeight;

                        this.primitiveBatch.addVertex(a, c, 0, u, v);
                        this.primitiveBatch.addVertex(b, c, 0, u+w, v);
                        this.primitiveBatch.addVertex(b, d, 0, u+w, v+h);

                        this.primitiveBatch.addVertex(a, c, 0, u, v);
                        this.primitiveBatch.addVertex(b, d, 0, u+w, v+h);
                        this.primitiveBatch.addVertex(a, d, 0, u, v+h);
                    }
                }
            }
        });

        return GUISystem;
    }
);
