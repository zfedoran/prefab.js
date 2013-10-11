define([
        'components/meshFilter',
        'graphics/mesh',
        'graphics/spriteFont'
    ], 
    function(
        MeshFilter,
        Mesh,
        SpriteFont
    ) {

        var GUISystem = function(entityManager) {
            this.filter = 'has(gui)';
            this.entityManager = entityManager;
            this.entityManager.addFilter(this.filter, function(entity) {
                return entity.hasComponent('GUIText')
                    || entity.hasComponent('GUIButton')
                    || entity.hasComponent('GUISelect');
            });

            this.fonts = {};
        };

        GUISystem.prototype = {
            constructor: GUISystem,
            update: function() {
                var entities = this.entityManager.getAllUsingFilter(this.filter);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('GUIText')) {
                            this.updateText(entity);
                        }
                    }
                }
            },
            updateText: function(entity) {
                var text       = entity.getComponent('GUIText');
                var meshFilter = entity.getComponent('MeshFilter');
                var transform  = entity.getComponent('Transform');
                var fontDef    = text.getFontStyle();
                var spriteFont;

                if (text.isDirty()) {
                    // check if we need to generate a new sprite sheet
                    spriteFont = this.fonts[fontDef];
                    if (typeof spriteFont === 'undefined') {
                        spriteFont = new SpriteFont({
                            fontFamily: text.fontFamily,
                            fontSize: text.fontSize
                        });
                        this.fonts[fontDef] = spriteFont; 
                    }
                    text._spriteFont = spriteFont;
                    
                    if (typeof meshFilter === 'undefined') {
                        meshFilter = new MeshFilter();
                        entity.addComponent(meshFilter);
                    }
                    if (typeof meshFilter.mesh === 'undefined') {
                        meshFilter.mesh = new Mesh();
                    }
                    var mesh = meshFilter.mesh;

                    // create the character mesh
                    var i, len = text.content.length;
                    var character, sprite, currentWidth = 0, currentHeight = 0;
                    var u, v, w, h, a, b, c, d, count;
                    for (i = 0; i < len; i++) {
                        character = text.content.charAt(i);
                        sprite = text._spriteFont.getSprite(character);

                        if (currentWidth + sprite.width <= text.boundingBox.width) {
                            currentWidth += sprite.width;
                        } else {
                            currentWidth = 0;
                            currentHeight += text.lineHeight;
                        }

                        u = sprite.getUCoordinate();
                        v = sprite.getVCoordinate();
                        w = sprite.getUVWidth();
                        h = sprite.getUVHeight();

                        a = currentWidth - sprite.width;
                        b = currentWidth;
                        c = currentHeight - sprite.height;
                        d = currentHeight;

                        mesh.addVertex(new Vector3(a, c, 0));
                        mesh.addVertex(new Vector3(b, c, 0));
                        mesh.addVertex(new Vector3(b, d, 0));
                        mesh.addVertex(new Vector3(a, d, 0));

                        mesh.addUV(new Vector2(u,     v));
                        mesh.addUV(new Vector2(u + w, v));
                        mesh.addUV(new Vector2(u + w, v + h));
                        mesh.addUV(new Vector2(u,     v + h));

                        count = mesh.getVertexCount();
                        a = count - 4;
                        b = count - 3;
                        c = count - 2;
                        d = count - 1;
                        mesh.addTriangle(a, b, c);
                        mesh.addTriangle(a, c, d);
                    }
                }
            }
        };

        return GUISystem;
    }
);
