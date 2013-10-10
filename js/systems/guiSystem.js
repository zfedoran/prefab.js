define([
    ], 
    function(
    ) {

        var GUISystem = function(entityManager) {
            this.filter = 'has(gui)';
            this.entityManager = entityManager;
            this.entityManager.addFilter(this.filter, function(entity) {
                return entity.hasComponent('GUIText')
                    || entity.hasComponent('GUIButton')
                    || entity.hasComponent('GUISelect');
            });
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
                var text = entity.getComponent('GUIText');

                if (text.isDirty()) {
                    if (typeof text._textImage === 'undefined') {
                        text._canvas = document.createElement('canvas');
                        text._ctx = text._canvas.getContext('2d');
                    }

                    text._canvas.width = getPowerOfTwo(text._ctx.measureText(text.content));
                    text._canvas.height = getPowerOfTwo(text.size);

                    text._ctx.fillStyle = text.color;
                    text._ctx.textAlign = 'left';
                    text._ctx.textBaseline = 'middle';
                    text._ctx.font = text.size + 'px ' + text.font;
                    text._ctx.fillText(text.content, text._canvas.width / 2, text._canvas.height / 2);
                }
            }
        };

        function getPowerOfTwo(value, pow) {
            pow = pow || 1;
            while(pow<value) {
                pow *= 2;
            }
            return pow;
        }

        return GUISystem;
    }
);
