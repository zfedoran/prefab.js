define([
        'underscore',
        'math/vector2',
        'math/vector3',
        'math/rectangle',
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
        Rectangle,
        SubSystem,
        GraphicsDevice,
        VertexElement,
        VertexDeclaration,
        SpriteFont,
        PrimitiveBatch
    ) {
        'use strict';

        var GUISystem = function(entityManager, device) {
            SubSystem.call(this, entityManager, ['GUIElement', 'GUILayer']);

            this.fonts = {};
            this.device = device;
            this.vertexDeclaration = new VertexDeclaration([
                new VertexElement(0, VertexElement.Vector3, 'aVertexPosition'),
                new VertexElement(3 * 4, VertexElement.Vector2, 'aVertexUV0')
            ]);
            this.primitiveBatch = new PrimitiveBatch(device, this.vertexDeclaration);
            this.mousePosition = new Vector2();
            this.currentStyleState = new Rectangle();
        };

        GUISystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: GUISystem,

            onMouseMove: function(evt) {
                this.mousePosition.x = evt.pageX;
                this.mousePosition.y = evt.pageY;
            },

            update: function() {
                this.primitiveBatch.begin(GraphicsDevice.TRIANGLES);

                var entities = this.entityManager.getAllUsingFilter(this.filterHash);
                var o, entity, guiElement;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('GUILayer')) {
                            this.updateLayout(entity);
                        }

                        if (entity.hasComponent('GUIText')) {
                            this.updateText(entity);
                        }
                    }
                }

                this.primitiveBatch.end();
            },

            updateLayout: function(entity) {
                var layer = entity.getComponent('GUILayer');

                if (layer.isDirty()) {
                    var transform = entity.getComponent('Transform');
                    var children = transform.children;
                    var i, child;
                    for (i = 0; i < children.length; i++) {
                        child = children[i];
                        if (child.hasComponent('GUIElement')) {
                            this.updateElement(child);
                            //add child width
                        }
                    }

                    layer.setDirty(false);
                }
            },

            updateElement: function(entity, parentState) {
                var element = entity.getComponent('GUIElement');
                var currentStyle = element.getCurrentStyle();
                var currentState = currentStyle.getCurrentState();

                if (element.isDirty()) {
                    currentStyle.updateState(parentState);
                    element.setDirty(false);
                }

                var transform = entity.getComponent('Transform');
                var children = transform.children;
                var i, child;
                for (i = 0; i < children.length; i++) {
                    child = children[i];
                    if (child.hasComponent('GUIElement')) {
                        this.updateElement(child, currentState);
                    }
                }
            },

            updateText: function(entity) {
                var guiElement = entity.getComponent('GUIElement');
                var guiText    = entity.getComponent('GUIText');
                var transform  = entity.getComponent('Transform');
                var fontDef    = guiText.getFontStyle();
                var spriteFont;

                if (guiText.isDirty()) {
                    spriteFont = this.fonts[fontDef];
                    if (typeof spriteFont === 'undefined') {
                        spriteFont = this.generateSpriteFont(guiText);
                        this.fonts[fontDef] = spriteFont; 
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

                spriteFont.sendToGPU(this.device);
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
